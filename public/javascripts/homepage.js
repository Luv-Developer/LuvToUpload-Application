        document.addEventListener('DOMContentLoaded', function() {
            // Get all buttons
            const registerBtn = document.getElementById('registerBtn');
            const loginBtn = document.getElementById('loginBtn');
            const profileBtn = document.getElementById('profileBtn');
            const uploadBtn = document.getElementById('uploadBtn');
            const heroRegisterBtn = document.getElementById('heroRegisterBtn');
            const heroLoginBtn = document.getElementById('heroLoginBtn');
            const ctaRegisterBtn = document.getElementById('ctaRegisterBtn');
            const ctaLoginBtn = document.getElementById('ctaLoginBtn');
            
            // Add ripple effect to all buttons
            const allButtons = document.querySelectorAll('.nav-btn');
            allButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    // Ripple effect
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size/2;
                    const y = e.clientY - rect.top - size/2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.classList.add('ripple');
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
            
            // Add floating animation to shapes
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => {
                shape.style.animationDuration = (Math.random() * 20 + 10) + 's';
            });
            
            // Add ripple effect style
            const style = document.createElement('style');
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                }
                
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
            
            // Add scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animationPlayState = 'running';
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe elements for animation on scroll
            document.querySelectorAll('.feature-card, .stat-item').forEach(el => {
                el.style.animationPlayState = 'paused';
                observer.observe(el);
            });
        });