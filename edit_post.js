document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    var quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                [{ 'direction': 'rtl' }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['link', 'image', 'video'],
                ['clean']
            ]
        }
    });

    const postCategorySelect = document.getElementById('post-category');
    const postTitleInput = document.getElementById('post-title');
    const postContentHiddenInput = document.getElementById('post-content-hidden');
    const form = document.querySelector('form');
    const cancelBtn = document.getElementById('cancelBtn');

    let editingPostId = null;

    // Check if in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('수정할 게시물 ID가 필요합니다.');
        window.location.href = 'community.html'; // Redirect to community page
        return;
    }

    editingPostId = parseInt(postId);

    let communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];

    const postToEdit = communityPosts.find(post => post.id === editingPostId);

    if (!postToEdit) {
        alert('수정할 게시물을 찾을 수 없습니다.');
        window.location.href = 'community.html';
        return;
    }

    // Populate form fields
    postCategorySelect.value = postToEdit.category;
    postTitleInput.value = postToEdit.title;
    quill.setContents(JSON.parse(postToEdit.content)); // Assuming content is stored as Quill Delta JSON

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const category = postCategorySelect.value;
        const title = postTitleInput.value;
        const content = JSON.stringify(quill.getContents()); // Get Quill Delta JSON

        if (!category || !title || quill.getText().trim() === '') {
            alert('모든 필드를 채워주세요.');
            return;
        }

        const postIndex = communityPosts.findIndex(post => post.id === editingPostId);
        if (postIndex !== -1) {
            communityPosts[postIndex].category = category;
            communityPosts[postIndex].title = title;
            communityPosts[postIndex].content = content;
            // Keep original author, date, views, comments
        } else {
            alert('수정할 게시물을 찾을 수 없습니다. (ID 불일치)');
        }

        localStorage.setItem('communityPosts', JSON.stringify(communityPosts));
        alert('게시물이 성공적으로 수정되었습니다!');
        window.location.href = `post_detail.html?id=${editingPostId}`; // Redirect to post detail page
    });

    // Handle cancel button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            history.back();
        });
    }
});