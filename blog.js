// Blog-specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    initBlogFunctionality();
});

function initBlogFunctionality() {
    initBlogSearch();
    initCategoryFilter();
    initLoadMore();
    initBlogAnimations();
    initNewsletterSignup();
}

// Blog Search Functionality
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const articles = document.querySelectorAll('.blog-article');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            
            articles.forEach(article => {
                const title = article.querySelector('h3').textContent.toLowerCase();
                const content = article.querySelector('p').textContent.toLowerCase();
                const tags = Array.from(article.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
                
                const isMatch = title.includes(searchTerm) || 
                               content.includes(searchTerm) || 
                               tags.some(tag => tag.includes(searchTerm));
                
                if (isMatch || searchTerm === '') {
                    gsap.to(article, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    article.style.display = 'block';
                } else {
                    gsap.to(article, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: () => {
                            article.style.display = 'none';
                        }
                    });
                }
            });
            
            // Show no results message if needed
            const visibleArticles = Array.from(articles).filter(article => 
                window.getComputedStyle(article).display !== 'none'
            );
            
            showNoResultsMessage(visibleArticles.length === 0 && searchTerm !== '');
        }, 300));
    }
}

// Category Filter
function initCategoryFilter() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const articles = document.querySelectorAll('.blog-article');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-category');
            
            articles.forEach((article, index) => {
                const articleCategory = article.getAttribute('data-category');
                const shouldShow = category === 'all' || articleCategory === category;
                
                if (shouldShow) {
                    gsap.to(article, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: 'power3.out'
                    });
                    article.style.display = 'block';
                } else {
                    gsap.to(article, {
                        opacity: 0,
                        y: 20,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power2.out',
                        onComplete: () => {
                            article.style.display = 'none';
                        }
                    });
                }
            });
        });
    });
}

// Load More Articles
function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    let articlesLoaded = 6; // Initial number of articles shown
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', async () => {
            const originalText = loadMoreBtn.innerHTML;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            loadMoreBtn.disabled = true;
            
            try {
                // Simulate loading delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Generate more articles (in a real app, this would fetch from an API)
                const newArticles = generateMoreArticles(3);
                const blogGrid = document.querySelector('.blog-articles-grid');
                
                newArticles.forEach((articleHTML, index) => {
                    const articleElement = document.createElement('article');
                    articleElement.className = 'blog-article';
                    articleElement.innerHTML = articleHTML;
                    articleElement.style.opacity = '0';
                    articleElement.style.transform = 'translateY(50px)';
                    
                    blogGrid.appendChild(articleElement);
                    
                    // Animate in
                    gsap.to(articleElement, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        delay: index * 0.2,
                        ease: 'power3.out'
                    });
                });
                
                articlesLoaded += 3;
                
                // Hide load more button after loading 15 articles
                if (articlesLoaded >= 15) {
                    loadMoreBtn.style.display = 'none';
                    showNotification('All articles loaded!', 'info');
                }
                
            } catch (error) {
                showNotification('Failed to load more articles. Please try again.', 'error');
            } finally {
                loadMoreBtn.innerHTML = originalText;
                loadMoreBtn.disabled = false;
            }
        });
    }
}

// Generate More Articles (Mock Data)
function generateMoreArticles(count) {
    const mockArticles = [
        {
            category: 'ai',
            date: 'Nov 28, 2023',
            readTime: '6 min read',
            title: 'Understanding Natural Language Processing in Business',
            description: 'Explore how NLP is revolutionizing customer service and business intelligence.',
            image: 'images/extra photos/blake-wisz-Xn5FbEM9564-unsplash.jpg',
            author: 'Dr. Sarah Chen',
            authorImage: 'images/extra photos/desola-lanre-ologun-IgUR1iX0mqM-unsplash.jpg',
            views: '1.5k',
            likes: '112',
            tags: ['NLP', 'AI', 'Business']
        },
        {
            category: 'development',
            date: 'Nov 25, 2023',
            readTime: '8 min read',
            title: 'Serverless Architecture: Pros, Cons, and Best Practices',
            description: 'A comprehensive guide to implementing serverless solutions for modern applications.',
            image: 'images/extra photos/cristiano-firmani-tmTidmpILWw-unsplash.jpg',
            author: 'Mark Johnson',
            authorImage: 'images/extra photos/lorenzo-herrera-p0j-mE6mGo4-unsplash.jpg',
            views: '2.3k',
            likes: '189',
            tags: ['Serverless', 'AWS', 'Architecture']
        },
        {
            category: 'marketing',
            date: 'Nov 22, 2023',
            readTime: '5 min read',
            title: 'Social Media Marketing Automation Tools for 2024',
            description: 'Discover the best tools to automate your social media marketing campaigns.',
            image: 'images/extra photos/hugo-barbosa-TnG2q8FtXsg-unsplash.jpg',
            author: 'Jessica Martinez',
            authorImage: 'images/extra photos/minh-pham-AHCmAX0k_J4-unsplash.jpg',
            views: '1.8k',
            likes: '145',
            tags: ['Social Media', 'Automation', 'Marketing']
        }
    ];
    
    return mockArticles.slice(0, count).map(article => `
        <div class="article-image" data-category="${article.category}">
            <img src="${article.image}" alt="${article.title}">
            <div class="article-overlay">
                <a href="#" class="read-article-btn">
                    <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="category">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                <span class="date">${article.date}</span>
                <span class="read-time">${article.readTime}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <div class="article-tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <div class="article-footer">
                <div class="author-mini">
                    <img src="${article.authorImage}" alt="Author">
                    <span>${article.author}</span>
                </div>
                <div class="article-stats">
                    <span><i class="fas fa-eye"></i> ${article.views}</span>
                    <span><i class="fas fa-heart"></i> ${article.likes}</span>
                </div>
            </div>
        </div>
    `);
}

// Blog Animations
function initBlogAnimations() {
    // Hero section animation
    gsap.timeline()
        .from('.blog-hero-content h1', {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.blog-hero-content p', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.5')
        .from('.blog-search', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3');
    
    // Category filters animation
    gsap.from('.category-btn', {
        scrollTrigger: {
            trigger: '.blog-categories',
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
    
    // Featured article animation
    gsap.from('.featured-content', {
        scrollTrigger: {
            trigger: '.featured-article',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    // Blog articles animation
    gsap.from('.blog-article', {
        scrollTrigger: {
            trigger: '.blog-articles-grid',
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
    
    // Newsletter section animation
    gsap.from('.newsletter-content', {
        scrollTrigger: {
            trigger: '.newsletter-signup',
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

// Newsletter Signup
function initNewsletterSignup() {
    const newsletterForms = document.querySelectorAll('.newsletter-form-large');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            // Validate email
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            try {
                // Simulate newsletter subscription
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                showNotification('Successfully subscribed to our newsletter! Welcome aboard! 🎉', 'success');
                form.reset();
                
                // Track subscription (in a real app)
                trackNewsletterSubscription(email);
                
            } catch (error) {
                showNotification('Failed to subscribe. Please try again later.', 'error');
            } finally {
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }
        });
    });
}

// Show No Results Message
function showNoResultsMessage(show) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (show && !noResultsMsg) {
        noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results-message';
        noResultsMsg.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your search terms or browse our categories.</p>
                <button class="btn btn-primary" onclick="clearSearch()">
                    <i class="fas fa-refresh"></i>
                    Clear Search
                </button>
            </div>
        `;
        
        const blogGrid = document.querySelector('.blog-articles-grid');
        blogGrid.appendChild(noResultsMsg);
        
        // Animate in
        gsap.from(noResultsMsg, {
            opacity: 0,
            y: 50,
            duration: 0.5,
            ease: 'power3.out'
        });
        
    } else if (!show && noResultsMsg) {
        gsap.to(noResultsMsg, {
            opacity: 0,
            y: -50,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
                noResultsMsg.remove();
            }
        });
    }
}

// Clear Search Function
function clearSearch() {
    const searchInput = document.getElementById('blog-search');
    const articles = document.querySelectorAll('.blog-article');
    
    searchInput.value = '';
    
    articles.forEach(article => {
        gsap.to(article, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
        article.style.display = 'block';
    });
    
    showNoResultsMessage(false);
}

// Utility Functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function trackNewsletterSubscription(email) {
    // In a real application, you would send this to your analytics service
    console.log('Newsletter subscription tracked:', email);
    
    // Example: Google Analytics event
    // gtag('event', 'newsletter_signup', {
    //     'event_category': 'engagement',
    //     'event_label': 'blog_page'
    // });
}

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

// Article Reading Progress Indicator
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    // Add CSS for progress bar
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(224, 224, 224, 0.2);
            z-index: 1001;
        }
        
        .progress-fill {
            height: 100%;
            background: var(--gradient-primary);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    
    document.head.appendChild(progressStyles);
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Initialize reading progress on blog pages
if (window.location.pathname.includes('blog')) {
    initReadingProgress();
}

// Social Sharing Functions
function shareArticle(platform, title, url) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

// Export functions for global access
window.clearSearch = clearSearch;
window.shareArticle = shareArticle;