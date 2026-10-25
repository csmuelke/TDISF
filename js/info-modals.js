/* Info Modals (Bibliography, Contributors) */

function openInfoModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeInfoModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openBibliographyModal() { openInfoModal('bibliography-modal'); }
function closeBibliographyModal() { closeInfoModal('bibliography-modal'); }

function openContributorsModal() { openInfoModal('contributors-modal'); }
function closeContributorsModal() { closeInfoModal('contributors-modal'); }

const INFO_MODAL_IDS = ['bibliography-modal', 'contributors-modal'];

// Close when clicking the dark backdrop outside the modal content
document.addEventListener('click', function(e) {
    if (INFO_MODAL_IDS.includes(e.target.id)) {
        closeInfoModal(e.target.id);
    }
});

// Close an open info modal with the Escape key
document.addEventListener('keydown', function(e) {
    if (e.key !== 'Escape') return;
    INFO_MODAL_IDS.forEach(id => {
        const modal = document.getElementById(id);
        if (modal && modal.style.display === 'flex') {
            closeInfoModal(id);
        }
    });
});