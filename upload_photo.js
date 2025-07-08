document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('photo-file');
    const previewContainer = document.getElementById('image-preview-container');
    const selectedFilesDisplay = document.getElementById('selected-files-display');
    const uploadForm = document.getElementById('uploadForm');
    const photoTitleInput = document.getElementById('photo-title');
    const photoDescriptionTextarea = document.getElementById('photo-description');
    const cancelBtn = document.getElementById('cancelBtn');

    const addTagBtn = document.getElementById('add-tag-btn');
    const dynamicTagsContainer = document.getElementById('dynamic-tags-container');

    let uploadedImages = []; // To store Base64 encoded images

    fileInput.addEventListener('change', function() {
        previewContainer.innerHTML = ''; // Clear previous previews
        uploadedImages = []; // Clear previous images
        if (this.files.length > 0) {
            const fileNames = Array.from(this.files).map(file => file.name);
            selectedFilesDisplay.textContent = fileNames.join(', ');
            Array.from(this.files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('img-preview');
                    previewContainer.appendChild(img);
                    uploadedImages.push(e.target.result); // Store Base64 string
                }
                reader.readAsDataURL(file);
            });
        } else {
            previewContainer.innerHTML = '<p style="color: var(--light-gray);">이미지 미리보기</p>';
            selectedFilesDisplay.textContent = '선택된 파일 없음';
        }
    });

    addTagBtn.addEventListener('click', function() {
        const newTagGroup = document.createElement('div');
        newTagGroup.classList.add('dynamic-tag-group', 'input-group');

        const tagNameInput = document.createElement('input');
        tagNameInput.type = 'text';
        tagNameInput.classList.add('form-control');
        tagNameInput.placeholder = '태그 이름 (예: 마우스)';
        
        const tagValueInput = document.createElement('input');
        tagValueInput.type = 'text';
        tagValueInput.classList.add('form-control');
        tagValueInput.placeholder = '태그 값 (예: Logitech G Pro)';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('btn', 'btn-danger', 'btn-sm');
        removeBtn.innerHTML = '<i class="fas fa-times"></i>';
        removeBtn.onclick = function() {
            newTagGroup.remove();
        }

        newTagGroup.appendChild(tagNameInput);
        newTagGroup.appendChild(tagValueInput);
        newTagGroup.appendChild(removeBtn);
        dynamicTagsContainer.appendChild(newTagGroup);
    });

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        const title = photoTitleInput.value;
        const description = photoDescriptionTextarea.value;

        // Collect dynamic tags
        const tags = {};
        document.querySelectorAll('#dynamic-tags-container .dynamic-tag-group').forEach(group => {
            const tagNameInput = group.querySelectorAll('input')[0];
            const tagValueInput = group.querySelectorAll('input')[1];
            if (tagNameInput && tagValueInput && tagNameInput.value.trim() !== '') {
                tags[tagNameInput.value.trim()] = tagValueInput.value.trim();
            }
        });

        let galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

        // Create new post
            const newGalleryItem = {
                id: Date.now(), // Unique ID for the item
                title: title,
                description: description,
                images: uploadedImages, // Array of Base64 image strings
                tags: tags,
                author: '익명', // Placeholder for current user
                date: new Date().toLocaleDateString('ko-KR'),
                likes: 0,
                comments: 0,
                commentsData: [] // Initialize comments for new posts
            };
            galleryItems.unshift(newGalleryItem); // Add new item to the beginning
            alert('게시물이 성공적으로 업로드되었습니다!');

        // Save updated gallery items back to localStorage
        localStorage.setItem('galleryItems', JSON.stringify(galleryItems));

        window.location.href = 'gallery.html'; // Redirect to gallery page
    });

    // Handle cancel button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            history.back();
        });
    }
});