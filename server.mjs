import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Try loading .env if available
try {
  if (process.loadEnvFile) {
    const envCandidate = ['.env', 'caring-projct-main/.env'].find(f => fs.existsSync(f));
    if (envCandidate) process.loadEnvFile(envCandidate);
  }
} catch {
  // Ignore missing or malformed env file
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine web root
let WEB_ROOT = __dirname;
if (!fs.existsSync(path.join(WEB_ROOT, 'index.html')) && fs.existsSync(path.join(WEB_ROOT, 'caring-projct-main', 'index.html'))) {
  WEB_ROOT = path.join(WEB_ROOT, 'caring-projct-main');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.pdf': 'application/pdf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

// Helper: read raw body
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Enhance res with status and json helpers
function wrapRes(res) {
  const wrapped = res;
  wrapped.status = function(code) {
    this.statusCode = code;
    return this;
  };
  wrapped.json = function(data) {
    if (!this.headersSent) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    this.end(JSON.stringify(data));
    return this;
  };
  return wrapped;
}

// Handlers for API
async function handleSendContact(req, res) {
  wrapRes(res);
  try {
    const raw = await getRawBody(req);
    let data = {};
    try {
      data = JSON.parse(raw.toString('utf-8'));
    } catch {
      return res.status(400).json({ error: 'Ungültiges JSON-Format.' });
    }

    if (!data.name || !data.email) {
      return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' });
    }

    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (hasSmtp) {
      const handlerModule = await import(path.join(WEB_ROOT, 'api', 'send-contact.js'));
      req.body = data;
      return handlerModule.default(req, res);
    } else {
      console.log('\n[DEV] ✉️  Kontaktanfrage empfangen (Entwicklungsmodus):');
      console.log(`  Name:        ${data.name}`);
      console.log(`  E-Mail:      ${data.email}`);
      console.log(`  Telefon:     ${data.phone || '—'}`);
      console.log(`  Leistung:    ${data.leistung || '—'}`);
      console.log(`  Pflegegrad:  ${data.pflegegrad || '—'}`);
      console.log(`  Ort:         ${data.city || '—'}`);
      console.log(`  Nachricht:   ${data.message || '—'}`);
      console.log('  ℹ️  Hinweis: SMTP nicht in .env konfiguriert; Übermittlung für lokale Tests simuliert.\n');
      return res.status(200).json({ ok: true, devMode: true });
    }
  } catch (err) {
    console.error('[send-contact error]', err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

async function handleSendApplication(req, res) {
  wrapRes(res);
  try {
    const hasSmtp = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
    if (hasSmtp) {
      const handlerModule = await import(path.join(WEB_ROOT, 'api', 'send-application.js'));
      return handlerModule.default(req, res);
    } else {
      let busboyModule;
      try {
        busboyModule = (await import('busboy')).default;
      } catch {}

      if (busboyModule) {
        const bb = busboyModule({ headers: req.headers });
        const fields = {};
        const files = [];
        bb.on('field', (name, val) => { fields[name] = val; });
        bb.on('file', (name, stream, info) => {
          let size = 0;
          stream.on('data', chunk => { size += chunk.length; });
          stream.on('end', () => { files.push({ name: info.filename, size }); });
        });
        bb.on('finish', () => {
          console.log('\n[DEV] 🌟 Bewerbung empfangen (Entwicklungsmodus):');
          console.log(`  Name:        ${fields.name || '—'}`);
          console.log(`  E-Mail:      ${fields.email || '—'}`);
          console.log(`  Telefon:     ${fields.phone || '—'}`);
          console.log(`  Nachricht:   ${fields.message || '—'}`);
          console.log(`  Dateien:     ${files.length > 0 ? files.map(f => `${f.name} (${Math.round(f.size/1024)} KB)`).join(', ') : 'Keine'}`);
          console.log('  ℹ️  Hinweis: SMTP nicht in .env konfiguriert; Übermittlung für lokale Tests simuliert.\n');
          res.status(200).json({ ok: true, devMode: true });
        });
        req.pipe(bb);
      } else {
        console.log('\n[DEV] 🌟 Bewerbung empfangen (Entwicklungsmodus)\n');
        res.status(200).json({ ok: true, devMode: true });
      }
    }
  } catch (err) {
    console.error('[send-application error]', err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(urlObj.pathname);

  // API routing
  if (pathname === '/api/send-contact') {
    if (req.method === 'POST') return handleSendContact(req, res);
    res.writeHead(405).end('Method Not Allowed');
    return;
  }
  if (pathname === '/api/send-application') {
    if (req.method === 'POST') return handleSendApplication(req, res);
    res.writeHead(405).end('Method Not Allowed');
    return;
  }

  // Static file routing
  if (pathname === '/') pathname = '/index.html';

  let filePath = path.join(WEB_ROOT, pathname);

  // Clean URLs: /contact -> /contact.html
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath += '.html';
  }

  // Security check: directory traversal
  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(path.resolve(WEB_ROOT))) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="de">
        <head><meta charset="utf-8"><title>404 - Nicht gefunden</title></head>
        <body style="font-family:sans-serif;text-align:center;padding:50px;">
          <h1>404 - Seite nicht gefunden</h1>
          <p><a href="/">Zurück zur Startseite</a></p>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Range support (required for video playback/seeking, esp. Safari/iOS)
    const range = req.headers.range;
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m) {
      let start = m[1] === '' ? stats.size - parseInt(m[2], 10) : parseInt(m[1], 10);
      let end = m[1] !== '' && m[2] !== '' ? parseInt(m[2], 10) : stats.size - 1;
      end = Math.min(end, stats.size - 1);
      if (isNaN(start) || start < 0 || start > end) {
        res.writeHead(416, { 'Content-Range': `bytes */${stats.size}` }).end();
        return;
      }
      res.writeHead(206, {
        'Content-Type': contentType,
        'Content-Length': end - start + 1,
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
});

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`==================================================`);
  console.log(`  🌿 Raum im Leben - Lokaler Entwicklungsserver`);
  console.log(`==================================================`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Network: http://${HOST}:${PORT}`);
  console.log(`  Root:    ${WEB_ROOT}`);
  console.log(`==================================================`);
});
