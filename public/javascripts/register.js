        document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('registerForm');
            const inputs = document.querySelectorAll('input');
            
            // Add focus effects to inputs
            inputs.forEach(input => {
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (this.value === '') {
                        this.parentElement.classList.remove('focused');
                    }
                });
            });
            
            // Form submission
            form.addEventListener('submit', function(e) {
                
                // Get form values
                const username = document.getElementById('username').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                // Simple validation
                if (username && email && password) {
                    // In a real application, you would send this data to a server
                    console.log('Registration data:', { username, email, password });
                    
                }
            });
            
            // Add floating animation to shapes
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => {
                shape.style.animationDuration = (Math.random() * 20 + 10) + 's';
            });
        });