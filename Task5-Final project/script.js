// Performance optimization: Use efficient data structures
        class ShoppingApp {
            constructor() {
                this.products = [];
                this.cart = new Map();
                this.currentPage = 1;
                this.productsPerPage = 6;
                this.isLoading = false;

                this.init();
            }

            init() {
                this.generateProducts();
                this.bindEvents();
                this.loadProducts();
                this.updateCartCount();
            }

            // Generate sample products (simulating API data)
            generateProducts() {
                const productTypes = [
                    { name: 'Smartphone', icon: '📱', basePrice: 599 },
                    { name: 'Laptop', icon: '💻', basePrice: 999 },
                    { name: 'Headphones', icon: '🎧', basePrice: 199 },
                    { name: 'Tablet', icon: '📲', basePrice: 399 },
                    { name: 'Smartwatch', icon: '⌚', basePrice: 299 },
                    { name: 'Camera', icon: '📷', basePrice: 799 },
                    { name: 'Gaming Console', icon: '🎮', basePrice: 499 },
                    { name: 'TV', icon: '📺', basePrice: 899 },
                    { name: 'Speaker', icon: '🔊', basePrice: 149 },
                    { name: 'Keyboard', icon: '⌨', basePrice: 89 },
                    { name: 'Mouse', icon: '🖱', basePrice: 59 },
                    { name: 'Monitor', icon: '🖥', basePrice: 329 }
                ];

                const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'HP', 'Logitech', 'Razer'];
                const adjectives = ['Pro', 'Plus', 'Ultra', 'Max', 'Elite', 'Prime', 'Advanced', 'Premium'];

                for (let i = 1; i <= 24; i++) {
                    const type = productTypes[Math.floor(Math.random() * productTypes.length)];
                    const brand = brands[Math.floor(Math.random() * brands.length)];
                    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

                    this.products.push({
                        id: i,
                        name: ${brand} ${type.name} ${adj},
                        description: Experience cutting-edge technology with this premium ${type.name.toLowerCase()}. Perfect for professionals and enthusiasts.,
                        price: type.basePrice + Math.floor(Math.random() * 300),
                        icon: type.icon,
                        inStock: Math.random() > 0.1 // 90% chance of being in stock
                    });
                }
            }

            bindEvents() {
                // Mobile menu toggle
                document.getElementById('mobileMenuBtn').addEventListener('click', () => {
                    document.getElementById('navMenu').classList.toggle('active');
                });

                // Cart modal
                document.getElementById('cartBtn').addEventListener('click', () => {
                    this.openCart();
                });

                document.getElementById('closeCartBtn').addEventListener('click', () => {
                    this.closeCart();
                });

                document.getElementById('cartModal').addEventListener('click', (e) => {
                    if (e.target.id === 'cartModal') {
                        this.closeCart();
                    }
                });

                // Load more products
                document.getElementById('loadMoreBtn').addEventListener('click', () => {
                    this.loadMoreProducts();
                });

                // Checkout
                document.getElementById('checkoutBtn').addEventListener('click', () => {
                    this.checkout();
                });

                // Smooth scrolling for navigation links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = document.querySelector(anchor.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth' });
                        }
                    });
                });

                // Close mobile menu when clicking on links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        document.getElementById('navMenu').classList.remove('active');
                    });
                });
            }

            loadProducts() {
                const grid = document.getElementById('productGrid');
                const startIndex = (this.currentPage - 1) * this.productsPerPage;
                const endIndex = startIndex + this.productsPerPage;
                const productsToShow = this.products.slice(0, endIndex);

                // Clear grid if it's the first load
                if (this.currentPage === 1) {
                    grid.innerHTML = '';
                }

                // Add new products
                const newProducts = this.products.slice(startIndex, endIndex);
                newProducts.forEach(product => {
                    const productCard = this.createProductCard(product);
                    grid.appendChild(productCard);
                });

                // Update load more button
                const loadMoreBtn = document.getElementById('loadMoreBtn');
                if (endIndex >= this.products.length) {
                    loadMoreBtn.style.display = 'none';
                } else {
                    loadMoreBtn.style.display = 'inline-flex';
                }

                // Lazy load animation
                this.animateNewProducts();
            }

            createProductCard(product) {
                const card = document.createElement('div');
                card.className = 'product-card lazy-load';
                card.innerHTML = `
                    <div class="product-image">
                        ${product.icon}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-description">${product.description}</p>
                        <div class="product-price">$${product.price.toLocaleString()}</div>
                        <button class="add-to-cart" 
                                onclick="app.addToCart(${product.id})" 
                                ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                    </div>
                `;
                return card;
            }

            animateNewProducts() {
                // Add loading animation to new products
                const newCards = document.querySelectorAll('.product-card.lazy-load');
                newCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('loaded');
                    }, index * 100);
                });
            }

            loadMoreProducts() {
                if (this.isLoading) return;

                this.isLoading = true;
                const btn = document.getElementById('loadMoreBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<span class="loading"></span> Loading...';
                btn.disabled = true;

                // Simulate network delay
                setTimeout(() => {
                    this.currentPage++;
                    this.loadProducts();
                    this.isLoading = false;
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }, 800);
            }

            addToCart(productId) {
                const product = this.products.find(p => p.id === productId);
                if (!product || !product.inStock) return;

                if (this.cart.has(productId)) {
                    this.cart.set(productId, this.cart.get(productId) + 1);
                } else {
                    this.cart.set(productId, 1);
                }

                this.updateCartCount();
                this.showToast(${product.name} added to cart!);
                this.animateCartButton();
            }

            removeFromCart(productId) {
                this.cart.delete(productId);
                this.updateCartCount();
                this.renderCartItems();
            }

            updateQuantity(productId, quantity) {
                if (quantity <= 0) {
                    this.removeFromCart(productId);
                } else {
                    this.cart.set(productId, quantity);
                    this.updateCartCount();
                    this.renderCartItems();
                }
            }

            updateCartCount() {
                const count = Array.from(this.cart.values()).reduce((sum, qty) => sum + qty, 0);
                document.getElementById('cartCount').textContent = count;
            }

            openCart() {
                this.renderCartItems();
                document.getElementById('cartModal').classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            closeCart() {
                document.getElementById('cartModal').classList.remove('active');
                document.body.style.overflow = '';
            }

            renderCartItems() {
                const container = document.getElementById('cartItems');
                container.innerHTML = '';

                if (this.cart.size === 0) {
                    container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">Your cart is empty</p>';
                    document.getElementById('cartTotal').textContent = '0.00';
                    return;
                }

                let total = 0;
                this.cart.forEach((quantity, productId) => {
                    const product = this.products.find(p => p.id === productId);
                    if (product) {
                        const itemTotal = product.price * quantity;
                        total += itemTotal;

                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `
                            <div style="font-size: 2rem;">${product.icon}</div>
                            <div class="cart-item-info">
                                <div class="cart-item-title">${product.name}</div>
                                <div class="cart-item-price">${product.price.toLocaleString()} × ${quantity} = ${itemTotal.toLocaleString()}</div>
                            </div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="app.updateQuantity(${productId}, ${quantity - 1})">-</button>
                                <span style="padding: 0 0.5rem;">${quantity}</span>
                                <button class="quantity-btn" onclick="app.updateQuantity(${productId}, ${quantity + 1})">+</button>
                            </div>
                            <button class="quantity-btn" onclick="app.removeFromCart(${productId})" style="color: var(--error-color); margin-left: 0.5rem;" title="Remove item">×</button>
                        `;
                        container.appendChild(cartItem);
                    }
                });

                document.getElementById('cartTotal').textContent = total.toLocaleString();
            }

            animateCartButton() {
                const cartBtn = document.getElementById('cartBtn');
                cartBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    cartBtn.style.transform = 'scale(1)';
                }, 200);
            }

            showToast(message, type = 'success') {
                // Remove existing toast
                const existingToast = document.querySelector('.toast');
                if (existingToast) {
                    existingToast.remove();
                }

                const toast = document.createElement('div');
                toast.className = toast ${type};
                toast.textContent = message;
                document.body.appendChild(toast);

                // Show toast
                setTimeout(() => toast.classList.add('show'), 100);

                // Hide toast
                setTimeout(() => {
                    toast.classList.remove('show');
                    setTimeout(() => toast.remove(), 300);
                }, 3000);
            }

            checkout() {
                if (this.cart.size === 0) {
                    this.showToast('Your cart is empty!', 'error');
                    return;
                }

                const checkoutBtn = document.getElementById('checkoutBtn');
                const originalText = checkoutBtn.innerHTML;
                checkoutBtn.innerHTML = '<span class="loading"></span> Processing...';
                checkoutBtn.disabled = true;

                // Simulate checkout process
                setTimeout(() => {
                    this.cart.clear();
                    this.updateCartCount();
                    this.closeCart();
                    this.showToast('Order placed successfully! Thank you for your purchase.');

                    checkoutBtn.innerHTML = originalText;
                    checkoutBtn.disabled = false;
                }, 2000);
            }
        }

        // Initialize the application
        const app = new ShoppingApp();

        // Performance optimizations

        // Debounced scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Add scroll-based animations or lazy loading here
                const scrollTop = window.pageYOffset;
                const header = document.querySelector('.header');

                if (scrollTop > 100) {
                    header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
                } else {
                    header.style.boxShadow = 'var(--shadow)';
                }
            }, 10);
        });

        // Intersection Observer for lazy loading
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe lazy load elements
        document.addEventListener('DOMContentLoaded', () => {
            const lazyElements = document.querySelectorAll('.lazy-load');
            lazyElements.forEach(el => observer.observe(el));
        });

        // Service Worker for caching (Progressive Web App features)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // In a real application, you would register a service worker here
                console.log('Service Worker support detected');
            });
        }

        // Preload critical resources
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        preloadLink.as = 'style';
        document.head.appendChild(preloadLink);

        // Error handling
        window.addEventListener('error', (e) => {
            console.error('Application error:', e.error);
            // In production, you might want to send this to a logging service
        });

        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            // ESC key closes modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal-overlay.active');
                if (modal) {
                    app.closeCart();
                }
            }

            // Enter key on cart button opens cart
            if (e.key === 'Enter' && document.activeElement === document.getElementById('cartBtn')) {
                app.openCart();
            }
        });

        // Touch gesture support for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;

            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                // Swipe left/right logic could be implemented here
                // For example, navigating between product categories
            }

            touchStartX = 0;
            touchStartY = 0;
        });

        // Performance monitoring
        window.addEventListener('load', () => {
            // Monitor performance metrics
            if ('performance' in window) {
                const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                console.log(Page load time: ${loadTime}ms);

                // In production, you might send this data to analytics
                if (loadTime > 3000) {
                    console.warn('Page load time is slower than optimal');
                }
            }
        });

        // Optimize images and lazy loading
        const optimizeImages = () => {
            const images = document.querySelectorAll('img[data-src]');
            images.forEach(img => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    });
                });
                observer.observe(img);
            });
        };

        // Call optimization functions
        optimizeImages();

        // Browser compatibility checks
        const checkBrowserSupport = () => {
            const features = {
                flexbox: CSS.supports('display', 'flex'),
                grid: CSS.supports('display', 'grid'),
                customProperties: CSS.supports('--test', 'value'),
                intersectionObserver: 'IntersectionObserver' in window,
                serviceWorker: 'serviceWorker' in navigator
            };

            const unsupportedFeatures = Object.entries(features)
                .filter(([key, supported]) => !supported)
                .map(([key]) => key);

            if (unsupportedFeatures.length > 0) {
                console.warn('Unsupported features detected:', unsupportedFeatures);
                // Implement fallbacks for unsupported features
