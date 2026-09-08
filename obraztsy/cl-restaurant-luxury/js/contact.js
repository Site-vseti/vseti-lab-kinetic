/* ==========================================================================
   CONTACT.JS - Interactive Contact Form, Validation, and EmailJS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize FAQ Accordion
    initFaqAccordion();
    
    // 2. Form Real-Time Validation and Submission
    initContactForm();
});

/**
 * Handles FAQ Accordion toggle states, height transitions, and ARIA updates
 */
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.currentTarget.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isExpanded = e.currentTarget.getAttribute('aria-expanded') === 'true';
            
            // Close other items for a clean accordion experience
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            // Toggle active state
            item.classList.toggle('active');
            e.currentTarget.setAttribute('aria-expanded', !isExpanded ? 'true' : 'false');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                answer.style.maxHeight = null;
            }
        });
        
        // Keyboard focus indicators & support
        btn.addEventListener('keydown', (e) => {
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

/**
 * Handles validation, loading spinner indicators, EmailJS hooks, and Success Modal
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    const submitBtn = form.querySelector('.btn-submit');
    const successModal = document.getElementById('contact-success-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    
    // EmailJS Placeholder Credentials
    const EMAILJS_PUBLIC_KEY = 'user_placeholder_letoile_2026';
    const EMAILJS_SERVICE_ID = 'service_placeholder';
    const EMAILJS_TEMPLATE_ID = 'template_placeholder';
    
    // Initialize EmailJS if the library is loaded
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
    
    // Attach real-time input event listeners
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
            checkFormValidity();
        });
        
        input.addEventListener('blur', () => {
            validateField(input);
            checkFormValidity();
        });
    });
    
    // Check validity initially to make sure styling matches
    checkFormValidity();
    
    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let allValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                allValid = false;
            }
        });
        
        if (!allValid) return;
        
        // Show Loading State
        setLoading(true);
        
        // Prepare data to send
        const formData = new FormData(form);
        const nameVal = formData.get('user_name');
        const emailVal = formData.get('user_email');
        const subjectVal = form.querySelector('#contact-subject option:checked').text;
        
        if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'service_placeholder') {
            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
                .then(() => {
                    handleSuccess(nameVal, emailVal, subjectVal);
                }, (error) => {
                    console.error('EmailJS Failed...', error);
                    handleError();
                });
        } else {
            // Simulated local fallback for development/portfolio purposes
            setTimeout(() => {
                console.warn('EmailJS: Simulated sending message.');
                handleSuccess(nameVal, emailVal, subjectVal);
            }, 1500);
        }
    });
    
    // Close Modal Event Link
    if (modalCloseBtn && successModal) {
        modalCloseBtn.addEventListener('click', () => {
            successModal.classList.remove('open');
            successModal.setAttribute('aria-hidden', 'true');
            if (window.lenis) window.lenis.start();
            submitBtn.focus();
        });
        
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                modalCloseBtn.click();
            }
        });
        
        // Modal accessibility escape focus trap
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successModal.classList.contains('open')) {
                modalCloseBtn.click();
            }
        });
    }
    
    /**
     * Validates a single input element and updates its UI class lists
     */
    function validateField(input) {
        const group = input.closest('.form-group');
        const errorMsg = group.querySelector('.validation-message');
        let isValid = true;
        let message = '';
        
        const value = input.value.trim();
        
        if (input.hasAttribute('required') && value === '') {
            isValid = false;
            message = 'This field is required.';
        } else if (input.type === 'email' && value !== '') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address.';
            }
        } else if (input.id === 'contact-phone' && value !== '') {
            const phoneRegex = /^\+?[0-9\s-]{10,15}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid phone number (min 10 digits).';
            }
        } else if (input.tagName === 'TEXTAREA' && value !== '' && value.length < 10) {
            isValid = false;
            message = 'Message must be at least 10 characters long.';
        }
        
        if (isValid) {
            group.classList.remove('invalid');
            group.classList.add('valid');
            if (errorMsg) errorMsg.style.display = 'none';
        } else {
            group.classList.remove('valid');
            group.classList.add('invalid');
            if (errorMsg) {
                errorMsg.innerText = message;
                errorMsg.style.display = 'block';
            }
        }
        
        return isValid;
    }
    
    /**
     * Checks all form inputs to toggle disabled state on the submit button
     */
    function checkFormValidity() {
        let isValid = true;
        inputs.forEach(input => {
            const group = input.closest('.form-group');
            // If empty and required, or has invalid class, mark false
            if ((input.hasAttribute('required') && input.value.trim() === '') || group.classList.contains('invalid')) {
                isValid = false;
            }
        });
        
        submitBtn.disabled = !isValid;
    }
    
    /**
     * Sets form controls loading state
     */
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.classList.add('btn-loading');
            submitBtn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            inputs.forEach(input => input.disabled = true);
        } else {
            submitBtn.classList.remove('btn-loading');
            submitBtn.innerHTML = 'Send Message';
            submitBtn.disabled = false;
            inputs.forEach(input => input.disabled = false);
        }
    }
    
    /**
     * Successfully sent callback
     */
    function handleSuccess(name, email, subject) {
        setLoading(false);
        
        // Populate Summary details in Modal
        document.getElementById('summary-name').innerText = name;
        document.getElementById('summary-email').innerText = email;
        document.getElementById('summary-subject').innerText = subject;
        
        // Open Modal Overlay
        successModal.classList.add('open');
        successModal.setAttribute('aria-hidden', 'false');
        
        // Stop scroll on page
        if (window.lenis) window.lenis.stop();
        
        // Focus modal close button for accessibility
        setTimeout(() => modalCloseBtn.focus(), 100);
        
        // Reset Form
        form.reset();
        inputs.forEach(input => {
            const group = input.closest('.form-group');
            group.classList.remove('valid', 'invalid');
        });
        
        checkFormValidity();
    }
    
    /**
     * Error callback
     */
    function handleError() {
        setLoading(false);
        alert('An error occurred while sending your message. Please try again or contact us directly at reservations@letoile.com.');
    }
}
