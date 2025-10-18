        document.addEventListener('DOMContentLoaded', function() {
            const logoutBtn = document.getElementById('logoutBtn');
            const homeBtn = document.getElementById('homeBtn');
            const usernameElement = document.getElementById('username');
            
            // Add click effects to buttons
            [logoutBtn, homeBtn].forEach(button => {
                button.addEventListener('click', function() {
                    // Ripple effect
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = event.clientX - rect.left - size/2;
                    const y = event.clientY - rect.top - size/2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.classList.add('ripple');
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                    
                    // Button actions
                    if (this === logoutBtn) {
                        setTimeout(() => {
                            alert('You have been logged out successfully!');
                            // In a real app, you would redirect to login page
                        }, 300);
                    } else if (this === homeBtn) {
                        setTimeout(() => {
                            alert('Redirecting to home page...');
                            // In a real app, you would redirect to home page
                        }, 300);
                    }
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
        });