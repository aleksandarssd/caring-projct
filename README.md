# Raum im Leben — Alltagsbegleitung & Unterstützung

Eine moderne, warmherzige und barrierefreie Website für die **Raum im Leben Service UG**, einem deutschen Dienstleister für Alltagsbegleitung, Haushaltshilfe und Entlastung pflegender Angehöriger.

Dieses Projekt wurde mit einem starken Fokus auf **menschliche Wärme, Barrierefreiheit (für Senioren und deren Angehörige) und Konversion** entwickelt.

---

## 🎨 Design-Philosophie & Ästhetik

Die Website bricht mit dem typischen "Tech-Startup"- oder sterilen "Krankenhaus"-Look. Sie ist darauf ausgelegt, sofort Vertrauen und Ruhe auszustrahlen.

*   **Farbpalette:** 
    *   `Creme-Weiß (#FAF8F4)` als warmer, wohnlicher Hintergrund.
    *   `Tannengrün (#3D6B52)` als beruhigende, vertrauenswürdige Primärfarbe.
    *   `Terracotta (#C8694A)` als emotionaler, einladender Akzent für Call-to-Actions (CTAs).
*   **Typografie:** Die klassische und würdevolle **Lora** (Serifen) für Überschriften kombiniert mit der hochgradig lesbaren **Inter** (Sans-Serif) für Fließtexte.
*   **Barrierefreiheit:** Erhöhte Basis-Schriftgrößen (18px), klare Kontraste, sichtbare Fokus-Indikatoren, semantisches HTML und Tastatur-Navigierbarkeit (inkl. Skip-to-Main-Link) für ältere Nutzer.

---

## 🛠️ Features & Seitenstruktur

1.  **Startseite (One-Pager - `index.html`):**
    *   **Hero-Bereich:** Klare emotionale Botschaft mit direktem CTA.
    *   **Unsere Leistungen:** 5 detaillierte Service-Karten (Alltagsbegleitung, Begleitdienste, Hauswirtschaft, Entlastung & **Beratungseinsätze §37,3 SGB XI**).
    *   **Für wen:** Zielgruppenspezifische Checkliste.
    *   **So arbeiten wir:** Transparenter 3-Schritte-Ablauf und Zitat-Banner.
    *   **Vertrauens-Bereich:** Warum Raum im Leben? (Flexibilität, Würde, Transparenz).
2.  **Kontaktseite (`contact.html`):**
    *   Ein barrierefreies Anfrageformular mit Pflegegrad- und Leistungs-Auswahl.
    *   Clientseitige Formularvalidierung in deutscher Sprache mit klaren Fehleranzeigen.
3.  **Jobs / Karriere (`jobs.html`):**
    *   "Wir suchen Menschen, keine Lebensläufe." — Einladung für empathische Bewerber mit integriertem Bewerbungsformular.

---

## 🚀 Technologie-Stack

*   **Struktur:** Semantisches HTML5.
*   **Styling:** Modernes, modulares CSS3 (Variablen, Flexbox, Grid) — komplett ohne Frameworks oder Abhängigkeiten für ultraschnelle Ladezeiten.
*   **Interaktion:** Minimales, performantes Vanilla JavaScript für:
    *   Mobile Hamburger-Menü-Steuerung.
    *   Scroll-Spy (dynamisches Hervorheben der aktiven Sektion).
    *   Sticky-Header-Effekt.
    *   Deutsche Formularvalidierung und Erfolgsmeldungen.

---

## 📂 Ordnerstruktur

```text
raum-im-leben/
│
├── index.html          # Die Hauptseite (One-Pager)
├── contact.html        # Kontaktformular
├── jobs.html           # Jobs- & Karriereseite
├── image_prompts.md    # KI-Prompts für die Bilderzeugung
├── LICENSE             # MIT Lizenz
├── README.md           # Projektdokumentation
│
├── css/
│   ├── main.css        # Design-System, CSS-Variablen & Basis-Reset
│   ├── components.css  # Layout-Elemente (Nav, Footer, Cards, Buttons)
│   └── pages.css       # Spezifische Formular- & Seitenstile
│
├── js/
│   ├── main.js         # Navigation, Scroll-Effekte & Scroll-Spy
│   └── form.js         # Validierung der Kontakt- und Jobformulare
│
└── images/
    ├── hero-section.webp
    ├── target-audience.webp
    ├── services-support.webp
    ├── household-assistance.webp
    └── jobs-hero.webp
```

---

## 💻 Lokale Entwicklung

Da es sich um eine statische Website handelt, ist keine komplexe Installation erforderlich:

1.  Repository klonen:
    ```bash
    git clone https://github.com/aleksandarssd/caring-projct.git
    ```
2.  `index.html` direkt in jedem beliebigen Browser öffnen oder einen lokalen Live-Server (z. B. VS Code Live Server) nutzen.

---

## 📝 Lizenz

Dieses Projekt ist unter der **MIT-Lizenz** lizenziert. Weitere Details finden Sie in der [LICENSE](LICENSE)-Datei.
