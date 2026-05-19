/**
 * RAUM IM LEBEN — form.js
 * Client-side validation and simple UI feedback for forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.validate-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      
      // Reset all errors
      form.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
        const input = group.querySelector('.form-input, .form-select, .form-textarea');
        if (input) input.classList.remove('error');
      });

      // Simple validation check
      requiredFields.forEach(field => {
        const group = field.closest('.form-group');
        
        if (!field.value.trim()) {
          isValid = false;
          if (group) group.classList.add('has-error');
          field.classList.add('error');
        } else if (field.type === 'email') {
          // Simple email regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            isValid = false;
            if (group) {
              group.classList.add('has-error');
              const errorText = group.querySelector('.form-error');
              if (errorText) errorText.textContent = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
            }
            field.classList.add('error');
          }
        }
      });

      if (isValid) {
        // Here you would normally send the data to a backend via fetch/XHR.
        // For this frontend template, we just show the success message.
        
        const wrapper = form.closest('.form-wrapper');
        const successMsg = wrapper.querySelector('.form-success');
        
        form.style.display = 'none';
        if (successMsg) successMsg.classList.add('visible');
        
        // Optionally scroll to top of form wrapper
        wrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Clear error on input
    const inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const group = input.closest('.form-group');
        if (group) group.classList.remove('has-error');
      });
    });
  });
});
