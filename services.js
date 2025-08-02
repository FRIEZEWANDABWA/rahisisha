// Services page functionality
document.addEventListener('DOMContentLoaded', function() {
    initServicesPage();
});

function initServicesPage() {
    initServicesAnimations();
    initServicesFAQ();
    initScrollSpy();
}

// Services page animations
function initServicesAnimations() {
    // Hero section animation
    gsap.timeline()
        .from('.services-hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.services-hero-content p', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.hero-stats .stat', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');

    // Service sections animation
    gsap.utils.toArray('.service-detail').forEach((section, index) => {
        gsap.from(section.querySelector('.service-text'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            x: index % 2 === 0 ? -100 : 100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from(section.querySelector('.service-image'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            x: index % 2 === 0 ? 100 : -100,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Features animation
    gsap.from('.feature', {
        scrollTrigger: {
            trigger: '.features-grid',
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

    // ROI stats animation
    gsap.from('.roi-stat', {
        scrollTrigger: {
            trigger: '.roi-calculator',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.7)'
    });

    // CTA section animation
    gsap.from('.services-cta .cta-content', {
        scrollTrigger: {
            trigger: '.services-cta',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
}

// FAQ functionality for services page
function initServicesFAQ() {
    const faqItems = document.querySelectorAll('.services-faq .faq-item');
    
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

// Scroll spy for service sections
function initScrollSpy() {
    const sections = document.querySelectorAll('.service-detail');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active nav link if on services page
        if (current && window.location.pathname.includes('services')) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `services.html#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Smooth scroll to service sections
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Service card hover effects
document.querySelectorAll('.service-detail').forEach(section => {
    const serviceImage = section.querySelector('.service-image img');
    
    if (serviceImage) {
        section.addEventListener('mouseenter', () => {
            gsap.to(serviceImage, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        section.addEventListener('mouseleave', () => {
            gsap.to(serviceImage, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    }
});

// Animate numbers on scroll
function animateNumbers() {
    const numbers = document.querySelectorAll('.roi-number, .result-metric');
    
    numbers.forEach(number => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const finalValue = entry.target.textContent;
                    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                    
                    if (!isNaN(numericValue)) {
                        gsap.from(entry.target, {
                            textContent: 0,
                            duration: 2,
                            ease: 'power2.out',
                            snap: { textContent: 1 },
                            onUpdate: function() {
                                const currentValue = Math.round(this.targets()[0].textContent);
                                entry.target.textContent = finalValue.replace(/\d+/, currentValue);
                            }
                        });
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(number);
    });
}

// Initialize number animation
animateNumbers();