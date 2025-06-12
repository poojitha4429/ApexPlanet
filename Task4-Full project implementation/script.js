document.addEventListener('DOMContentLoaded', function() {
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('.section');
            const hamburger = document.getElementById('hamburger');
            const navLinksContainer = document.querySelector('.nav-links');

            // Navigation switching
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();

                    // Remove active class from all links and sections
                    navLinks.forEach(l => l.classList.remove('active'));
                    sections.forEach(s => s.classList.remove('active'));

                    // Add active class to clicked link
                    this.classList.add('active');

                    // Show corresponding section
                    const targetId = this.getAttribute('href').substring(1);
                    document.getElementById(targetId).classList.add('active');

                    // Close mobile menu
                    navLinksContainer.classList.remove('active');
                });
            });

            // Hamburger menu toggle
            hamburger.addEventListener('click', function() {
                navLinksContainer.classList.toggle('active');
            });

            // Initialize apps
            initTodoApp();
            initProductFilter();
        });

        // Todo App Implementation with Local Storage
        let todos = JSON.parse(localStorage.getItem('todos')) || [];

        function initTodoApp() {
            renderTodos();
            updateTodoCount();

            // Enter key support for adding todos
            document.getElementById('todo-input').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTodo();
                }
            });
        }

        function addTodo() {
            const input = document.getElementById('todo-input');
            const text = input.value.trim();

            if (text === '') return;

            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };

            todos.unshift(todo);
            saveTodos();
            renderTodos();
            updateTodoCount();
            input.value = '';
        }

        function toggleTodo(id) {
            todos = todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            );
            saveTodos();
            renderTodos();
            updateTodoCount();
        }

        function deleteTodo(id) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
            updateTodoCount();
        }

        function editTodo(id) {
            const todo = todos.find(t => t.id === id);
            const newText = prompt('Edit task:', todo.text);

            if (newText !== null && newText.trim() !== '') {
                todos = todos.map(t => 
                    t.id === id ? { ...t, text: newText.trim() } : t
                );
                saveTodos();
                renderTodos();
            }
        }

        function renderTodos() {
            const todoList = document.getElementById('todo-list');

            if (todos.length === 0) {
                todoList.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 2rem;">No tasks yet. Add one above!</p>';
                return;
            }

            todoList.innerHTML = todos.map(todo => `
                <div class="todo-item">
                    <div class="todo-content">
                        <input type="checkbox" class="todo-checkbox" 
                               ${todo.completed ? 'checked' : ''} 
                               onchange="toggleTodo(${todo.id})">
                        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                    </div>
                    <div class="todo-actions">
                        <button onclick="editTodo(${todo.id})" title="Edit">✏</button>
                        <button onclick="deleteTodo(${todo.id})" title="Delete">🗑</button>
                    </div>
                </div>
            `).join('');
        }

        function updateTodoCount() {
            const activeCount = todos.filter(todo => !todo.completed).length;
            const totalCount = todos.length;
            document.getElementById('todo-count').textContent = 
                ${activeCount} active of ${totalCount} tasks;
        }

        function saveTodos() {
            localStorage.setItem('todos', JSON.stringify(todos));
        }

        // Product Filter Implementation
        const products = [
            { id: 1, name: "Smartphone Pro", category: "electronics", price: 899, rating: 4.8, image: "📱" },
            { id: 2, name: "Laptop Ultra", category: "electronics", price: 1299, rating: 4.6, image: "💻" },
            { id: 3, name: "Wireless Headphones", category: "electronics", price: 199, rating: 4.4, image: "🎧" },
            { id: 4, name: "Smart Watch", category: "electronics", price: 399, rating: 4.5, image: "⌚" },
            { id: 5, name: "Designer T-Shirt", category: "clothing", price: 29, rating: 4.2, image: "👕" },
            { id: 6, name: "Jeans Premium", category: "clothing", price: 89, rating: 4.3, image: "👖" },
            { id: 7, name: "Winter Jacket", category: "clothing", price: 149, rating: 4.7, image: "🧥" },
            { id: 8, name: "Programming Guide", category: "books", price: 45, rating: 4.9, image: "📚" },
            { id: 9, name: "Design Thinking", category: "books", price: 32, rating: 4.1, image: "📖" },
            { id: 10, name: "Fiction Novel", category: "books", price: 15, rating: 4.0, image: "📗" },
            { id: 11, name: "Garden Tools Set", category: "home", price: 79, rating: 4.4, image: "🛠" },
            { id: 12, name: "Indoor Plant", category: "home", price: 25, rating: 4.6, image: "🪴" },
            { id: 13, name: "Kitchen Appliance", category: "home", price: 159, rating: 4.3, image: "🍳" }
        ];

        let filteredProducts = [...products];

        function initProductFilter() {
            renderProducts();
        }

        function filterProducts() {
            const categoryFilter = document.getElementById('category-filter').value;
            const priceFilter = document.getElementById('price-filter').value;
            const sortFilter = document.getElementById('sort-filter').value;

            // Filter by category
            filteredProducts = categoryFilter === 'all' 
                ? [...products] 
                : products.filter(product => product.category === categoryFilter);

            // Filter by price
            if (priceFilter !== 'all') {
                const [min, max] = priceFilter.split('-').map(p => p.replace('+', ''));
                filteredProducts = filteredProducts.filter(product => {
                    if (priceFilter === '100+') {
                        return product.price >= 100;
                    }
                    return product.price >= parseInt(min) && product.price <= parseInt(max);
                });
            }

            // Sort products
            switch (sortFilter) {
                case 'name':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'price-low':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) => b.rating - a.rating);
                    break;
            }

            renderProducts();
        }

        function renderProducts() {
            const productsGrid = document.getElementById('products-grid');

            if (filteredProducts.length === 0) {
                productsGrid.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 2rem; grid-column: 1 / -1;">No products match your filters.</p>';
                return;
            }

            productsGrid.innerHTML = filteredProducts.map(product => `
                <div class="product-card">
                    <div class="product-image">${product.image}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <p class="product-price">${product.price}</p>
                    <div class="product-rating">${'⭐'.repeat(Math.floor(product.rating))} ${product.rating}</div>
                    <button class="btn btn-primary" style="width: 100%;" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            `).join('');
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            alert(Added "${product.name}" to cart!);
        }

        // Contact Form Handler
        function handleSubmit(event) {
            event.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Here you would typically send the data to a server
            alert(Thank you ${name}! Your message has been sent. I'll get back to you at ${email} soon.);

            // Reset form
            event.target.reset();
        }

        // Smooth scroll behavior for better UX
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

        // Add some interactive animations
        function addInteractiveAnimations() {
            // Parallax effect for background
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                document.body.style.backgroundPosition = center ${rate}px;
            });

            // Typing effect for the main title
            function typeWriter(element, text, speed = 100) {
                let i = 0;
                element.innerHTML = '';

                function type() {
                    if (i < text.length) {
                        element.innerHTML += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    }
                }
                type();
            }

            // Apply typing effect to section titles when they become visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const title = entry.target.querySelector('.section-title');
                        if (title && !title.dataset.animated) {
                            const originalText = title.textContent;
                            typeWriter(title, originalText, 150);
                            title.dataset.animated = 'true';
                        }
                    }
                });
            });

            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });
        }

        // Initialize animations after page load
        window.addEventListener('load', addInteractiveAnimations);

        // Add particle effect (simple version)
        function createParticles() {
            const canvas = document.createElement('canvas');
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '-1';
            document.body.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];

            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 3 + 1,
                    speedX: (Math.random() - 0.5) * 0.5,
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(particle => {
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fillStyle = rgba(255, 255, 255, ${particle.opacity});
                    ctx.fill();

                    particle.x += particle.speedX;
                    particle.y += particle.speedY;

                    if (particle.x > canvas.width) particle.x = 0;
                    if (particle.x < 0) particle.x = canvas.width;
                    if (particle.y > canvas.height) particle.y = 0;
                    if (particle.y < 0) particle.y = canvas.height;
                });

                requestAnimationFrame(animateParticles);
            }

            animateParticles();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // Initialize particles
        createParticles();
