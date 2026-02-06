document.addEventListener('DOMContentLoaded', () => {
    const complaintForm = document.getElementById('complaintForm');
    const formCard = document.getElementById('formCard');
    const successCard = document.getElementById('successCard');
    const resetBtn = document.getElementById('resetBtn');
    const submitBtn = document.getElementById('submitBtn');
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileAttachment');
    const fileInfo = document.getElementById('fileInfo');

    // Handle Form Submission
    complaintForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success state
            formCard.style.opacity = '0';
            formCard.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                formCard.classList.add('hidden');
                successCard.classList.remove('hidden');
                successCard.style.opacity = '0';
                successCard.style.transform = 'translateY(20px)';
                
                // Trigger reflow
                successCard.offsetHeight;
                
                successCard.style.opacity = '1';
                successCard.style.transform = 'translateY(0)';
            }, 500);
        }
    });

    // Reset Form
    resetBtn.addEventListener('click', () => {
        successCard.classList.add('hidden');
        formCard.classList.remove('hidden');
        formCard.style.opacity = '1';
        formCard.style.transform = 'translateY(0)';
        complaintForm.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        fileInfo.textContent = 'No files selected';
        
        // Remove validation error classes
        const groups = complaintForm.querySelectorAll('.input-group');
        groups.forEach(group => group.classList.remove('invalid'));
    });

    // Validation Logic
    function validateForm() {
        let isValid = true;
        const requiredFields = complaintForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const group = field.closest('.input-group');
            if (!field.value.trim()) {
                group.classList.add('invalid');
                isValid = false;
            } else if (field.type === 'email' && !validateEmail(field.value)) {
                group.classList.add('invalid');
                isValid = false;
            } else {
                group.classList.remove('invalid');
            }
        });

        return isValid;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Live Validation on Input
    complaintForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', () => {
            const group = input.closest('.input-group');
            if (input.hasAttribute('required')) {
                if (input.value.trim()) {
                    if (input.type === 'email') {
                        if (validateEmail(input.value)) {
                            group.classList.remove('invalid');
                        }
                    } else {
                        group.classList.remove('invalid');
                    }
                }
            }
        });
    });

    // Drag and Drop Logic
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('drag-over'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('drag-over'), false);
    });

    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            fileInfo.textContent = `${files.length} file(s) selected`;
            fileInfo.style.color = 'var(--primary)';
        } else {
            fileInfo.textContent = 'No files selected';
            fileInfo.style.color = 'var(--text-secondary)';
        }
    }
});
