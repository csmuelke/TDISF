/* Modal Functionality */

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.body.classList.remove('story-open');
}

/* Save as PDF: the browser's print dialog prints only the open story (see print styles in modals.css) */

function buildPdfFilename() {
    const plain = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const storyTitle = document.getElementById('story-title').textContent || 'Unknown Title';
    const storyAuthor = document.getElementById('story-author').textContent || 'Unknown Author';
    const storyYear = document.getElementById('story-year').textContent || 'Unknown Year';
    const authorLastName = plain(storyAuthor.split(',')[0].split(' ').pop()).replace(/[^a-zA-Z]/g, '');
    const titleCamelCase = plain(storyTitle)
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().replace(/[^a-zA-Z]/g, ''))
        .join('');
    return `${authorLastName}-${titleCamelCase}-${storyYear}`;
}

function downloadStoryPDF() {
    if (!document.body.classList.contains('story-open')) return;

    // Browsers suggest the page title as the PDF file name, so set it for the moment of printing
    const originalTitle = document.title;
    document.title = buildPdfFilename();

    const restoreTitle = () => {
        document.title = originalTitle;
        window.removeEventListener('afterprint', restoreTitle);
    };
    window.addEventListener('afterprint', restoreTitle);

    window.print();
}

/* Keyboard Event Handling */
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const triggerModal = document.getElementById('trigger-warning-modal');
        if (triggerModal && triggerModal.style.display === 'flex') {
            closeTriggerWarningModal();
        } else {
            closeStoryModal();
        }
    }
});
