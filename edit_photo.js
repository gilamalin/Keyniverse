document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('photo-file');
    const previewContainer = document.getElementById('image-preview-container');
    const selectedFilesDisplay = document.getElementById('selected-files-display');
    const uploadForm = document.getElementById('uploadForm');
    const addTagBtn = document.getElementById('add-tag-btn');
    const dynamicTagsContainer = document.getElementById('dynamic-tags-container');
    const photoTitleInput = document.getElementById('photo-title');
    const photoDescriptionTextarea = document.getElementById('photo-description');
    const cancelBtn = document.getElementById('cancelBtn');

    let uploadedImages = []; // To store Base64 encoded images
    let editingPostId = null; // To store the ID of the post being edited

    // Check if in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('수정할 게시물 ID가 필요합니다.');
        window.location.href = 'gallery.html'; // 갤러리 페이지로 리다이렉트
        return;
    }

    editingPostId = parseInt(postId); // postId를 숫자형으로 변환

    document.querySelector('button[type="submit"]').textContent = '수정 완료';

    let galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

    const postToEdit = galleryItems.find(item => {
        return item.id === editingPostId;
    });

    if (!postToEdit) {
        alert('수정할 게시물을 찾을 수 없습니다.');
        window.location.href = 'gallery.html';
        return;
    }

    photoTitleInput.value = postToEdit.title;
    photoDescriptionTextarea.value = postToEdit.description;
    uploadedImages = postToEdit.images || [];

    // Display existing images
    previewContainer.innerHTML = '';
    if (uploadedImages.length > 0) {
        uploadedImages.forEach(imgSrc => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.classList.add('img-preview');
            previewContainer.appendChild(img);
        });
        // Display file names for existing images (if available, otherwise a placeholder)
        selectedFilesDisplay.textContent = `기존 이미지 ${uploadedImages.length}개`;
    } else {
        previewContainer.innerHTML = '<p style="color: var(--light-gray);">이미지 미리보기</p>';
        selectedFilesDisplay.textContent = '선택된 파일 없음';
    }

    // Populate existing tags
    for (const tagName in postToEdit.tags) {
        if (postToEdit.tags.hasOwnProperty(tagName)) {
            // Add as dynamic tag
            const newTagGroup = document.createElement('div');
            newTagGroup.classList.add('dynamic-tag-group', 'input-group');

            const tagNameInput = document.createElement('input');
            tagNameInput.type = 'text';
            tagNameInput.classList.add('form-control');
            tagNameInput.value = tagName;
            
            const tagValueInput = document.createElement('input');
            tagValueInput.type = 'text';
            tagValueInput.classList.add('form-control');
            tagValueInput.value = postToEdit.tags[tagName];

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
        }
    }

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

        // Update existing post
        const postIndex = galleryItems.findIndex(item => item.id === editingPostId);
        if (postIndex !== -1) {
            galleryItems[postIndex].title = title;
            galleryItems[postIndex].description = description;
            galleryItems[postIndex].images = uploadedImages;
            galleryItems[postIndex].tags = tags;
            // Keep original author, date, likes, comments
        } else {
            alert('수정할 게시물을 찾을 수 없습니다. (ID 불일치)'); // 추가적인 디버깅 알림
        }
        alert('게시물이 성공적으로 수정되었습니다!');

        // Save updated gallery items back to localStorage
        localStorage.setItem('galleryItems', JSON.stringify(galleryItems));

        window.location.href = `gallery_detail.html?id=${editingPostId}`; // Redirect to gallery detail page
    });

    // Handle cancel button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            history.back();
        });
    }
});