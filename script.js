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

    // 6. Display Posts on Community Page
    if (window.location.pathname.includes('community.html')) {
        const postList = document.querySelector('.board-table tbody');
        const categoryFilter = document.getElementById('category-filter');
        const searchKeywordInput = document.getElementById('search-keyword');
        const searchTypeSelect = document.getElementById('search-type');
        const searchButton = document.getElementById('search-button');

        let allPosts = JSON.parse(localStorage.getItem('posts')) || [];

        // Function to render posts in the table
        function renderPostsTable(postsToDisplay) {
            if (postList) {
                postList.innerHTML = ''; // Clear static content

                if (postsToDisplay.length > 0) {
                    postsToDisplay.forEach(post => {
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
                            게시글이 없습니다.
                        </td>
                    `;
                    postList.appendChild(noPostsRow);
                }
            }
        }

        // Function to filter and display posts
        function filterAndDisplayPosts() {
            const currentCategory = categoryFilter ? categoryFilter.value : 'all';
            const keyword = searchKeywordInput.value.toLowerCase();
            const searchType = searchTypeSelect.value;

            let filteredPosts = allPosts;

            // Filter by category
            if (currentCategory !== 'all') {
                filteredPosts = filteredPosts.filter(post => post.category === currentCategory);
            }

            // Filter by search keyword
            if (keyword) {
                filteredPosts = filteredPosts.filter(post => {
                    if (searchType === 'title') {
                        return post.title.toLowerCase().includes(keyword);
                    } else if (searchType === 'title_content') {
                        return post.title.toLowerCase().includes(keyword) || post.content.toLowerCase().includes(keyword);
                    } else if (searchType === 'author') {
                        return post.author.toLowerCase().includes(keyword);
                    }
                    return false;
                });
            }

            renderPostsTable(filteredPosts);
        }

        // Initial display of posts
        filterAndDisplayPosts();

        // Event listener for category filter change
        if (categoryFilter) {
            categoryFilter.addEventListener('change', filterAndDisplayPosts);
        }

        // Event listener for search button click
        if (searchButton) {
            searchButton.addEventListener('click', filterAndDisplayPosts);
        }

        // Optional: Search on Enter key press in keyword input
        if (searchKeywordInput) {
            searchKeywordInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    filterAndDisplayPosts();
                }
            });
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
                            commentDiv.setAttribute('data-comment-id', comment.id);
                            commentDiv.innerHTML = `
                                <div class="comment-avatar"></div>
                                <div class="comment-body">
                                    <div class="comment-meta-actions">
                                        <div class="comment-info">
                                            <span class="comment-author">${comment.author}</span>
                                            <span class="comment-date">${comment.createdAt}</span>
                                        </div>
                                        <div class="comment-actions">
                                            <button class="btn-link edit-comment-btn" data-id="${comment.id}">수정</button>
                                            <button class="btn-link delete-comment-btn" data-id="${comment.id}">삭제</button>
                                            <button class="btn-link reply-comment-btn" data-id="${comment.id}">답글</button>
                                        </div>
                                    </div>
                                    <p class="comment-text">${comment.text}</p>
                                </div>
                            `;
                            commentsList.appendChild(commentDiv);

                            // Add reply form placeholder
                            const replyFormContainer = document.createElement('div');
                            replyFormContainer.classList.add('reply-form-container');
                            replyFormContainer.setAttribute('data-parent-id', comment.id);
                            commentsList.appendChild(replyFormContainer);

                            // Display replies if any
                            if (comment.replies && comment.replies.length > 0) {
                                const repliesContainer = document.createElement('div');
                                repliesContainer.classList.add('replies-container');
                                comment.replies.forEach(reply => {
                                    const replyDiv = document.createElement('div');
                                    replyDiv.classList.add('comment', 'reply');
                                    replyDiv.setAttribute('data-comment-id', reply.id);
                                    replyDiv.innerHTML = `
                                        <div class="comment-avatar"></div>
                                        <div class="comment-body">
                                            <div class="comment-meta-actions">
                                                <div class="comment-info">
                                                    <span class="comment-author">${reply.author}</span>
                                                    <span class="comment-date">${reply.createdAt}</span>
                                                </div>
                                                <div class="comment-actions">
                                                    <button class="btn-link edit-comment-btn" data-id="${reply.id}">수정</button>
                                                    <button class="btn-link delete-comment-btn" data-id="${reply.id}">삭제</button>
                                                </div>
                                            </div>
                                            <p class="comment-text">${reply.text}</p>
                                        </div>
                                    `;
                                    repliesContainer.appendChild(replyDiv);
                                });
                                commentsList.appendChild(repliesContainer);
                            }
                        });

                        // Add event listeners for edit/delete/reply buttons after comments are rendered
                        addCommentActionListeners();

                    } else {
                        commentsList.innerHTML = '<p style="text-align: center; color: var(--light-gray);">아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>';
                    }
                }
            }

            // Function to add event listeners for comment actions
            function addCommentActionListeners() {
                // Delete comment
                document.querySelectorAll('.delete-comment-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const commentIdToDelete = Number(this.dataset.id);
                        if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
                            // Find and remove comment/reply
                            let commentDeleted = false;
                            post.comments = post.comments.filter(comment => {
                                if (comment.id === commentIdToDelete) {
                                    commentDeleted = true;
                                    return false; // Remove top-level comment
                                } else if (comment.replies) {
                                    const initialReplyCount = comment.replies.length;
                                    comment.replies = comment.replies.filter(reply => reply.id !== commentIdToDelete);
                                    if (comment.replies.length < initialReplyCount) {
                                        commentDeleted = true;
                                    }
                                }
                                return true;
                            });

                            if (commentDeleted) {
                                localStorage.setItem('posts', JSON.stringify(posts));
                                displayComments(); // Re-render comments
                                postContainer.querySelector('.comments-count').innerHTML = `<i class="far fa-comment"></i> ${post.comments.length}`;
                                alert('댓글이 삭제되었습니다.');
                            }
                        }
                    });
                });

                // Edit comment
                document.querySelectorAll('.edit-comment-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const commentIdToEdit = Number(this.dataset.id);
                        const commentDiv = this.closest('.comment');
                        const commentTextP = commentDiv.querySelector('.comment-text');
                        const originalText = commentTextP.textContent;

                        // Replace text with textarea
                        commentTextP.innerHTML = `<textarea class="edit-comment-textarea">${originalText}</textarea>`;

                        // Change buttons to Save/Cancel
                        const actionsDiv = this.closest('.comment-actions');
                        actionsDiv.innerHTML = `
                            <button class="btn-link save-comment-btn" data-id="${commentIdToEdit}">저장</button>
                            <button class="btn-link cancel-edit-btn" data-id="${commentIdToEdit}">취소</button>
                        `;

                        // Save comment
                        actionsDiv.querySelector('.save-comment-btn').addEventListener('click', function() {
                            const newText = commentDiv.querySelector('.edit-comment-textarea').value.trim();
                            if (!newText) {
                                alert('댓글 내용을 입력해주세요.');
                                return;
                            }

                            let commentUpdated = false;
                            post.comments.forEach(comment => {
                                if (comment.id === commentIdToEdit) {
                                    comment.text = newText;
                                    commentUpdated = true;
                                } else if (comment.replies) {
                                    comment.replies.forEach(reply => {
                                        if (reply.id === commentIdToEdit) {
                                            reply.text = newText;
                                            commentUpdated = true;
                                        }
                                    });
                                }
                            });

                            if (commentUpdated) {
                                localStorage.setItem('posts', JSON.stringify(posts));
                                displayComments(); // Re-render comments
                                alert('댓글이 수정되었습니다.');
                            }
                        });

                        // Cancel edit
                        actionsDiv.querySelector('.cancel-edit-btn').addEventListener('click', function() {
                            displayComments(); // Re-render comments to revert changes
                        });
                    });
                });

                // Reply to comment
                document.querySelectorAll('.reply-comment-btn').forEach(button => {
                    button.addEventListener('click', function() {
                        const parentCommentId = Number(this.dataset.id);
                        const replyFormContainer = document.querySelector(`.reply-form-container[data-parent-id="${parentCommentId}"]`);

                        if (replyFormContainer.innerHTML === '') { // Only show if not already visible
                            replyFormContainer.innerHTML = `
                                <form class="reply-form">
                                    <textarea class="form-control" placeholder="답글을 입력하세요..."></textarea>
                                    <div class="form-actions">
                                        <button type="submit" class="btn btn-primary">답글 등록</button>
                                        <button type="button" class="btn btn-outline cancel-reply-btn">취소</button>
                                    </div>
                                </form>
                            `;

                            // Handle reply submission
                            replyFormContainer.querySelector('.reply-form').addEventListener('submit', function(e) {
                                e.preventDefault();
                                const replyTextarea = this.querySelector('textarea');
                                const replyText = replyTextarea.value.trim();

                                if (!replyText) {
                                    alert('답글 내용을 입력해주세요.');
                                    return;
                                }

                                const newReply = {
                                    id: Date.now(),
                                    author: '익명',
                                    createdAt: new Date().toLocaleDateString('ko-KR'),
                                    text: replyText
                                };

                                // Find the parent comment and add the reply
                                post.comments.forEach(comment => {
                                    if (comment.id === parentCommentId) {
                                        if (!comment.replies) {
                                            comment.replies = [];
                                        }
                                        comment.replies.push(newReply);
                                    }
                                });

                                localStorage.setItem('posts', JSON.stringify(posts));
                                displayComments(); // Re-render comments to show new reply
                            });

                            // Handle cancel reply
                            replyFormContainer.querySelector('.cancel-reply-btn').addEventListener('click', function() {
                                replyFormContainer.innerHTML = ''; // Clear the reply form
                            });
                        }
                    });
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

            // Delete post functionality
            const deletePostBtn = document.getElementById('deletePostBtn');
            if (deletePostBtn) {
                deletePostBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
                        posts = posts.filter(p => p.id !== postId);
                        localStorage.setItem('posts', JSON.stringify(posts));
                        alert('게시글이 삭제되었습니다.');
                        window.location.href = 'community.html';
                    }
                });
            }

            // Edit post functionality
            const editPostBtn = document.getElementById('editPostBtn');
            if (editPostBtn) {
                editPostBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = `edit_post.html?id=${postId}`;
                });
            }

        // Handle new comment submission
            const commentForm = document.querySelector('.comments-section .comment-form');
            if (commentForm) {
                commentForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const commentTextarea = document.getElementById('comment-textarea');
                    const commentText = commentTextarea.value.trim();

                    if (!commentText) {
                        alert('댓글 내용을 입력해주세요.');
                        return;
                    }

                    const newComment = {
                        id: Date.now(), // Unique ID for the comment
                        author: '익명', // Placeholder for author
                        createdAt: new Date().toLocaleDateString('ko-KR'),
                        text: commentText,
                        replies: [] // Initialize with empty replies array
                    };

                    post.comments.unshift(newComment); // Add new comment to the beginning
                    localStorage.setItem('posts', JSON.stringify(posts));
                    commentTextarea.value = ''; // Clear the textarea
                    displayComments(); // Re-render comments
                    postContainer.querySelector('.comments-count').innerHTML = `<i class="far fa-comment"></i> ${post.comments.length}`;
                });
            }

            // Initial display of comments
            displayComments();

        } else if (postContainer) {
            postContainer.innerHTML = '<h1 style="text-align: center; padding: 50px 0;">게시글을 찾을 수 없습니다.</h1>';
        }
    }
});
