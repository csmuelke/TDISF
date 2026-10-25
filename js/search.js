/* Search Functionality */

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('story-search');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterAndSortStories();
        });
    }
});
