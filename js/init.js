/* Main Initialization */

document.addEventListener('DOMContentLoaded', function() {
    generatePlaceholderTiles();
    initializeFilters();
    
    // Load all stories at startup for better performance
    loadAllStories()
        .then(() => {
            console.log('Stories pre-loaded successfully');
        })
        .catch(error => {
            console.error('Failed to pre-load stories:', error);
        });
});
