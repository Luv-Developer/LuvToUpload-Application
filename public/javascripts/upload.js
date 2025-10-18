        document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const uploadBox = document.getElementById('uploadBox');
            const browseBtn = document.getElementById('browseBtn');
            const fileInput = document.getElementById('fileInput');
            const fileInfo = document.getElementById('fileInfo');
            const fileName = document.getElementById('fileName');
            const fileSize = document.getElementById('fileSize');
            const uploadProgress = document.getElementById('uploadProgress');
            const progressText = document.getElementById('progressText');
            const uploadBtn = document.getElementById('uploadBtn');
            const successMessage = document.getElementById('successMessage');
            const newUploadBtn = document.getElementById('newUploadBtn');
            const privacyOptions = document.querySelectorAll('.privacy-option');
            
            // Navigation buttons
            const homeBtn = document.getElementById('homeBtn');
            const profileBtn = document.getElementById('profileBtn');
            const logoutBtn = document.getElementById('logoutBtn');
            
            // Add ripple effect to all buttons
            const allButtons = document.querySelectorAll('.nav-btn, .browse-btn, .upload-btn');
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
            
            
            // Browse button click
            browseBtn.addEventListener('click', function() {
                fileInput.click();
            });
            
            // File input change
            fileInput.addEventListener('change', function() {
                if (this.files.length > 0) {
                    handleFileSelection(this.files[0]);
                }
            });
            
            // Drag and drop functionality
            uploadBox.addEventListener('dragover', function(e) {
                this.classList.add('drag-over');
            });
            
            uploadBox.addEventListener('dragleave', function() {
                this.classList.remove('drag-over');
            });
            
            uploadBox.addEventListener('drop', function(e) {
                this.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    handleFileSelection(e.dataTransfer.files[0]);
                }
            });
            
            // Handle file selection
            function handleFileSelection(file) {
                // Check file size (max 100MB)
                const maxSize = 100 * 1024 * 1024; // 100MB in bytes
                if (file.size > maxSize) {
                    alert('File size exceeds the maximum limit of 100MB');
                    return;
                }
                
                // Update file info
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                
                // Show file info and upload button
                fileInfo.classList.add('show');
                uploadBtn.classList.add('show');
                
                // Reset progress
                uploadProgress.style.width = '0%';
                progressText.textContent = '0% uploaded';
            }
            
            // Format file size
            function formatFileSize(bytes) {
                if (bytes === 0) return '0 Bytes';
                
                const k = 1024;
                const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                const i = Math.floor(Math.log(bytes) / Math.log(k));
                
                return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
            }
            
            // Privacy options
            privacyOptions.forEach(option => {
                option.addEventListener('click', function() {
                    privacyOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                });
            });
            
            // Upload button click
            uploadBtn.addEventListener('click', function() {
                // Validate form
                const title = document.getElementById('title').value;
                if (!title) {
                    alert('Please enter a title for your file');
                    return;
                }
                
                const category = document.getElementById('category').value;
                if (!category) {
                    alert('Please select a category');
                    return;
                }
                
                // Simulate upload progress
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 10;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        
                        // Show success message after a short delay
                        setTimeout(() => {
                            successMessage.classList.add('show');
                        }, 500);
                    }
                    
                    uploadProgress.style.width = progress + '%';
                    progressText.textContent = Math.round(progress) + '% uploaded';
                }, 200);
            });
            
            // New upload button
            newUploadBtn.addEventListener('click', function() {
                // Reset form
                fileInput.value = '';
                fileInfo.classList.remove('show');
                uploadBtn.classList.remove('show');
                successMessage.classList.remove('show');
                document.getElementById('title').value = '';
                document.getElementById('description').value = '';
                document.getElementById('category').value = '';
                
                // Reset privacy to public
                privacyOptions.forEach(opt => opt.classList.remove('selected'));
                document.querySelector('[data-privacy="public"]').classList.add('selected');
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