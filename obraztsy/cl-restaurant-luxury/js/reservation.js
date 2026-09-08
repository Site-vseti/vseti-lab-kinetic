/* ==========================================================================
   RESERVATION.JS - Premium Reservation Form Interactions & EmailJS Integration
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all reservation form components
    initGuestSelector();
    initTimeSlots();
    initPreferenceCards();
    initOccasionCards();
    initReservationSummary();
    initFAQAccordion();
    initReservationForm();
});

// Guest Selector
function initGuestSelector() {
    const guestCount = document.getElementById('guest-count');
    const guestDisplay = document.getElementById('guest-count-display');
    const decreaseBtn = document.querySelector('.guest-decrease');
    const increaseBtn = document.querySelector('.guest-increase');
    
    let count = 2;
    const minGuests = 1;
    const maxGuests = 20;
    
    function updateGuestCount() {
        guestCount.textContent = count;
        guestDisplay.value = `${count} Guest${count !== 1 ? 's' : ''}`;
        
        // Update button states
        decreaseBtn.disabled = count <= minGuests;
        increaseBtn.disabled = count >= maxGuests;
        
        // Update summary
        updateSummary();
    }
    
    decreaseBtn.addEventListener('click', () => {
        if (count > minGuests) {
            count--;
            updateGuestCount();
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        if (count < maxGuests) {
            count++;
            updateGuestCount();
        }
    });
    
    // Initialize
    updateGuestCount();
}

// Time Slot Selection
function initTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-slot:not(.disabled)');
    const timeInput = document.getElementById('reservation-time');
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            // Remove selected from all
            timeSlots.forEach(s => s.classList.remove('selected'));
            
            // Add selected to clicked
            slot.classList.add('selected');
            
            // Update input
            const timeValue = slot.getAttribute('data-time');
            const displayTime = slot.getAttribute('data-display');
            timeInput.value = displayTime;
            timeInput.setAttribute('data-value', timeValue);
            
            // Update summary
            updateSummary();
        });
    });
}

// Table Preference Cards
function initPreferenceCards() {
    const preferenceCards = document.querySelectorAll('.preference-card');
    let selectedPreference = null;
    
    preferenceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            preferenceCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected to clicked
            card.classList.add('selected');
            selectedPreference = card.getAttribute('data-value');
            
            // Update summary
            updateSummary();
        });
    });
}

// Occasion Cards
function initOccasionCards() {
    const occasionCards = document.querySelectorAll('.occasion-card');
    let selectedOccasion = null;
    
    occasionCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove selected from all
            occasionCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected to clicked
            card.classList.add('selected');
            selectedOccasion = card.getAttribute('data-value');
            
            // Update summary
            updateSummary();
        });
    });
}

// Live Reservation Summary
function initReservationSummary() {
    const summaryToggle = document.getElementById('summary-toggle');
    const reservationSummary = document.getElementById('reservation-summary');
    
    summaryToggle.addEventListener('click', () => {
        reservationSummary.classList.toggle('collapsed');
    });
    
    // Listen for input changes
    const formInputs = document.querySelectorAll('#reservation-form input, #reservation-form textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', updateSummary);
        input.addEventListener('change', updateSummary);
    });
}

function updateSummary() {
    const nameInput = document.getElementById('full-name');
    const dateInput = document.getElementById('reservation-date');
    const timeInput = document.getElementById('reservation-time');
    const guestDisplay = document.getElementById('guest-count-display');
    
    const summaryName = document.getElementById('summary-name');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryGuests = document.getElementById('summary-guests');
    const summaryTable = document.getElementById('summary-table');
    const summaryOccasion = document.getElementById('summary-occasion');
    
    // Update name
    summaryName.textContent = nameInput.value || '--';
    
    // Update date
    if (dateInput.value) {
        const date = new Date(dateInput.value);
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        summaryDate.textContent = date.toLocaleDateString('en-US', options);
    } else {
        summaryDate.textContent = '--';
    }
    
    // Update time
    summaryTime.textContent = timeInput.value || '--';
    
    // Update guests
    summaryGuests.textContent = guestDisplay.value || '--';
    
    // Update table preference
    const selectedTable = document.querySelector('.preference-card.selected');
    summaryTable.textContent = selectedTable ? selectedTable.querySelector('span').textContent : '--';
    
    // Update occasion
    const selectedOccasionCard = document.querySelector('.occasion-card.selected');
    summaryOccasion.textContent = selectedOccasionCard ? selectedOccasionCard.querySelector('span').textContent : '--';
}

// FAQ Accordion
function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });
            
            // Toggle current item
            if (!isExpanded) {
                faqItem.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Reservation Form Submission & EmailJS
function initReservationForm() {
    const form = document.getElementById('reservation-form');
    const successModal = document.getElementById('success-modal');
    const successModalClose = document.getElementById('success-modal-close');
    
    // Set minimum date to today
    const dateInput = document.getElementById('reservation-date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Get form data
        const formData = {
            fullName: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            date: document.getElementById('reservation-date').value,
            time: document.getElementById('reservation-time').value,
            guests: document.getElementById('guest-count-display').value,
            table: document.querySelector('.preference-card.selected')?.getAttribute('data-value') || 'Not specified',
            occasion: document.querySelector('.occasion-card.selected')?.getAttribute('data-value') || 'Not specified',
            dietary: document.getElementById('dietary-requirements').value,
            requests: document.getElementById('special-requests').value
        };
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
        submitBtn.disabled = true;
        
        try {
            // Send email via EmailJS
            await sendReservationEmail(formData);
            
            // Show success modal
            showSuccessModal(formData);
            
            // Reset form
            form.reset();
            document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
            document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
            
            // Reset guest count
            document.getElementById('guest-count').textContent = '2';
            document.getElementById('guest-count-display').value = '2 Guests';
            
        } catch (error) {
            console.error('Reservation error:', error);
            alert('There was an error processing your reservation. Please try again or call us directly.');
        } finally {
            // Reset button state
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
    
    // Close success modal
    successModalClose.addEventListener('click', () => {
        successModal.classList.remove('open');
        successModal.setAttribute('aria-hidden', 'true');
        if (window.lenis) window.lenis.start();
    });
    
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('open');
            successModal.setAttribute('aria-hidden', 'true');
            if (window.lenis) window.lenis.start();
        }
    });
    
    // Keyboard close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('open')) {
            successModal.classList.remove('open');
            successModal.setAttribute('aria-hidden', 'true');
            if (window.lenis) window.lenis.start();
        }
    });
}

function validateForm() {
    const fullName = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('reservation-date').value;
    const time = document.getElementById('reservation-time').value;
    
    // Basic validation
    if (!fullName || !email || !phone || !date || !time) {
        alert('Please fill in all required fields.');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return false;
    }
    
    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        alert('Please enter a valid phone number.');
        return false;
    }
    
    return true;
}

async function sendReservationEmail(formData) {
    // EmailJS Configuration - Replace with your actual service ID, template ID, and public key
    const SERVICE_ID = 'YOUR_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
    
    // Initialize EmailJS (only once)
    if (typeof emailjs !== 'undefined' && !emailjs.initialized) {
        emailjs.init(PUBLIC_KEY);
        emailjs.initialized = true;
    }
    
    // Prepare email parameters
    const templateParams = {
        to_name: 'L\'Étoile Reservations',
        from_name: formData.fullName,
        from_email: formData.email,
        from_phone: formData.phone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        number_of_guests: formData.guests,
        table_preference: formData.table,
        occasion: formData.occasion,
        dietary_requirements: formData.dietary || 'None',
        special_requests: formData.requests || 'None'
    };
    
    // Send email
    if (typeof emailjs !== 'undefined') {
        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
        } catch (error) {
            console.log('EmailJS not configured - skipping email send');
            // For demo purposes, we'll continue without email
        }
    } else {
        console.log('EmailJS not loaded - skipping email send');
    }
}

function showSuccessModal(formData) {
    const successModal = document.getElementById('success-modal');
    
    // Update success modal content
    document.getElementById('success-name').textContent = formData.fullName;
    
    const date = new Date(formData.date);
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('success-date').textContent = date.toLocaleDateString('en-US', options);
    
    document.getElementById('success-time').textContent = formData.time;
    document.getElementById('success-guests').textContent = formData.guests;
    
    // Show modal
    successModal.classList.add('open');
    successModal.setAttribute('aria-hidden', 'false');
    
    // Stop Lenis scroll
    if (window.lenis) window.lenis.stop();
    
    // Focus close button
    document.getElementById('success-modal-close').focus();
}
