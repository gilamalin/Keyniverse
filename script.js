document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('mainHeader');
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.querySelector('nav');
    const copyright = document.getElementById('copyright-text');
    const backToTopButton = document.querySelector('.back-to-top');

    // 1. Header shrink on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        });
    }

    // Handle menu closing on resize from mobile to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // 2. Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.addEventListener('click', () => {
            const isExpanded = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && !mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 3. Highlight active navigation link
    const navLinks = document.querySelectorAll('nav a');
    const currentPage = window.location.pathname.split('/').pop();
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 4. Back to top button
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 200) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 5. Handle Post Submission
    if (window.location.pathname.includes('write_post.html')) {
        // Initialize Quill editor
        var quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '내용을 입력하세요',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],

                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],

                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'script': 'sub'}, { 'script': 'super' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'direction': 'rtl' }],

                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],

                    ['clean']
                ]
            }
        });

        const postForm = document.querySelector('.write-post-container form');
        if (postForm) {
            postForm.addEventListener('submit', function(e) {
                e.preventDefault();

                const titleInput = document.getElementById('post-title');
                const contentInput = document.querySelector('#post-content-hidden');
                const categorySelect = document.getElementById('post-category');

                // Get content from Quill editor and assign to hidden input
                contentInput.value = quill.root.innerHTML;

                const title = titleInput.value;
                const content = contentInput.value;
                const category = categorySelect ? categorySelect.value : '자유 게시판'; // Default to '자유 게시판' if not found

                if (!title.trim() || !content.trim() || !category) {
                    alert('제목, 내용, 게시판을 모두 입력해주세요.');
                    return;
                }

                const posts = JSON.parse(localStorage.getItem('posts')) || [];

                const newPost = {
                    id: Date.now(), // Unique ID
                    title: title,
                    content: content,
                    author: '익명', // Placeholder
                    createdAt: new Date().toLocaleDateString('ko-KR'),
                    views: 0,
                    likes: 0,
                    category: category,
                    comments: []
                };

                posts.unshift(newPost); // Add to the beginning of the array
                localStorage.setItem('posts', JSON.stringify(posts));

                alert('게시글이 성공적으로 등록되었습니다.');
                window.location.href = 'community.html';
            });
        }
    }

    // 6. Display Posts on Community Page
    if (window.location.pathname.includes('community.html')) {
        const postList = document.querySelector('.board-table tbody');
        const categoryFilter = document.getElementById('category-filter');
        let posts = JSON.parse(localStorage.getItem('posts')) || [];

        // Get category from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const currentCategory = urlParams.get('category') || 'all';

        // Set filter dropdown value
        if (categoryFilter) {
            categoryFilter.value = currentCategory;

            categoryFilter.addEventListener('change', function() {
                const selectedCategory = this.value;
                if (selectedCategory === 'all') {
                    window.location.href = 'community.html';
                } else {
                    window.location.href = `community.html?category=${selectedCategory}`;
                }
            });
        }

        if (postList) {
            postList.innerHTML = ''; // Clear static content

            let filteredPosts = posts;
            if (currentCategory !== 'all') {
                filteredPosts = posts.filter(post => post.category === currentCategory);
            }

            if (filteredPosts.length > 0) {
                filteredPosts.forEach(post => {
                    const postRow = document.createElement('tr');
                    postRow.innerHTML = `
                        <td class="post-left-group">
                            <span data-label="카테고리" class="post-category-cell">${post.category}</span>
                            <span data-label="제목" class="post-title-cell">${post.title}</span>
                        </td>
                        <td class="post-right-group">
                            <span data-label="작성자" class="post-author-cell">${post.author}</span>
                            <span data-label="작성일" class="post-date-cell">${post.createdAt}</span>
                            <span data-label="조회수" class="post-views-cell"><i class="far fa-eye"></i> ${post.views}</span>
                            <span data-label="추천수" class="post-likes-cell"><i class="far fa-thumbs-up"></i> ${post.likes}</span>
                        </td>
                    `;
                    postRow.style.cursor = 'pointer'; // Add cursor style to indicate clickability
                    postRow.addEventListener('click', () => {
                        window.location.href = `post_detail.html?id=${post.id}`;
                    });
                    postList.appendChild(postRow);
                });
            } else {
                const noPostsRow = document.createElement('tr');
                noPostsRow.innerHTML = `
                    <td colspan="6" style="text-align: center; padding: 50px 0;">
                        ${currentCategory === 'all' ? '게시글이 없습니다. 첫 번째 글을 작성해보세요!' : `'${currentCategory}' 게시판에 게시글이 없습니다.`}
                    </td>
                `;
                postList.appendChild(noPostsRow);
            }
        }
    }

    // 7. Display Post Detail
    if (window.location.pathname.includes('post_detail.html')) {
        const params = new URLSearchParams(window.location.search);
        const postId = Number(params.get('id'));
        let posts = JSON.parse(localStorage.getItem('posts')) || [];
        let post = posts.find(p => p.id === postId);

        const postContainer = document.querySelector('.post-container');

        if (post && postContainer) {
            // Increment view count only once per session
            let viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts')) || [];
            if (!viewedPosts.includes(postId)) {
                post.views++;
                localStorage.setItem('posts', JSON.stringify(posts));
                viewedPosts.push(postId);
                sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
            }

            document.title = `${post.title} - Keyniverse`;
            postContainer.querySelector('.post-title').textContent = post.title;
            postContainer.querySelector('.author-name').textContent = post.author;
            postContainer.querySelector('.post-date').textContent = post.createdAt;
            postContainer.querySelector('.views-count').innerHTML = `<i class="far fa-eye"></i> ${post.views}`;
            postContainer.querySelector('.likes-count').innerHTML = `<i class="far fa-thumbs-up"></i> ${post.likes}`;
            postContainer.querySelector('.comments-count').innerHTML = `<i class="far fa-comment"></i> ${post.comments.length}`;
            postContainer.querySelector('.post-content').innerHTML = post.content;

            // Function to display comments
            function displayComments() {
                const commentsList = document.getElementById('comments-list');
                const commentCountSpan = document.getElementById('comment-count');
                if (commentsList) {
                    commentsList.innerHTML = ''; // Clear existing comments
                    commentCountSpan.textContent = post.comments.length;

                    if (post.comments.length > 0) {
                        post.comments.forEach(comment => {
                            const commentDiv = document.createElement('div');
                            commentDiv.classList.add('comment');
                            commentDiv.innerHTML = `
                                <div class="comment-avatar"></div>
                                <div class="comment-body">
                                    <span class="comment-author">${comment.author}</span>
                                    <span class="comment-date">${comment.createdAt}</span>
                                    <p class="comment-text">${comment.text}</p>
                                </div>
                            `;
                            commentsList.appendChild(commentDiv);
                        });
                    } else {
                        commentsList.innerHTML = '<p style="text-align: center; color: var(--light-gray);">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>';
                    }
                }
            }

            displayComments(); // Initial display of comments

            // Handle comment submission
            const commentForm = document.querySelector('.comment-form');
            if (commentForm) {
                commentForm.addEventListener('submit', function(e) {
                    e.preventDefault();

                    const commentTextarea = commentForm.querySelector('textarea');
                    const commentText = commentTextarea.value.trim();

                    if (!commentText) {
                        alert('댓글 내용을 입력해주세요.');
                        return;
                    }

                    const newComment = {
                        author: '익명', // Placeholder
                        createdAt: new Date().toLocaleDateString('ko-KR'),
                        text: commentText
                    };

                    post.comments.push(newComment);
                    localStorage.setItem('posts', JSON.stringify(posts));

                    commentTextarea.value = ''; // Clear textarea
                    displayComments(); // Refresh comments list
                    postContainer.querySelector('.comments-count').innerHTML = `<i class="far fa-comment"></i> ${post.comments.length}`;
                });
            }

            // Like button functionality
            const likeButton = postContainer.querySelector('.action-btn[href="#"]'); // Assuming it's the first action button
            if(likeButton && likeButton.textContent.includes('추천')) {
                likeButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    post.likes++;
                    localStorage.setItem('posts', JSON.stringify(posts));
                    postContainer.querySelector('.likes-count').innerHTML = `<i class="far fa-thumbs-up"></i> ${post.likes}`;
                    // Optional: disable button after clicking
                    // likeButton.style.pointerEvents = 'none';
                    // likeButton.style.opacity = '0.6';
                });
            }

        } else if (postContainer) {
            postContainer.innerHTML = '<h1 style="text-align: center; padding: 50px 0;">게시글을 찾을 수 없습니다.</h1>';
        }
    }
});
