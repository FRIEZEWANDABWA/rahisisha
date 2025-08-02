// Portfolio page functionality
document.addEventListener('DOMContentLoaded', function() {
    initPortfolioPage();
});

function initPortfolioPage() {
    initPortfolioAnimations();
    initPortfolioFilter();
    initProjectModals();
    initLoadMore();
}

// Portfolio page animations
function initPortfolioAnimations() {
    // Hero section animation
    gsap.timeline()
        .from('.portfolio-hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.portfolio-hero-content p', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.portfolio-stats .stat', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
        }, '-=0.3');

    // Filter buttons animation
    gsap.from('.filter-btn', {
        scrollTrigger: {
            trigger: '.portfolio-filters-section',
            start: 'top 90%',
            end: 'bottom 10%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Featured case study animation
    gsap.from('.case-study-content', {
        scrollTrigger: {
            trigger: '.featured-case-study',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
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

    // Testimonials animation
    gsap.from('.testimonial-card', {
        scrollTrigger: {
            trigger: '.portfolio-testimonials',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
    });
}

// Portfolio filter functionality
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || itemCategory === filterValue;

                if (shouldShow) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    });
                    item.style.display = 'block';
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.8,
                        y: 20,
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

// Project detail modals
function initProjectModals() {
    const portfolioLinks = document.querySelectorAll('.portfolio-link[data-project]');
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.close');
    const projectDetails = document.getElementById('project-details');

    // Project data
    const projects = {
        'ecommerce': {
            title: 'E-commerce Platform - AfriShop Online',
            category: 'Web Development',
            client: 'AfriShop Online',
            duration: '3 months',
            team: '5 developers',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AI Recommendations'],
            challenge: 'AfriShop needed a modern e-commerce platform that could handle high traffic and provide personalized shopping experiences for African consumers.',
            solution: 'We built a scalable e-commerce platform with AI-powered product recommendations, multi-currency support, and mobile-optimized checkout process.',
            results: [
                { metric: '200%', description: 'Increase in online sales' },
                { metric: '150%', description: 'Improvement in conversion rate' },
                { metric: '85%', description: 'Mobile traffic increase' },
                { metric: '4.8/5', description: 'Customer satisfaction rating' }
            ],
            features: [
                'AI-powered product recommendations',
                'Multi-currency and payment gateway integration',
                'Advanced search and filtering',
                'Mobile-responsive design',
                'Inventory management system',
                'Customer analytics dashboard'
            ],
            testimonial: {
                text: "The e-commerce platform exceeded our expectations. Sales increased by 200% within the first quarter.",
                author: "Mary Wanjiku",
                position: "Founder, AfriShop Online"
            }
        },
        'chatbot': {
            title: 'Intelligent Customer Support Bot - TelecomCorp',
            category: 'AI Automation',
            client: 'TelecomCorp Kenya',
            duration: '2 months',
            team: '3 AI specialists',
            technologies: ['Natural Language Processing', 'Machine Learning', 'Python', 'TensorFlow', 'REST APIs'],
            challenge: 'TelecomCorp was overwhelmed with customer support requests and needed 24/7 multilingual support capability.',
            solution: 'We developed an intelligent chatbot with natural language processing capabilities that can handle customer queries in English and Swahili.',
            results: [
                { metric: '80%', description: 'Query resolution rate' },
                { metric: '60%', description: 'Reduction in support tickets' },
                { metric: '24/7', description: 'Availability' },
                { metric: '95%', description: 'Customer satisfaction' }
            ],
            features: [
                'Multilingual support (English & Swahili)',
                'Natural language understanding',
                'Integration with existing CRM',
                'Escalation to human agents',
                'Analytics and reporting',
                'Continuous learning capabilities'
            ],
            testimonial: {
                text: "The chatbot has revolutionized our customer support. We can now provide 24/7 assistance with 80% query resolution.",
                author: "John Kiprotich",
                position: "Customer Service Manager, TelecomCorp"
            }
        }
        // Add more projects as needed
    };

    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            const project = projects[projectId];

            if (project) {
                showProjectModal(project);
            }
        });
    });

    function showProjectModal(project) {
        projectDetails.innerHTML = `
            <div class="project-modal-header">
                <h2>${project.title}</h2>
                <div class="project-meta">
                    <span class="project-category">${project.category}</span>
                    <span class="project-duration">${project.duration}</span>
                </div>
            </div>
            
            <div class="project-modal-content">
                <div class="project-overview">
                    <div class="project-info">
                        <h3>Project Overview</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Client:</strong> ${project.client}
                            </div>
                            <div class="info-item">
                                <strong>Duration:</strong> ${project.duration}
                            </div>
                            <div class="info-item">
                                <strong>Team Size:</strong> ${project.team}
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-technologies">
                        <h3>Technologies Used</h3>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
                
                <div class="project-details-section">
                    <div class="project-challenge">
                        <h3>Challenge</h3>
                        <p>${project.challenge}</p>
                    </div>
                    
                    <div class="project-solution">
                        <h3>Solution</h3>
                        <p>${project.solution}</p>
                    </div>
                    
                    <div class="project-features">
                        <h3>Key Features</h3>
                        <ul>
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="project-results-section">
                    <h3>Results Achieved</h3>
                    <div class="results-grid">
                        ${project.results.map(result => `
                            <div class="result-item">
                                <div class="result-number">${result.metric}</div>
                                <div class="result-description">${result.description}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="project-testimonial">
                    <blockquote>
                        "${project.testimonial.text}"
                    </blockquote>
                    <div class="testimonial-author">
                        <strong>${project.testimonial.author}</strong>
                        <span>${project.testimonial.position}</span>
                    </div>
                </div>
                
                <div class="project-actions">
                    <a href="quote.html" class="btn btn-primary">
                        <i class="fas fa-rocket"></i>
                        Start Similar Project
                    </a>
                    <a href="contact.html" class="btn btn-outline">
                        <i class="fas fa-comments"></i>
                        Discuss Your Needs
                    </a>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Animate modal content
        gsap.from('.project-modal-content', {
            y: 50,
            opacity: 0,
            duration: 0.5,
            ease: 'power3.out'
        });
    }

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Load more functionality
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-portfolio');
    let projectsLoaded = 9; // Initial number of projects shown

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            const originalText = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;

            try {
                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Generate more portfolio items (in a real app, this would fetch from an API)
                const newProjects = generateMoreProjects(3);
                const portfolioGrid = document.querySelector('.portfolio-grid');

                newProjects.forEach((projectHTML, index) => {
                    const projectElement = document.createElement('div');
                    projectElement.className = 'portfolio-item';
                    projectElement.setAttribute('data-category', 'web'); // Default category
                    projectElement.innerHTML = projectHTML;
                    projectElement.style.opacity = '0';
                    projectElement.style.transform = 'translateY(50px)';

                    portfolioGrid.appendChild(projectElement);

                    // Animate in
                    gsap.to(projectElement, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.2,
                        ease: 'power3.out'
                    });
                });

                projectsLoaded += 3;

                // Hide load more button after loading 18 projects
                if (projectsLoaded >= 18) {
                    loadMoreBtn.style.display = 'none';
                    showNotification('All projects loaded!', 'info');
                }

            } catch (error) {
                showNotification('Failed to load more projects. Please try again.', 'error');
            } finally {
                loadMoreBtn.innerHTML = originalText;
                loadMoreBtn.disabled = false;
            }
        });
    }
}

// Generate more portfolio projects (mock data)
function generateMoreProjects(count) {
    const mockProjects = [
        {
            title: 'Restaurant Management System',
            description: 'Complete POS and inventory management solution',
            image: 'images/extra photos/cristiano-firmani-tmTidmpILWw-unsplash.jpg',
            client: 'Savannah Restaurant',
            category: 'Restaurant',
            result: '40% Efficiency Gain',
            tags: ['Vue.js', 'Laravel', 'MySQL']
        },
        {
            title: 'Real Estate Platform',
            description: 'Property listing and management platform',
            image: 'images/extra photos/nikita-kachanovsky-OVbeSXRk_9E-unsplash.jpg',
            client: 'PropertyHub Kenya',
            category: 'Real Estate',
            result: '300% Lead Increase',
            tags: ['React', 'Node.js', 'MongoDB']
        },
        {
            title: 'Educational Management System',
            description: 'School management and e-learning platform',
            image: 'images/extra photos/radek-grzybowski-eBRTYyjwpRY-unsplash.jpg',
            client: 'EduTech Solutions',
            category: 'Education',
            result: '5000+ Students',
            tags: ['Angular', 'Python', 'PostgreSQL']
        }
    ];

    return mockProjects.slice(0, count).map(project => `
        <div class="portfolio-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <div class="portfolio-overlay">
                <div class="portfolio-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <div class="portfolio-links">
                        <a href="#" class="portfolio-link">
                            <i class="fas fa-eye"></i>
                            View Details
                        </a>
                        <a href="#" class="portfolio-link">
                            <i class="fas fa-external-link-alt"></i>
                            Live Demo
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="portfolio-meta">
            <div class="client-info">
                <h4>${project.client}</h4>
                <span>${project.category}</span>
            </div>
            <div class="project-results">
                <span class="result">${project.result}</span>
            </div>
        </div>
    `);
}

// Portfolio item hover effects
document.querySelectorAll('.portfolio-item').forEach(item => {
    const image = item.querySelector('.portfolio-image img');
    
    item.addEventListener('mouseenter', () => {
        gsap.to(image, {
            scale: 1.1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    item.addEventListener('mouseleave', () => {
        gsap.to(image, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Add CSS for project modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .project-modal-content {
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .project-modal-header {
        text-align: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid rgba(224, 224, 224, 0.1);
    }
    
    .project-meta {
        display: flex;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
    }
    
    .project-category,
    .project-duration {
        background: var(--accent-color);
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .project-overview {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
    }
    
    .info-grid {
        display: grid;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .info-item {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .project-details-section {
        margin: 2rem 0;
    }
    
    .project-details-section > div {
        margin-bottom: 1.5rem;
    }
    
    .project-details-section h3 {
        color: var(--accent-color);
        margin-bottom: 0.5rem;
    }
    
    .project-details-section ul {
        list-style: none;
        margin-top: 1rem;
    }
    
    .project-details-section li {
        padding: 0.25rem 0;
        color: var(--text-secondary);
        position: relative;
        padding-left: 1.5rem;
    }
    
    .project-details-section li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: var(--accent-color);
        font-weight: bold;
    }
    
    .project-results-section {
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(224, 224, 224, 0.05);
        border-radius: var(--border-radius);
    }
    
    .project-results-section .results-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
    
    .result-item {
        text-align: center;
        padding: 1rem;
        background: var(--background-card);
        border-radius: var(--border-radius);
    }
    
    .result-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent-color);
        margin-bottom: 0.5rem;
    }
    
    .result-description {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .project-testimonial {
        margin: 2rem 0;
        padding: 1.5rem;
        background: rgba(0, 191, 255, 0.1);
        border-radius: var(--border-radius);
        border-left: 4px solid var(--accent-color);
    }
    
    .project-testimonial blockquote {
        font-style: italic;
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 1rem;
        color: var(--text-color);
    }
    
    .project-testimonial .testimonial-author {
        text-align: right;
    }
    
    .project-testimonial .testimonial-author strong {
        color: var(--text-color);
        display: block;
    }
    
    .project-testimonial .testimonial-author span {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }
    
    .project-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(224, 224, 224, 0.1);
    }
    
    @media (max-width: 768px) {
        .project-overview {
            grid-template-columns: 1fr;
        }
        
        .project-meta {
            flex-direction: column;
            align-items: center;
        }
        
        .project-actions {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(modalStyles);