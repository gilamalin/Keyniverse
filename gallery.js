document.addEventListener('DOMContentLoaded', function() {
    const galleryContainer = document.querySelector('.gallery-container');
    const searchButton = document.getElementById('search-button');
    const searchKeywordInput = document.getElementById('search-keyword');
    const searchTypeSelect = document.getElementById('search-type');
    let galleryItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

    // Function to render gallery items
    function renderGalleryItems(itemsToRender) {
        galleryContainer.innerHTML = ''; // Clear existing items
        itemsToRender.forEach(item => {
            const galleryItemDiv = document.createElement('a');
            galleryItemDiv.href = `gallery_detail.html?id=${item.id}`; // Link to detail page
            galleryItemDiv.classList.add('gallery-item');

            // Use the first image for the thumbnail
            const img = document.createElement('img');
            img.src = item.images[0] || 'images/placeholder.png'; // Fallback placeholder
            img.alt = item.title;
            img.loading = 'lazy';
            galleryItemDiv.appendChild(img);

            const contentDiv = document.createElement('div');
            contentDiv.classList.add('gallery-item-content');

            const titleH3 = document.createElement('h3');
            titleH3.textContent = item.title;
            contentDiv.appendChild(titleH3);

            const authorP = document.createElement('p');
            authorP.textContent = `by ${item.author}`; // Display author
            contentDiv.appendChild(authorP);

            galleryItemDiv.appendChild(contentDiv);
            galleryContainer.appendChild(galleryItemDiv);
        });
    }

    function filterGalleryItems() {
        const keyword = searchKeywordInput.value.toLowerCase();
        const searchType = searchTypeSelect.value;

        const filteredItems = galleryItems.filter(item => {
            const title = item.title.toLowerCase();
            const description = item.description.toLowerCase();
            const author = item.author.toLowerCase();
            const tags = Object.values(item.tags).join(' ').toLowerCase();

            switch (searchType) {
                case 'title':
                    return title.includes(keyword);
                case 'title_content':
                    return title.includes(keyword) || description.includes(keyword);
                case 'author':
                    return author.includes(keyword);
                case 'tag':
                    return tags.includes(keyword);
                default:
                    return true;
            }
        });

        renderGalleryItems(filteredItems);
    }

    searchButton.addEventListener('click', filterGalleryItems);
    searchKeywordInput.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            filterGalleryItems();
        }
    });

    renderGalleryItems(galleryItems);
});