        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.document-card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
            
            // Upload button animation
            const uploadBtn = document.querySelector('.upload-btn');
            uploadBtn.addEventListener('click', function() {
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Upload Complete!';
                    this.style.background = 'var(--success)';
                }, 2000);
            });
        });