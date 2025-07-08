document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    let galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];
    let post = galleryItems.find(item => item.id == postId);

    const commentsList = document.getElementById('comments-list');
    const commentCountSpan = document.getElementById('comment-count');
    const commentForm = document.querySelector('.comment-form');
    const commentTextarea = document.getElementById('comment-textarea');

    if (post) {
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-author').textContent = post.author;
        document.getElementById('post-date').textContent = post.date;
        document.getElementById('post-description').textContent = post.description;

        // Image Slider
        const sliderImagesContainer = document.getElementById('slider-images');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const sliderDotsContainer = document.getElementById('slider-dots');
        let currentImageIndex = 0;

        if (post.images && post.images.length > 0) {
            post.images.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                sliderImagesContainer.appendChild(img);

                const dot = document.createElement('span');
                dot.classList.add('dot');
                dot.addEventListener('click', () => showImage(index));
                sliderDotsContainer.appendChild(dot);
            });
            showImage(0);
        } else {
            // Hide slider if no images
            document.getElementById('image-slider').style.display = 'none';
        }

        function showImage(index) {
            currentImageIndex = index;
            const offset = -currentImageIndex * 100;
            sliderImagesContainer.style.transform = `translateX(${offset}%)`;

            document.querySelectorAll('.dot').forEach((dot, i) => {
                if (i === currentImageIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : post.images.length - 1;
            showImage(currentImageIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex < post.images.length - 1) ? currentImageIndex + 1 : 0;
            showImage(currentImageIndex);
        });

        // Display Tags
        const postTagsContainer = document.getElementById('post-tags');
        for (const tagName in post.tags) {
            if (post.tags.hasOwnProperty(tagName)) {
                const tagSpan = document.createElement('span');
                tagSpan.textContent = `${tagName}: ${post.tags[tagName]}`;
                postTagsContainer.appendChild(tagSpan);
            }
        }

        // Placeholder for views and likes
        document.getElementById('post-views').textContent = post.views || 0;
        document.getElementById('post-likes').textContent = post.likes || 0;

        // --- Delete Functionality ---
        const deletePostBtn = document.getElementById('deletePostBtn');
        deletePostBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('정말로 이 게시물을 삭제하시겠습니까?')) {
                let updatedGalleryItems = galleryItems.filter(item => item.id != postId);
                localStorage.setItem('galleryItems', JSON.stringify(updatedGalleryItems));
                alert('게시물이 삭제되었습니다.');
                window.location.href = 'gallery.html'; // Redirect to gallery page
            }
        });

        // Set edit button href dynamically
        const editPostBtn = document.getElementById('editPostBtn');
        console.log('editPostBtn 요소:', editPostBtn);
        console.log('post.id 값:', post.id);
        if (editPostBtn && post && post.id) {
            editPostBtn.href = `edit_photo.html?id=${post.id}`;
            console.log('수정 버튼 href 설정됨:', editPostBtn.href);
        }

        // --- Comment Functionality ---
        // Initialize comments array if it doesn't exist
        if (!post.commentsData) {
            post.commentsData = [];
        }

        function renderComments() {
            commentsList.innerHTML = ''; // Clear existing comments
            commentCountSpan.textContent = post.commentsData.length;
            document.getElementById('post-comments').textContent = post.commentsData.length;

            if (post.commentsData.length > 0) {
                post.commentsData.forEach(comment => {
                    const commentDiv = document.createElement('div');
                    commentDiv.classList.add('comment');
                    commentDiv.setAttribute('data-comment-id', comment.id);
                    commentDiv.innerHTML = `
                        <div class="comment-avatar"></div>
                        <div class="comment-body">
                            <div class="comment-meta-actions">
                                <div class="comment-info">
                                    <span class="comment-author">${comment.author}</span>
                                    <span class="comment-date">${comment.date}</span>
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
                                            <span class="comment-date">${reply.date}</span>
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
                commentsList.innerHTML = '<p style="text-align: center; color: var(--light-gray);">아직 댓글이 없습니다. 첫 댓글을 남겨주세요!</p>';
            }
        }

        // Function to add event listeners for comment actions
        function addCommentActionListeners() {
            // Delete comment
            document.querySelectorAll('.delete-comment-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const commentIdToDelete = Number(this.dataset.id);
                    if (confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
                        let commentDeleted = false;
                        post.commentsData = post.commentsData.filter(comment => {
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
                            const postIndex = galleryItems.findIndex(item => item.id == postId);
                            if (postIndex !== -1) {
                                galleryItems[postIndex] = post;
                                localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
                            }
                            renderComments(); // Re-render comments
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
                        post.commentsData.forEach(comment => {
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
                            const postIndex = galleryItems.findIndex(item => item.id == postId);
                            if (postIndex !== -1) {
                                galleryItems[postIndex] = post;
                                localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
                            }
                            renderComments(); // Re-render comments
                            alert('댓글이 수정되었습니다.');
                        }
                    });

                    // Cancel edit
                    actionsDiv.querySelector('.cancel-edit-btn').addEventListener('click', function() {
                        renderComments(); // Re-render comments to revert changes
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
                                date: new Date().toLocaleDateString('ko-KR'),
                                text: replyText
                            };

                            // Find the parent comment and add the reply
                            post.commentsData.forEach(comment => {
                                if (comment.id === parentCommentId) {
                                    if (!comment.replies) {
                                        comment.replies = [];
                                    }
                                    comment.replies.push(newReply);
                                }
                            });

                            const postIndex = galleryItems.findIndex(item => item.id == postId);
                            if (postIndex !== -1) {
                                galleryItems[postIndex] = post;
                                localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
                            }
                            renderComments(); // Re-render comments to show new reply
                        });

                        // Handle cancel reply
                        replyFormContainer.querySelector('.cancel-reply-btn').addEventListener('click', function() {
                            replyFormContainer.innerHTML = ''; // Clear the reply form
                        });
                    }
                });
            });
        }

        // Handle new comment submission
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const commentText = commentTextarea.value.trim();

            if (commentText) {
                const newComment = {
                    id: Date.now(), // Unique ID for the comment
                    author: '익명', // Placeholder for author
                    date: new Date().toLocaleDateString('ko-KR'),
                    text: commentText,
                    replies: [] // Initialize with empty replies array
                };

                post.commentsData.unshift(newComment); // Add new comment to the beginning
                const postIndex = galleryItems.findIndex(item => item.id == postId);
                if (postIndex !== -1) {
                    galleryItems[postIndex] = post;
                    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
                }
                commentTextarea.value = ''; // Clear the textarea
                renderComments(); // Re-render comments
            }
        });

        renderComments(); // Initial render of comments

    } else {
        // Handle case where post is not found
        document.querySelector('.post-container').innerHTML = '<p style="text-align: center; color: var(--light-gray);">게시물을 찾을 수 없습니다.</p>';
        document.querySelector('.comments-section').style.display = 'none';
    }
});