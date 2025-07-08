document.addEventListener('DOMContentLoaded', function() {
    const writePostBtn = document.getElementById('writePostBtn');
    if (writePostBtn) {
        writePostBtn.addEventListener('click', function() {
            location.href = 'write_post.html';
        });
    }
});