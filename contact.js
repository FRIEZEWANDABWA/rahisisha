// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactPage();
});

function initContactPage() {
    initContactAnimations();
    initContactForm();
    initFileUpload();
    initScheduleModal();
    initContactFAQ();
}

// Contact page animations
function initContactAnimations() {
    // Hero section animation
    gsap.timeline()
        .from('.contact-hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.contact-hero-content p', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.contact-methods .contact-method', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');

    // Contact info animation
    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-main',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Contact form animation
    gsap.from('.contact-form-container', {
        scrollTrigger: {
            trigger: '.contact-main',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Map animation
    gsap.from('.map-container', {
        scrollTrigger: {
            trigger: '.contact-map',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Alternative contact options animation
    gsap.from('.contact-option', {
        scrollTrigger: {
            trigger: '.alternative-contact',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Validate form
            if (!validateContactForm(contactForm)) {
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Message...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission
                await submitContactForm(formData);
                
                // Show success message
                showContactSuccess();
                
                // Reset form
                contactForm.reset();
                clearUploadedFiles();
                
                // Track form submission
                trackContactSubmission(formData);
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
                console.error('Contact form error:', error);
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Form validation
function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        clearFieldError(field);
        
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            // Additional validation
            if (field.type === 'email' && !isValidEmail(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
            
            if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
                showFieldError(field, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });
    
    // Check privacy policy checkbox
    const privacyCheckbox = form.querySelector('input[name="privacy"]');
    if (!privacyCheckbox.checked) {
        showNotification('Please accept the Privacy Policy and Terms of Service', 'error');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #EF4444;
        font-size: 0.8rem;
        margin-top: 0.25rem;
    `;
    
    field.parentNode.appendChild(errorElement);
    field.style.borderColor = '#EF4444';
    
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
    field.style.borderColor = '';
}

// File upload functionality
function initFileUpload() {
    const fileInput = document.getElementById('attachments');
    const uploadArea = document.getElementById('file-upload-area');
    const uploadedFiles = document.getElementById('uploaded-files');
    
    if (!fileInput || !uploadArea) return;
    
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
            fileElement.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.75rem;
                background: rgba(224, 224, 224, 0.1);
                border-radius: var(--border-radius);
                margin-bottom: 0.5rem;
            `;
            
            fileElement.innerHTML = `
                <div class="file-info" style="display: flex; align-items: center; gap: 1rem;">
                    <i class="fas ${getFileIcon(file.type)}" style="color: var(--accent-color);"></i>
                    <div class="file-details">
                        <div class="file-name" style="font-weight: 500; color: var(--text-color);">${file.name}</div>
                        <div class="file-size" style="font-size: 0.8rem; color: var(--text-secondary);">${formatFileSize(file.size)}</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="removeContactFile(${index})" style="
                    background: none;
                    border: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 50%;
                    transition: var(--transition);
                ">
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

function removeContactFile(index) {
    const fileInput = document.getElementById('attachments');
    const uploadedFiles = document.getElementById('uploaded-files');
    const fileElements = uploadedFiles.querySelectorAll('.uploaded-file');
    
    // Remove file from input
    const dt = new DataTransfer();
    Array.from(fileInput.files).forEach((file, i) => {
        if (i !== index) {
            dt.items.add(file);
        }
    });
    fileInput.files = dt.files;
    
    // Animate out the removed file
    gsap.to(fileElements[index], {
        opacity: 0,
        x: -20,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
            fileElements[index].remove();
        }
    });
}

function clearUploadedFiles() {
    const uploadedFiles = document.getElementById('uploaded-files');
    if (uploadedFiles) {
        uploadedFiles.innerHTML = '';
    }
}

// Schedule modal functionality
function initScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    const closeBtn = modal.querySelector('.close');
    const scheduleForm = modal.querySelector('.schedule-form');
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        closeScheduleModal();
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeScheduleModal();
        }
    });
    
    // Handle form submission
    scheduleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(scheduleForm);
        const submitBtn = scheduleForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
        submitBtn.disabled = true;
        
        try {
            // Simulate scheduling
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            showNotification('Meeting scheduled successfully! You will receive a confirmation email shortly.', 'success');
            closeScheduleModal();
            scheduleForm.reset();
            
        } catch (error) {
            showNotification('Failed to schedule meeting. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

function openScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate modal
    gsap.from('.modal-content', {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out'
    });
}

function closeScheduleModal() {
    const modal = document.getElementById('schedule-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// FAQ functionality
function initContactFAQ() {
    const faqItems = document.querySelectorAll('.contact-faq .faq-item');
    
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

// Form submission
async function submitContactForm(formData) {
    // In a real application, this would send data to your backend
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Contact form submitted:', Object.fromEntries(formData.entries()));
            resolve();
        }, 2000);
    });
}

// Success message
function showContactSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'contact-success-message';
    successMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--background-card);
        padding: 2rem;
        border-radius: var(--border-radius);
        border: 2px solid var(--accent-color);
        text-align: center;
        z-index: 2000;
        max-width: 400px;
        box-shadow: var(--shadow-dark);
    `;
    
    successMessage.innerHTML = `
        <div class="success-icon" style="font-size: 3rem; color: #10B981; margin-bottom: 1rem;">
            <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="color: var(--text-color); margin-bottom: 1rem;">Message Sent Successfully!</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
            Thank you for contacting us. We'll get back to you within 24 hours.
        </p>
        <button onclick="this.parentElement.remove()" class="btn btn-primary">
            <i class="fas fa-check"></i>
            Got it
        </button>
    `;
    
    document.body.appendChild(successMessage);
    
    // Animate in
    gsap.from(successMessage, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (successMessage.parentElement) {
            gsap.to(successMessage, {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out',
                onComplete: () => successMessage.remove()
            });
        }
    }, 5000);
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function trackContactSubmission(formData) {
    // Track contact form submission
    console.log('Contact form tracked:', {
        inquiry_type: formData.get('inquiry-type'),
        company: formData.get('company'),
        industry: formData.get('industry'),
        budget: formData.get('budget')
    });
}

// Make functions globally available
window.openScheduleModal = openScheduleModal;
window.removeContactFile = removeContactFile;