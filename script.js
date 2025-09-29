// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initParticles();
    initNavigation();
    initAnimations();
    initPortfolioFilter();
    initTestimonialSlider();
    initContactForm();
    initModals();
    initChatbot();
    initCookieConsent();
    initScrollEffects();
    initLanguageSwitcher();
    initNewsletterForm();
    initThemeToggle();
    initCounters();
    initROICalculator();
    
    // Show AI welcome popup after 3 seconds
    setTimeout(() => {
        showAIWelcome();
    }, 3000);
    
    // Show cookie consent after 5 seconds
    setTimeout(() => {
        showCookieConsent();
    }, 5000);
}

// Particles.js Configuration
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00BFFF'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00BFFF',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Navigation
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect - Always visible
    let lastScrollTop = 0;
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Always keep navbar visible
        navbar.classList.add('sticky');
        
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Active link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// GSAP Animations
function initAnimations() {
    // Hero animations
    gsap.timeline()
        .from('.hero-title .line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out'
        })
        .from('.hero-subtitle', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.hero-buttons', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3')
        .from('.hero-stats .stat', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');

    // Service cards animation
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // About section animation
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Portfolio items animation
    gsap.from('.portfolio-item', {
        scrollTrigger: {
            trigger: '.portfolio-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Blog cards animation
    gsap.from('.blog-card', {
        scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });

    // Contact section animation
    gsap.from('.contact-info .contact-item', {
        scrollTrigger: {
            trigger: '.contact',
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

    gsap.from('.contact-form', {
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// Portfolio Filter
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Set default filter to 'web' on page load
    const defaultFilter = 'web';
    portfolioItems.forEach(item => {
        if (item.getAttribute('data-category') === defaultFilter) {
            item.style.display = 'block';
            gsap.set(item, { opacity: 1, scale: 1 });
        } else {
            item.style.display = 'none';
            gsap.set(item, { opacity: 0, scale: 0.8 });
        }
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: () => {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Testimonial Slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;

    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });

        // Remove active class from all dots
        navDots.forEach(dot => {
            dot.classList.remove('active');
        });

        // Show current testimonial and activate dot
        testimonials[index].classList.add('active');
        navDots[index].classList.add('active');
    }

    // Navigation dots click event
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000);
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Modals
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');

    // Close modal when clicking close button
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Quote form steps
    initQuoteForm();
    initDemoForm();
}

function openQuoteModal() {
    const modal = document.getElementById('quote-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openDemoModal() {
    const modal = document.getElementById('demo-modal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function initQuoteForm() {
    const quoteForm = document.getElementById('quote-form');
    
    if (quoteForm) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(quoteForm);
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
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
                    quoteForm.reset();
                    closeModal(document.getElementById('quote-modal'));
                } else {
                    throw new Error(response.message || 'Submission failed');
                }
                
            } catch (error) {
                console.error('Quote submission error:', error);
                showNotification('Failed to submit quote request. Please try again or contact us directly.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// API Integration for quotes using Formspree
async function submitQuoteToAPI(quoteData) {
    try {
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/xzzjekzp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: `New Quote Request from ${quoteData.name || quoteData.fullName}`,
                message: formatQuoteForEmail(quoteData),
                email: quoteData.email,
                name: quoteData.name || quoteData.fullName,
                service: quoteData.service || quoteData.serviceType,
                budget: quoteData.budget || quoteData.budgetRange,
                details: quoteData.details || quoteData.projectDescription,
                type: quoteData.type,
                timestamp: quoteData.timestamp
            })
        });
        
        if (response.ok) {
            return {
                success: true,
                message: 'Quote request submitted successfully',
                quoteId: 'QUOTE_' + Date.now()
            };
        } else {
            throw new Error('Formspree submission failed');
        }
        
    } catch (error) {
        console.error('Quote submission error:', error);
        throw error;
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

function initDemoForm() {
    const demoForm = document.querySelector('.demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(demoForm);
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scheduling...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                showNotification('Demo scheduled successfully! Check your email for confirmation.', 'success');
                closeModal(document.getElementById('demo-modal'));
                demoForm.reset();
                
            } catch (error) {
                showNotification('Failed to schedule demo. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

function validateStep(stepIndex) {
    const currentStepElement = document.querySelector(`.form-step[data-step="${stepIndex + 1}"]`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            showNotification('Please fill in all required fields.', 'error');
            return false;
        }
    }
    return true;
}

// Chatbot
function initChatbot() {
    const chatbotTrigger = document.querySelector('.chatbot-trigger');
    const chatbot = document.getElementById('chatbot');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Predefined responses
    const responses = {
        'hello': 'Hi there! How can I help you today?',
        'hi': 'Hello! What can I do for you?',
        'services': 'We offer web development, mobile apps, AI automation, digital marketing, and AI training. Which service interests you?',
        'pricing': 'Our pricing varies based on project requirements. Would you like to schedule a free consultation to discuss your needs?',
        'contact': 'You can reach us at hello@rahisishatech.com or call +1 (555) 123-4567. We\'re here 24/7!',
        'about': 'Rahisisha Tech is a forward-thinking technology company that simplifies business operations through AI solutions and modern development.',
        'portfolio': 'Check out our portfolio section to see our latest projects and success stories!',
        'demo': 'I\'d be happy to help you schedule a demo! Click the "Book Demo" button to get started.',
        'quote': 'Ready for a quote? Click the "Get Free Quote" button and we\'ll provide a custom estimate for your project.',
        'default': 'I\'m here to help! You can ask me about our services, pricing, portfolio, or anything else. Try asking about "services" or "contact".'
    };

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

function toggleChatbot() {
    const chatbot = document.getElementById('chatbot');
    chatbot.classList.toggle('active');
}

async function sendMessage() {
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const message = chatbotInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    chatbotInput.value = '';
    
    // Show typing indicator
    addTypingIndicator();
    
    try {
        // Get response from webhook
        const response = await getBotResponse(message);
        removeTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        removeTypingIndicator();
        addMessage('Sorry, I\'m having trouble right now. Please try again.', 'bot');
    }
}

function addTypingIndicator() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = '<p>Rahisisha AI is typing...</p>';
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addMessage(message, sender) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageP = document.createElement('p');
    messageP.textContent = message; // Use textContent instead of innerHTML
    messageDiv.appendChild(messageP);
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

async function getBotResponse(message) {
    try {
        // Send message to webhook
        const response = await fetch('/.netlify/functions/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                sessionId: getSessionId(),
                user_id: getSessionId(),
                timestamp: new Date().toISOString(),
                source: 'website_chat'
            })
        });
        
        if (!response.ok) {
            throw new Error('Webhook failed');
        }
        
        const data = await response.json();
        return data.reply || data.response || data.message || 'Sorry, I\'m having trouble right now. Please try again.';
        
    } catch (error) {
        console.error('Chatbot webhook error:', error);
        return getFallbackResponse(message);
    }
}

function getFallbackResponse(message) {
    const fallbacks = {
        'hello': 'Hi! I\'m Rahisisha AI. How can I help you today?',
        'hi': 'Hello! I\'m Rahisisha AI, here to assist you.',
        'services': 'We offer 5 core services: Web Development ($150+), Mobile Apps ($500+), AI Automation ($200+), Digital Marketing ($500/month), and AI Training ($100+).',
        'pricing': 'Our pricing: Web Development starts at $150, Mobile Apps at $500, AI Automation at $200, Digital Marketing at $500/month, AI Training at $100.',
        'contact': 'You can reach us at hello@rahisishatech.com, call +254111546120, or WhatsApp us directly!',
        'demo': 'I\'d be happy to help you schedule a demo! What service interests you most?',
        'quote': 'Ready for a quote? What type of project are you planning?',
        'default': 'I\'m Rahisisha AI! Ask me about our services, pricing, contact info, or to schedule a demo. How can I help?'
    };
    
    const lowerMessage = message.toLowerCase();
    for (let key in fallbacks) {
        if (lowerMessage.includes(key)) {
            return fallbacks[key];
        }
    }
    return fallbacks.default;
}

function getSessionId() {
    let sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
}

// Cookie Consent
function initCookieConsent() {
    // Check if user has already made a choice
    if (localStorage.getItem('cookieConsent')) {
        return;
    }
}

function showCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent && !localStorage.getItem('cookieConsent')) {
        cookieConsent.classList.add('show');
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    hideCookieConsent();
    
    // Initialize analytics (replace with actual tracking codes)
    initAnalytics();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    hideCookieConsent();
}

function hideCookieConsent() {
    const cookieConsent = document.getElementById('cookie-consent');
    cookieConsent.classList.remove('show');
}

function initAnalytics() {
    // Google Analytics initialization (replace with your tracking ID)
    // gtag('config', 'GA_TRACKING_ID');
    
    // Meta Pixel initialization (replace with your pixel ID)
    // fbq('init', 'PIXEL_ID');
    
    console.log('Analytics initialized');
}

// Scroll Effects
function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Language Switcher
function initLanguageSwitcher() {
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            const selectedLanguage = e.target.value;
            switchLanguage(selectedLanguage);
        });
    }
}

function switchLanguage(language) {
    try {
        // Store language preference
        localStorage.setItem('preferredLanguage', language);
        
        // In a real implementation, you would load language files
        // For now, we'll just show a notification
        showNotification(`Language switched to ${language.toUpperCase()}`, 'info');
    } catch (error) {
        console.error('Failed to switch language:', error);
        showNotification('Failed to switch language', 'error');
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = newsletterForm.querySelector('input[type="email"]').value;
            const submitBtn = newsletterForm.querySelector('button');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            try {
                // Simulate newsletter subscription
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showNotification('Successfully subscribed to newsletter!', 'success');
                newsletterForm.reset();
                
            } catch (error) {
                showNotification('Failed to subscribe. Please try again.', 'error');
            } finally {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const content = document.createElement('div');
    content.className = 'notification-content';
    
    const icon = document.createElement('i');
    icon.className = `fas ${getNotificationIcon(type)}`;
    
    const span = document.createElement('span');
    span.textContent = message; // Use textContent instead of innerHTML
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.onclick = () => notification.remove();
    
    content.appendChild(icon);
    content.appendChild(span);
    content.appendChild(closeBtn);
    notification.appendChild(content);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    return colors[type] || colors.info;
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance Optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(notificationStyles);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
            
            showNotification(`Switched to ${newTheme} mode`, 'info');
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

// AI Welcome Popup
function showAIWelcome() {
    const aiWelcome = document.getElementById('ai-welcome');
    if (aiWelcome && !localStorage.getItem('aiWelcomeShown')) {
        aiWelcome.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            closeAIWelcome();
        }, 5000);
    }
}

function closeAIWelcome() {
    const aiWelcome = document.getElementById('ai-welcome');
    if (aiWelcome) {
        aiWelcome.classList.remove('show');
        localStorage.setItem('aiWelcomeShown', 'true');
    }
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const startValue = parseInt(counter.textContent) || 0;
        const increment = (target - startValue) / 60; // 60 frames for smooth animation
        let current = startValue;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// ROI Calculator
function initROICalculator() {
    const roiNumbers = document.querySelectorAll('.roi-number');
    
    const animateROI = (element, targetValue) => {
        const increment = targetValue / 50;
        let current = 0;
        
        const updateROI = () => {
            if (current < targetValue) {
                current += increment;
                element.textContent = Math.ceil(current) + '%';
                requestAnimationFrame(updateROI);
            } else {
                element.textContent = targetValue + '%';
            }
        };
        
        updateROI();
    };
    
    // Use Intersection Observer for ROI animation
    const roiObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                // Set specific values for each ROI metric
                if (text.includes('Time')) {
                    animateROI(element, 70);
                } else if (text.includes('Cost')) {
                    animateROI(element, 45);
                } else if (text.includes('Productivity')) {
                    animateROI(element, 300);
                }
                
                roiObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });
    
    roiNumbers.forEach(number => {
        roiObserver.observe(number);
    });
}

// Export functions for global access
window.openQuoteModal = openQuoteModal;
window.openDemoModal = openDemoModal;
window.toggleChatbot = toggleChatbot;
window.sendMessage = sendMessage;
window.acceptCookies = acceptCookies;
window.declineCookies = declineCookies;
window.closeAIWelcome = closeAIWelcome;