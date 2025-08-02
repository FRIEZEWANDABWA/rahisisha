// Quote form functionality
document.addEventListener('DOMContentLoaded', function() {
    initQuoteForm();
});

function initQuoteForm() {
    initStepNavigation();
    initFormValidation();
    initFileUpload();
    initCharacterCounter();
    initFAQ();
    initFormAnimations();
    initProgressTracking();
}

// Step Navigation
function initStepNavigation() {
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const prevBtns = document.querySelectorAll('.prev-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progress-fill');
    
    let currentStep = 1;
    const totalSteps = steps.length;

    function updateProgress() {
        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = progressPercent + '%';
        
        progressSteps.forEach((step, index) => {
            if (index + 1 <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function showStep(stepNumber) {
        steps.forEach((step, index) => {
            if (index + 1 === stepNumber) {
                step.classList.add('active');
                // Animate step in
                gsap.from(step, {
                    opacity: 0,
                    x: 50,
                    duration: 0.5,
                    ease: 'power3.out'
                });
            } else {
                step.classList.remove('active');
            }
        });
        
        currentStep = stepNumber;
        updateProgress();
        
        // Scroll to top of form
        document.querySelector('.quote-form-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Next button handlers
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
            
            if (validateStep(currentStepElement)) {
                if (currentStep === 4) {
                    // Generate review before showing step 5
                    generateReview();
                }
                
                if (currentStep < totalSteps) {
                    showStep(currentStep + 1);
                }
            }
        });
    });

    // Previous button handlers
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    });

    // Progress step click handlers
    progressSteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const targetStep = index + 1;
            if (targetStep <= currentStep || validateAllPreviousSteps(targetStep)) {
                showStep(targetStep);
            }
        });
    });

    // Initialize progress
    updateProgress();
}

// Form Validation
function initFormValidation() {
    const form = document.getElementById('quote-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-quote');
        const originalText = submitBtn.innerHTML;
        
        // Validate final step
        const finalStep = document.querySelector('.form-step[data-step="5"]');
        if (!validateStep(finalStep)) {
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Quote Request...';
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = new FormData(form);
            const quoteData = Object.fromEntries(formData.entries());
            
            // Add file information
            const files = document.getElementById('project-files').files;
            quoteData.files = Array.from(files).map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            
            // Simulate form submission
            await submitQuoteRequest(quoteData);
            
            // Show success message
            showSuccessMessage();
            
            // Track conversion
            trackQuoteSubmission(quoteData);
            
        } catch (error) {
            showNotification('Failed to submit quote request. Please try again.', 'error');
            console.error('Quote submission error:', error);
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateStep(stepElement) {
    const requiredFields = stepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
        
        // Additional validation for specific fields
        if (field.type === 'email' && field.value) {
            if (!isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        if (field.type === 'tel' && field.value) {
            if (!isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    // Special validation for step 1 (service selection)
    if (stepElement.dataset.step === '1') {
        const serviceSelected = stepElement.querySelector('input[name="project-type"]:checked');
        if (!serviceSelected) {
            showNotification('Please select a service type to continue.', 'error');
            isValid = false;
        }
    }
    
    return isValid;
}

function validateAllPreviousSteps(targetStep) {
    for (let i = 1; i < targetStep; i++) {
        const step = document.querySelector(`.form-step[data-step="${i}"]`);
        if (!validateStep(step)) {
            showNotification(`Please complete step ${i} before proceeding.`, 'error');
            return false;
        }
    }
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
    field.classList.add('error');
    
    // Animate error message
    gsap.from(errorElement, {
        opacity: 0,
        y: -10,
        duration: 0.3,
        ease: 'power2.out'
    });
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
}

// File Upload
function initFileUpload() {
    const fileInput = document.getElementById('project-files');
    const uploadArea = document.getElementById('file-upload-area');
    const uploadedFiles = document.getElementById('uploaded-files');
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    });
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files);
    });
    
    function handleFileSelection(files) {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/zip'
        ];
        
        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                showNotification(`File "${file.name}" is too large. Maximum size is 10MB.`, 'error');
                return false;
            }
            
            if (!allowedTypes.includes(file.type)) {
                showNotification(`File "${file.name}" is not a supported format.`, 'error');
                return false;
            }
            
            return true;
        });
        
        displayUploadedFiles(validFiles);
    }
    
    function displayUploadedFiles(files) {
        uploadedFiles.innerHTML = '';
        
        files.forEach((file, index) => {
            const fileElement = document.createElement('div');
            fileElement.className = 'uploaded-file';
            fileElement.innerHTML = `
                <div class="file-info">
                    <i class="fas ${getFileIcon(file.type)}"></i>
                    <div class="file-details">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${formatFileSize(file.size)}</span>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            uploadedFiles.appendChild(fileElement);
            
            // Animate file in
            gsap.from(fileElement, {
                opacity: 0,
                x: -20,
                duration: 0.3,
                delay: index * 0.1,
                ease: 'power2.out'
            });
        });
    }
}

function getFileIcon(fileType) {
    const iconMap = {
        'application/pdf': 'fa-file-pdf',
        'application/msword': 'fa-file-word',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'fa-file-word',
        'text/plain': 'fa-file-alt',
        'image/jpeg': 'fa-file-image',
        'image/jpg': 'fa-file-image',
        'image/png': 'fa-file-image',
        'application/zip': 'fa-file-archive'
    };
    
    return iconMap[fileType] || 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removeFile(index) {
    const fileInput = document.getElementById('project-files');
    const dt = new DataTransfer();
    
    Array.from(fileInput.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    
    fileInput.files = dt.files;
    
    // Re-display files
    const files = Array.from(fileInput.files);
    const uploadedFiles = document.getElementById('uploaded-files');
    const fileElements = uploadedFiles.querySelectorAll('.uploaded-file');
    
    // Animate out the removed file
    gsap.to(fileElements[index], {
        opacity: 0,
        x: -20,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
            displayUploadedFiles(files);
        }
    });
}

// Character Counter
function initCharacterCounter() {
    const textarea = document.getElementById('project-description');
    const charCount = document.getElementById('char-count');
    const maxLength = 2000;
    
    textarea.addEventListener('input', () => {
        const currentLength = textarea.value.length;
        charCount.textContent = currentLength;
        
        // Change color based on usage
        if (currentLength > maxLength * 0.9) {
            charCount.style.color = '#EF4444'; // Red
        } else if (currentLength > maxLength * 0.7) {
            charCount.style.color = '#F59E0B'; // Orange
        } else {
            charCount.style.color = 'var(--text-secondary)';
        }
        
        // Prevent exceeding max length
        if (currentLength > maxLength) {
            textarea.value = textarea.value.substring(0, maxLength);
            charCount.textContent = maxLength;
        }
    });
}

// FAQ Functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    
                    gsap.to(otherAnswer, {
                        height: 0,
                        opacity: 0,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });
            
            // Toggle current item
            if (isOpen) {
                item.classList.remove('active');
                gsap.to(answer, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            } else {
                item.classList.add('active');
                gsap.set(answer, { height: 'auto' });
                const height = answer.offsetHeight;
                gsap.fromTo(answer, 
                    { height: 0, opacity: 0 },
                    { height: height, opacity: 1, duration: 0.3, ease: 'power2.out' }
                );
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            }
        });
    });
}

// Form Animations
function initFormAnimations() {
    // Hero section animation
    gsap.timeline()
        .from('.quote-hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.quote-hero-content p', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.quote-benefits .benefit', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');
    
    // Form container animation
    gsap.from('.quote-form-container', {
        scrollTrigger: {
            trigger: '.quote-form-section',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Service options animation
    gsap.from('.service-option', {
        scrollTrigger: {
            trigger: '.service-selection',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    // FAQ animation
    gsap.from('.faq-item', {
        scrollTrigger: {
            trigger: '.quote-faq',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// Progress Tracking
function initProgressTracking() {
    // Track form abandonment
    let formStarted = false;
    let currentStepStartTime = Date.now();
    
    document.addEventListener('input', () => {
        if (!formStarted) {
            formStarted = true;
            trackEvent('quote_form_started');
        }
    });
    
    // Track step completion time
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const timeSpent = Date.now() - currentStepStartTime;
            const currentStep = document.querySelector('.form-step.active').dataset.step;
            
            trackEvent('quote_step_completed', {
                step: currentStep,
                time_spent: timeSpent
            });
            
            currentStepStartTime = Date.now();
        });
    });
    
    // Track form abandonment
    window.addEventListener('beforeunload', () => {
        if (formStarted) {
            const currentStep = document.querySelector('.form-step.active').dataset.step;
            if (currentStep < 5) {
                trackEvent('quote_form_abandoned', {
                    step: currentStep
                });
            }
        }
    });
}

// Generate Review
function generateReview() {
    const formData = new FormData(document.getElementById('quote-form'));
    const reviewContainer = document.getElementById('quote-review');
    
    const projectType = formData.get('project-type');
    const companyName = formData.get('company-name');
    const budget = formData.get('budget-range');
    const timeline = formData.get('timeline');
    const contactName = formData.get('contact-name');
    const email = formData.get('email');
    const description = formData.get('project-description');
    
    const serviceNames = {
        'web-design': 'Website Design & Development',
        'app-development': 'Mobile & Web App Development',
        'ai-automation': 'AI Automation Solutions',
        'digital-marketing': 'Digital Marketing & Strategy',
        'ai-training': 'AI Tools Training & Workshops'
    };
    
    const budgetLabels = {
        'under-5k': 'Under $5,000',
        '5k-10k': '$5,000 - $10,000',
        '10k-25k': '$10,000 - $25,000',
        '25k-50k': '$25,000 - $50,000',
        '50k-100k': '$50,000 - $100,000',
        '100k-plus': '$100,000+'
    };
    
    reviewContainer.innerHTML = `
        <div class="review-section">
            <h4><i class="fas fa-briefcase"></i> Project Information</h4>
            <div class="review-item">
                <span class="label">Service:</span>
                <span class="value">${serviceNames[projectType] || projectType}</span>
            </div>
            <div class="review-item">
                <span class="label">Company:</span>
                <span class="value">${companyName}</span>
            </div>
            <div class="review-item">
                <span class="label">Budget Range:</span>
                <span class="value">${budgetLabels[budget] || budget}</span>
            </div>
            <div class="review-item">
                <span class="label">Timeline:</span>
                <span class="value">${timeline}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4><i class="fas fa-user"></i> Contact Information</h4>
            <div class="review-item">
                <span class="label">Name:</span>
                <span class="value">${contactName}</span>
            </div>
            <div class="review-item">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
            </div>
        </div>
        
        <div class="review-section">
            <h4><i class="fas fa-file-alt"></i> Project Description</h4>
            <div class="review-description">
                ${description || 'No description provided'}
            </div>
        </div>
        
        <div class="review-section">
            <h4><i class="fas fa-clock"></i> What Happens Next</h4>
            <div class="next-steps">
                <div class="next-step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h5>Immediate Confirmation</h5>
                        <p>You'll receive an email confirmation within minutes</p>
                    </div>
                </div>
                <div class="next-step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h5>Detailed Quote (24 hours)</h5>
                        <p>Our team will prepare a comprehensive quote with pricing and timeline</p>
                    </div>
                </div>
                <div class="next-step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h5>Free Consultation Call</h5>
                        <p>We'll schedule a call to discuss your project and answer questions</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Animate review content
    gsap.from('.review-section', {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });
}

// Submit Quote Request
async function submitQuoteRequest(quoteData) {
    // In a real application, this would send data to your backend
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Quote request submitted:', quoteData);
            resolve();
        }, 2000);
    });
}

// Show Success Message
function showSuccessMessage() {
    const formContainer = document.querySelector('.quote-form-main');
    
    formContainer.innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Quote Request Submitted Successfully!</h2>
            <p>Thank you for your interest in our services. We've received your quote request and will get back to you within 24 hours.</p>
            
            <div class="success-details">
                <div class="detail-item">
                    <i class="fas fa-envelope"></i>
                    <span>Confirmation email sent to your inbox</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-clock"></i>
                    <span>Detailed quote within 24 hours</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-phone"></i>
                    <span>Free consultation call scheduled</span>
                </div>
            </div>
            
            <div class="success-actions">
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i>
                    Back to Home
                </a>
                <a href="blog.html" class="btn btn-outline">
                    <i class="fas fa-book"></i>
                    Read Our Blog
                </a>
            </div>
        </div>
    `;
    
    // Animate success message
    gsap.from('.success-message', {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
    
    // Confetti effect
    createConfetti();
}

// Confetti Effect
function createConfetti() {
    const colors = ['#00BFFF', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}vw;
            z-index: 10000;
            pointer-events: none;
            border-radius: 50%;
        `;
        
        document.body.appendChild(confetti);
        
        gsap.to(confetti, {
            y: window.innerHeight + 100,
            rotation: Math.random() * 360,
            duration: Math.random() * 3 + 2,
            ease: 'power2.out',
            onComplete: () => confetti.remove()
        });
    }
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function trackEvent(eventName, eventData = {}) {
    // In a real application, you would send this to your analytics service
    console.log('Event tracked:', eventName, eventData);
    
    // Example: Google Analytics
    // gtag('event', eventName, eventData);
    
    // Example: Facebook Pixel
    // fbq('track', eventName, eventData);
}

function trackQuoteSubmission(quoteData) {
    trackEvent('quote_submitted', {
        project_type: quoteData['project-type'],
        budget_range: quoteData['budget-range'],
        timeline: quoteData.timeline,
        company_size: quoteData['company-size']
    });
}

// Add CSS for quote-specific styles
const quoteStyles = document.createElement('style');
quoteStyles.textContent = `
    .quote-hero {
        padding: 8rem 0 4rem;
        background: var(--gradient-dark);
        text-align: center;
    }
    
    .quote-benefits {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 2rem;
        flex-wrap: wrap;
    }
    
    .benefit {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--accent-color);
        font-weight: 500;
    }
    
    .quote-form-section {
        padding: 4rem 0;
        background: var(--primary-color);
    }
    
    .quote-form-container {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 4rem;
        max-width: 1400px;
        margin: 0 auto;
    }
    
    .quote-form-sidebar {
        background: var(--background-card);
        padding: 2rem;
        border-radius: var(--border-radius);
        height: fit-content;
        position: sticky;
        top: 100px;
    }
    
    .quote-includes {
        margin: 2rem 0;
    }
    
    .include-item {
        display: flex;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .include-item i {
        color: var(--accent-color);
        margin-top: 0.25rem;
    }
    
    .testimonial-mini {
        background: rgba(0, 191, 255, 0.1);
        padding: 1.5rem;
        border-radius: var(--border-radius);
        margin-top: 2rem;
    }
    
    .testimonial-mini .stars {
        margin-bottom: 1rem;
    }
    
    .testimonial-mini .testimonial-author {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .testimonial-mini img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    
    .quote-form-main {
        background: var(--background-card);
        padding: 2rem;
        border-radius: var(--border-radius);
        position: relative;
    }
    
    .form-step {
        display: none;
    }
    
    .form-step.active {
        display: block;
    }
    
    .step-header {
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .service-selection {
        display: grid;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .service-option {
        display: block;
        cursor: pointer;
        position: relative;
    }
    
    .service-option input {
        display: none;
    }
    
    .option-content {
        padding: 1.5rem;
        border: 2px solid rgba(224, 224, 224, 0.2);
        border-radius: var(--border-radius);
        transition: var(--transition);
        position: relative;
    }
    
    .service-option:hover .option-content,
    .service-option input:checked + .option-content {
        border-color: var(--accent-color);
        background: rgba(0, 191, 255, 0.05);
    }
    
    .service-option.featured .option-content {
        border-color: var(--accent-color);
        background: rgba(0, 191, 255, 0.1);
    }
    
    .popular-badge {
        position: absolute;
        top: -10px;
        right: 1rem;
        background: var(--accent-color);
        color: white;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .option-content i {
        font-size: 2rem;
        color: var(--accent-color);
        margin-bottom: 1rem;
    }
    
    .price-range {
        color: var(--accent-color);
        font-weight: 500;
        font-size: 0.9rem;
    }
    
    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .form-group.full-width {
        grid-column: span 2;
    }
    
    .radio-group {
        display: flex;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .radio-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }
    
    .step-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(224, 224, 224, 0.1);
    }
    
    .form-progress {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(224, 224, 224, 0.1);
    }
    
    .progress-bar {
        width: 100%;
        height: 4px;
        background: rgba(224, 224, 224, 0.2);
        border-radius: 2px;
        margin-bottom: 1rem;
    }
    
    .progress-fill {
        height: 100%;
        background: var(--gradient-primary);
        border-radius: 2px;
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .progress-steps {
        display: flex;
        justify-content: space-between;
    }
    
    .progress-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .step-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(224, 224, 224, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        transition: var(--transition);
    }
    
    .progress-step.active .step-number {
        background: var(--accent-color);
        color: white;
    }
    
    .progress-step span {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .progress-step.active span {
        color: var(--accent-color);
    }
    
    .char-counter {
        text-align: right;
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.5rem;
    }
    
    .file-upload-area {
        border: 2px dashed rgba(224, 224, 224, 0.3);
        border-radius: var(--border-radius);
        padding: 2rem;
        text-align: center;
        cursor: pointer;
        transition: var(--transition);
    }
    
    .file-upload-area:hover,
    .file-upload-area.drag-over {
        border-color: var(--accent-color);
        background: rgba(0, 191, 255, 0.05);
    }
    
    .upload-content i {
        font-size: 2rem;
        color: var(--accent-color);
        margin-bottom: 1rem;
    }
    
    .upload-link {
        color: var(--accent-color);
        text-decoration: underline;
    }
    
    .uploaded-files {
        margin-top: 1rem;
    }
    
    .uploaded-file {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: rgba(224, 224, 224, 0.1);
        border-radius: var(--border-radius);
        margin-bottom: 0.5rem;
    }
    
    .file-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .file-details {
        display: flex;
        flex-direction: column;
    }
    
    .file-name {
        font-weight: 500;
    }
    
    .file-size {
        font-size: 0.8rem;
        color: var(--text-secondary);
    }
    
    .remove-file {
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;
        transition: var(--transition);
    }
    
    .remove-file:hover {
        background: rgba(239, 68, 68, 0.1);
        color: #EF4444;
    }
    
    .terms-agreement {
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(224, 224, 224, 0.05);
        border-radius: var(--border-radius);
    }
    
    .checkbox-option {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        margin-bottom: 1rem;
        cursor: pointer;
    }
    
    .checkbox-option:last-child {
        margin-bottom: 0;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(224, 224, 224, 0.3);
        border-radius: 4px;
        position: relative;
        transition: var(--transition);
        flex-shrink: 0;
        margin-top: 2px;
    }
    
    .checkbox-option input:checked + .checkmark {
        background: var(--accent-color);
        border-color: var(--accent-color);
    }
    
    .checkbox-option input:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 0.8rem;
        font-weight: bold;
    }
    
    .checkbox-option input {
        display: none;
    }
    
    .review-section {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: rgba(224, 224, 224, 0.05);
        border-radius: var(--border-radius);
    }
    
    .review-section h4 {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--accent-color);
    }
    
    .review-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(224, 224, 224, 0.1);
    }
    
    .review-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }
    
    .review-item .label {
        font-weight: 500;
        color: var(--text-secondary);
    }
    
    .review-item .value {
        color: var(--text-color);
    }
    
    .review-description {
        padding: 1rem;
        background: rgba(224, 224, 224, 0.1);
        border-radius: var(--border-radius);
        line-height: 1.6;
        white-space: pre-wrap;
    }
    
    .next-steps {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .next-step {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
    }
    
    .next-step .step-number {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: var(--accent-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        flex-shrink: 0;
    }
    
    .step-content h5 {
        margin-bottom: 0.25rem;
        color: var(--text-color);
    }
    
    .step-content p {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .field-error {
        color: #EF4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #EF4444;
    }
    
    .success-message {
        text-align: center;
        padding: 3rem 2rem;
    }
    
    .success-icon {
        font-size: 4rem;
        color: #10B981;
        margin-bottom: 1rem;
    }
    
    .success-details {
        margin: 2rem 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        color: var(--text-secondary);
    }
    
    .detail-item i {
        color: var(--accent-color);
    }
    
    .success-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .quote-faq {
        padding: 4rem 0;
        background: var(--background-dark);
    }
    
    .faq-grid {
        display: grid;
        gap: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .faq-item {
        background: var(--background-card);
        border-radius: var(--border-radius);
        overflow: hidden;
    }
    
    .faq-question {
        padding: 1.5rem;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: var(--transition);
    }
    
    .faq-question:hover {
        background: rgba(224, 224, 224, 0.05);
    }
    
    .faq-question h4 {
        margin: 0;
        color: var(--text-color);
    }
    
    .faq-question i {
        color: var(--accent-color);
        transition: var(--transition);
    }
    
    .faq-answer {
        height: 0;
        opacity: 0;
        overflow: hidden;
        padding: 0 1.5rem;
    }
    
    .faq-item.active .faq-answer {
        padding: 0 1.5rem 1.5rem;
    }
    
    @media (max-width: 768px) {
        .quote-form-container {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        
        .quote-form-sidebar {
            position: static;
        }
        
        .form-grid {
            grid-template-columns: 1fr;
        }
        
        .quote-benefits {
            flex-direction: column;
            align-items: center;
        }
        
        .success-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(quoteStyles);

// Make functions globally available
window.removeFile = removeFile;