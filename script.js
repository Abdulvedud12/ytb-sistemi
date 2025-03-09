document.addEventListener('DOMContentLoaded', () => {
    // Form submission handling
    const applicationForm = document.getElementById('ytb-application');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleFormSubmit);
    }

    // Language switch handling
    const langSwitch = document.querySelector('.lang-switch');
    if (langSwitch) {
        langSwitch.addEventListener('click', toggleLanguage);
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // Add active class to navigation links based on scroll position
    window.addEventListener('scroll', updateActiveNavLink);
});

// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formData = new FormData(form);

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        // Validate form data
        const validationError = validateForm(formData);
        if (validationError) {
            showNotification(validationError, 'error');
            return;
        }

        // Simulate API call (replace with actual API endpoint)
        await simulateApiCall(formData);

        // Show success message
        showNotification('Application submitted successfully!', 'success');
        form.reset();

    } catch (error) {
        showNotification('Error submitting application. Please try again.', 'error');
        console.error('Submission error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}

// Form validation
function validateForm(formData) {
    const requiredFields = ['fullname', 'email', 'nationality', 'program'];
    
    for (const field of requiredFields) {
        if (!formData.get(field)) {
            return `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
        }
    }

    const email = formData.get('email');
    if (!isValidEmail(email)) {
        return 'Please enter a valid email address';
    }

    return null;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate API call
function simulateApiCall(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form data:', Object.fromEntries(formData));
            resolve();
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add notification styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '4px',
        backgroundColor: type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease-out'
    });

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Language toggle
function toggleLanguage() {
    const currentLang = this.textContent.split('|')[0].trim();
    this.textContent = currentLang === 'EN' ? 'TR | EN' : 'EN | TR';
    // Add logic here to change website content language
}

// Smooth scroll
function smoothScroll(event) {
    event.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
            currentSection = `#${section.id}`;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 