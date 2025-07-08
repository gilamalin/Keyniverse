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

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const category = postCategorySelect.value;
        const title = postTitleInput.value;
        const content = JSON.stringify(quill.getContents()); // Get Quill Delta JSON

        if (!category || !title || quill.getText().trim() === '') {
            alert('모든 필드를 채워주세요.');
            return;
        }

        let communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];

        const newPost = {
            id: Date.now(), // Unique ID
            category: category,
            title: title,
            content: content,
            author: '현재 사용자', // Placeholder
            date: new Date().toLocaleDateString('ko-KR'),
            views: 0,
            likes: 0,
            comments: 0,
            commentsData: [] // Initialize comments for new posts
        };

        communityPosts.unshift(newPost); // Add new post to the beginning
        localStorage.setItem('communityPosts', JSON.stringify(communityPosts));

        alert('게시물이 성공적으로 작성되었습니다!');
        window.location.href = 'community.html'; // Redirect to community page
    });

    // Handle cancel button click
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            history.back();
        });
    }
});