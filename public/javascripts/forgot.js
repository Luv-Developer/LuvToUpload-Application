        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('forgotForm');
            const emailInput = document.getElementById('email');
            const successMessage = document.getElementById('successMessage');
            const envelopeIcon = document.querySelector('.fa-paper-plane');
            
            // Add focus effects to input
            emailInput.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            emailInput.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Form submission
            form.addEventListener('submit', function(e) {
                // Get form value
                const email = emailInput.value;
                
                // Simple validation
                if (email) {
                    // In a real application, you would send this data to a server
                    console.log('Password reset requested for:', email);
                    
                    // Show success message with animation
                    successMessage.style.display = 'block';
                    envelopeIcon.style.animation = 'envelopeFly 1s ease-out';
                    
                    
                    // Hide success message after 5 seconds
                    setTimeout(function() {
                        successMessage.style.display = 'none';
                    }, 5000);
                }
            });
            
            // Add floating animation to shapes
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => {
                shape.style.animationDuration = (Math.random() * 20 + 10) + 's';
            });
        });