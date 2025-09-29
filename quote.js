// Quote System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initQuoteSystem();
});

function initQuoteSystem() {
    initSimpleQuoteModal();
    initComprehensiveQuoteForm();
    initAutoSave();
    initServicePreSelection();
}

// Simple Quote Modal (for homepage and services)
function initSimpleQuoteModal() {
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleSimpleQuoteSubmission(quoteForm);
        });
    }
}

async function handleSimpleQuoteSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Prepare data for API
        const quoteData = {
            type: 'simple_quote',
            name: formData.get('name'),
            email: formData.get('email'),
            service: formData.get('service'),
            budget: formData.get('budget'),
            details: formData.get('details'),
            timestamp: new Date().toISOString(),
            source: 'modal'
        };
        
        // Submit to API
        const response = await submitQuoteToAPI(quoteData);
        
        if (response.success) {
            showNotification('Quote request submitted successfully! We\'ll contact you within 24 hours.', 'success');
            form.reset();
            closeModal(document.getElementById('quote-modal'));
        } else {
            throw new Error(response.message || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Quote submission error:', error);
        showNotification('Failed to submit quote request. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// Comprehensive Quote Form (for quote page)
function initComprehensiveQuoteForm() {
    const form = document.getElementById('comprehensive-quote-form');
    if (!form) return;
    
    let currentStep = 1;
    const totalSteps = 3;
    
    const nextBtn = document.querySelector('.next-step');
    const prevBtn = document.querySelector('.prev-step');
    const submitBtn = document.querySelector('.submit-quote');
    
    // Navigation event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateCurrentStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    showStep(currentStep);
                    updateProgressIndicator(currentStep);
                    updateNavigationButtons(currentStep, totalSteps);
                    saveFormData(); // Auto-save on step change
                }
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep);
                updateProgressIndicator(currentStep);
                updateNavigationButtons(currentStep, totalSteps);
            }
        });
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (validateCurrentStep(currentStep)) {
            await handleComprehensiveQuoteSubmission(form);
        }
    });
    
    // Auto-save on input change
    form.addEventListener('input', debounce(saveFormData, 1000));
    form.addEventListener('change', saveFormData);
    
    // Load saved data
    loadSavedFormData();
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
}

function updateProgressIndicator(stepNumber) {
    const progressIndicator = document.querySelector('.progress-indicator');
    const steps = document.querySelectorAll('.step');
    
    // Update progress bar
    progressIndicator.className = `progress-indicator step-${stepNumber}`;
    
    // Update step states
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
}

function updateNavigationButtons(currentStep, totalSteps) {
    const nextBtn = document.querySelector('.next-step');
    const prevBtn = document.querySelector('.prev-step');
    const submitBtn = document.querySelector('.submit-quote');
    
    // Previous button
    prevBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    // Next/Submit button
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

function validateCurrentStep(stepNumber) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
            formGroup.classList.add('error');
            isValid = false;
        } else {
            formGroup.classList.remove('error');
        }
        
        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                formGroup.classList.add('error');
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(field.value) || field.value.length < 8) {
                formGroup.classList.add('error');
                isValid = false;
            }
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

async function handleComprehensiveQuoteSubmission(form) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-quote');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
        // Prepare comprehensive quote data
        const quoteData = {
            type: 'comprehensive_quote',
            // Step 1: Contact Information
            fullName: formData.get('fullName'),
            email: formData.get('email'),
            countryCode: formData.get('countryCode'),
            phone: formData.get('phone'),
            
            // Step 2: Project Details
            serviceType: formData.get('serviceType'),
            projectDescription: formData.get('projectDescription'),
            budgetRange: formData.get('budgetRange'),
            timeline: formData.get('timeline'),
            urgency: formData.get('urgency'),
            
            // Step 3: Additional Information
            companyName: formData.get('companyName'),
            location: formData.get('location'),
            experience: formData.get('experience'),
            additionalNotes: formData.get('additionalNotes'),
            newsletter: formData.get('newsletter') === 'yes',
            
            // Metadata
            timestamp: new Date().toISOString(),
            source: 'comprehensive_form',
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };
        
        // Handle file uploads
        const files = formData.getAll('projectFiles');
        if (files.length > 0) {
            quoteData.hasFiles = true;
            quoteData.fileCount = files.length;
            // Files would be handled separately in a real implementation
        }
        
        // Submit to API
        const response = await submitQuoteToAPI(quoteData);
        
        if (response.success) {
            showSuccessMessage();
            clearSavedFormData();
        } else {
            throw new Error(response.message || 'Submission failed');
        }
        
    } catch (error) {
        console.error('Comprehensive quote submission error:', error);
        showNotification('Failed to submit quote request. Please try again or contact us directly.', 'error');
    } finally {
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// API Integration using Formspree
async function submitQuoteToAPI(quoteData) {
    console.log('Submitting comprehensive quote to Formspree:', quoteData);
    
    try {
        const formData = {
            subject: `New Quote Request from ${quoteData.name || quoteData.fullName}`,
            message: formatQuoteForEmail(quoteData),
            email: quoteData.email,
            name: quoteData.name || quoteData.fullName,
            service: quoteData.service || quoteData.serviceType,
            budget: quoteData.budget || quoteData.budgetRange,
            phone: quoteData.phone ? `${quoteData.countryCode} ${quoteData.phone}` : '',
            company: quoteData.companyName || '',
            timeline: quoteData.timeline || '',
            urgency: quoteData.urgency || '',
            type: quoteData.type,
            timestamp: quoteData.timestamp,
            _replyto: quoteData.email,
            _subject: `New Quote Request from ${quoteData.name || quoteData.fullName}`
        };
        
        console.log('Formspree payload:', formData);
        
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/xzzjekzp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Formspree response status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Formspree success:', result);
            return {
                success: true,
                message: 'Quote request submitted successfully',
                quoteId: 'QUOTE_' + Date.now()
            };
        } else {
            const errorData = await response.text();
            console.error('Formspree error response:', errorData);
            throw new Error(`Formspree submission failed: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Quote submission error:', error);
        return {
            success: false,
            message: 'Failed to submit quote request. Please try again.'
        };
    }
}

// Format quote data for email
function formatQuoteForEmail(quoteData) {
    const isSimple = quoteData.type === 'simple_quote';
    const customerName = quoteData.name || quoteData.fullName;
    
    if (isSimple) {
        return `
NEW QUOTE REQUEST - Simple Form

Contact Information:
- Name: ${customerName}
- Email: ${quoteData.email}

Project Details:
- Service: ${quoteData.service}
- Budget: ${quoteData.budget}
- Details: ${quoteData.details}

Submitted: ${new Date(quoteData.timestamp).toLocaleString()}
Source: ${quoteData.source}
        `;
    } else {
        return `
NEW QUOTE REQUEST - Comprehensive Form

Contact Information:
- Name: ${quoteData.fullName}
- Email: ${quoteData.email}
- Phone: ${quoteData.countryCode} ${quoteData.phone}
${quoteData.companyName ? `- Company: ${quoteData.companyName}` : ''}
${quoteData.location ? `- Location: ${quoteData.location}` : ''}

Project Details:
- Service: ${quoteData.serviceType}
- Budget: ${quoteData.budgetRange}
- Timeline: ${quoteData.timeline}
- Urgency: ${quoteData.urgency}
- Experience: ${quoteData.experience || 'Not specified'}

Project Description:
${quoteData.projectDescription}

${quoteData.additionalNotes ? `Additional Notes:
${quoteData.additionalNotes}
` : ''}
Newsletter: ${quoteData.newsletter ? 'Yes' : 'No'}
Submitted: ${new Date(quoteData.timestamp).toLocaleString()}
Source: ${quoteData.source}
        `;
    }
}

// Auto-save functionality
function saveFormData() {
    const form = document.getElementById('comprehensive-quote-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    localStorage.setItem('rahisisha_quote_form', JSON.stringify(data));
    showAutoSaveIndicator();
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('rahisisha_quote_form');
    if (!savedData) return;
    
    try {
        const data = JSON.parse(savedData);
        const form = document.getElementById('comprehensive-quote-form');
        
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = data[key] === 'yes';
                } else {
                    field.value = data[key];
                }
            }
        });
        
        showNotification('Previous form data restored', 'info');
    } catch (error) {
        console.error('Error loading saved form data:', error);
    }
}

function clearSavedFormData() {
    localStorage.removeItem('rahisisha_quote_form');
}

function showAutoSaveIndicator() {
    let indicator = document.querySelector('.auto-save-indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.innerHTML = '<i class="fas fa-save"></i> Auto-saved';
        document.body.appendChild(indicator);
    }
    
    indicator.classList.add('show');
    
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

// Service pre-selection from URL parameters
function initServicePreSelection() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    
    if (service) {
        // Pre-select service in forms
        const serviceSelects = document.querySelectorAll('select[name="service"], select[name="serviceType"]');
        serviceSelects.forEach(select => {
            const option = select.querySelector(`option[value="${service}"]`);
            if (option) {
                select.value = service;
            }
        });
    }
}

// Success message display
function showSuccessMessage() {
    const form = document.getElementById('comprehensive-quote-form');
    const formContainer = document.querySelector('.quote-form-container');
    
    formContainer.innerHTML = `
        <div class="form-success show">
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <h3>Quote Request Submitted Successfully!</h3>
            <p>Thank you for your interest in our services. We've received your quote request and will get back to you within 24 hours with a detailed proposal.</p>
            <div style="margin-top: 2rem;">
                <a href="index.html" class="btn btn-primary">
                    <i class="fas fa-home"></i>
                    Back to Home
                </a>
                <a href="services.html" class="btn btn-outline" style="margin-left: 1rem;">
                    <i class="fas fa-cogs"></i>
                    View Services
                </a>
            </div>
        </div>
    `;
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Test function to verify Formspree integration
window.testFormspree = async function() {
    const testData = {
        type: 'test_quote',
        name: 'Test User',
        email: 'test@example.com',
        service: 'web-development',
        budget: '500-1000',
        details: 'This is a test submission to verify Formspree integration',
        timestamp: new Date().toISOString(),
        source: 'test'
    };
    
    try {
        const result = await submitQuoteToAPI(testData);
        console.log('Test result:', result);
        alert('Test successful! Check console for details.');
    } catch (error) {
        console.error('Test failed:', error);
        alert('Test failed! Check console for details.');
    }
};

// Export functions for global access
window.handleSimpleQuoteSubmission = handleSimpleQuoteSubmission;
window.submitQuoteToAPI = submitQuoteToAPI;