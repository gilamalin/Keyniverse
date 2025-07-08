document.addEventListener('DOMContentLoaded', () => {
    

    // Function to load and display latest community forum activity
    function loadCommunityActivity() {
        const forumListContainer = document.querySelector('#home-forum-list');
        const communityPosts = JSON.parse(localStorage.getItem('communityPosts')) || [];

        // Group posts by category and count posts for each
        const postCountsByCategory = {};
        communityPosts.forEach(post => {
            postCountsByCategory[post.category] = (postCountsByCategory[post.category] || 0) + 1;
        });

        // Group posts by category and get the latest for each
        const latestPostsByCategory = {};
        communityPosts.forEach(post => {
            if (!latestPostsByCategory[post.category] || new Date(post.date) > new Date(latestPostsByCategory[post.category].date)) {
                latestPostsByCategory[post.category] = post;
            }
        });

        forumListContainer.innerHTML = '';
        const categories = ['자유 게시판', '질문과 답변', '타건음 자랑', '키캡/스위치']; // Define order

        categories.forEach(category => {
            const post = latestPostsByCategory[category];
            const postCount = postCountsByCategory[category] || 0;
            const forumItem = document.createElement('div');
            forumItem.classList.add('forum-item');
            forumItem.innerHTML = `
                <div class="forum-header">
                    <div class="forum-name"><a href="community.html?category=${category}">${category}</a></div>
                    <div class="forum-stats">
                        <div class="stat-item">
                            <div class="stat-count">${postCount}</div>
                            <div class="stat-label">게시글</div>
                        </div>
                    </div>
                </div>
                <div class="forum-desc">${category}에 관한 이야기</div>
                <div class="forum-latest"><i class="fas fa-clock"></i> ${post ? `${post.date}: ${post.title.substring(0, 30)}...` : '최신 게시글 없음'}</div>
            `;
            forumListContainer.appendChild(forumItem);
        });
    }

    // Function to load and display latest gallery items
    function loadGalleryPreview() {
        const galleryPreviewContainer = document.querySelector('#gallery-preview-grid');
        const galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

        // Display top 3 latest gallery items
        galleryPreviewContainer.innerHTML = '';
        [...galleryItems].slice(0, 3).forEach(item => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${item.images[0] || 'images/placeholder.png'}'); background-size: cover; background-position: center;">
                </div>
                <div class="card-content">
                    <h3><a href="gallery_detail.html?id=${item.id}">${item.title}</a></h3>
                    <p>${item.description.substring(0, 50)}...</p>
                    <div class="card-meta">
                        <div><i class="fas fa-heart" style="color: #ff6b6b;"></i> ${item.likes || 0}</div>
                        <div><i class="far fa-comment"></i> ${item.comments || 0}</div>
                    </div>
                </div>
            `;
            galleryPreviewContainer.appendChild(card);
        });
    }

    

    // Initial load of content
    // loadPopularPosts(); // Removed for redesign
    loadCommunityActivity();
    loadGalleryPreview();
});
