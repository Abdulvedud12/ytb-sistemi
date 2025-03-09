document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('application-form');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    let currentStep = 1;

    // Initialize form
    updateFormState();

    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormState();
                window.scrollTo(0, 0);
            }
        });
    });

    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateFormState();
            window.scrollTo(0, 0);
        });
    });

    // Handle form submission
    form.addEventListener('submit', handleSubmit);

    // Update form state based on current step
    function updateFormState() {
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.toggle('active', stepNum === currentStep);
        });

        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.toggle('active', stepNum === currentStep);
            step.classList.toggle('completed', stepNum < currentStep);
        });

        if (currentStep === 4) {
            updateApplicationSummary();
        }
    }

    // Validate current step
    function validateStep(step) {
        const currentStepElement = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                showFieldError(field);
            } else {
                removeFieldError(field);
            }
        });

        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
        }

        return isValid;
    }

    // Show field error
    function showFieldError(field) {
        field.classList.add('error');
        field.style.borderColor = '#f44336';
        
        // Remove existing error message if any
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorMessage = document.createElement('small');
        errorMessage.className = 'error-message';
        errorMessage.style.color = '#f44336';
        errorMessage.textContent = 'This field is required';
        field.parentElement.appendChild(errorMessage);
    }

    // Remove field error
    function removeFieldError(field) {
        field.classList.remove('error');
        field.style.borderColor = '';
        
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }

    // Update application summary
    function updateApplicationSummary() {
        const summary = document.getElementById('application-summary');
        const formData = new FormData(form);
        
        const summaryHTML = `
            <div class="summary-section">
                <h3>Personal Information</h3>
                <div class="summary-item">
                    <span class="summary-label">Name:</span>
                    <span class="summary-value">${formData.get('firstName')} ${formData.get('lastName')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Date of Birth:</span>
                    <span class="summary-value">${formData.get('birthDate')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Nationality:</span>
                    <span class="summary-value">${formData.get('nationality')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Passport Number:</span>
                    <span class="summary-value">${formData.get('passportNumber')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Email:</span>
                    <span class="summary-value">${formData.get('email')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Phone:</span>
                    <span class="summary-value">${formData.get('phone')}</span>
                </div>
            </div>
            <div class="summary-section">
                <h3>Educational Background</h3>
                <div class="summary-item">
                    <span class="summary-label">Education Level:</span>
                    <span class="summary-value">${formData.get('educationLevel')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Institution:</span>
                    <span class="summary-value">${formData.get('university')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Graduation Year:</span>
                    <span class="summary-value">${formData.get('graduationYear')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">GPA:</span>
                    <span class="summary-value">${formData.get('gpa')}</span>
                </div>
            </div>
            <div class="summary-section">
                <h3>Uploaded Documents</h3>
                <div class="summary-item">
                    <span class="summary-label">Passport Copy:</span>
                    <span class="summary-value">${getFileName('passportCopy')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Diploma:</span>
                    <span class="summary-value">${getFileName('diploma')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Transcripts:</span>
                    <span class="summary-value">${getFileName('transcripts')}</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">Letter of Intent:</span>
                    <span class="summary-value">${getFileName('letterOfIntent')}</span>
                </div>
            </div>
        `;

        summary.innerHTML = summaryHTML;
    }

    // Get file name from file input
    function getFileName(fieldName) {
        const fileInput = document.getElementById(fieldName);
        return fileInput.files.length > 0 ? fileInput.files[0].name : 'No file uploaded';
    }

    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        if (!document.getElementById('terms').checked) {
            showNotification('Please accept the terms to submit your application', 'error');
            return;
        }

        const submitButton = document.querySelector('.submit-btn');
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const formData = new FormData(form);
            
            // Send application data to backend
            const response = await fetch('http://localhost:3000/api/applications', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error submitting application');
            }

            showNotification(`Application submitted successfully! Your application number is: ${result.applicationNumber}`, 'success');
            
            // Store application number in localStorage for tracking
            localStorage.setItem('ytbApplicationNumber', result.applicationNumber);
            
            // Reset form and return to first step after short delay
            setTimeout(() => {
                form.reset();
                currentStep = 1;
                updateFormState();
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Application';
                
                // Redirect to tracking page
                window.location.href = `track.html?application=${result.applicationNumber}`;
            }, 3000);

        } catch (error) {
            console.error('Submission error:', error);
            showNotification(error.message || 'Error submitting application. Please try again.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Application';
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

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

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}); 