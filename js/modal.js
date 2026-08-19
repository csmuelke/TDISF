/* Modal Functionality */

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function downloadStoryPDF() {
    const storyTitle = document.getElementById('story-title').textContent || 'Unknown Title';
    const storyAuthor = document.getElementById('story-author').textContent || 'Unknown Author';
    const storyYear = document.getElementById('story-year').textContent || 'Unknown Year';
    const authorLastName = storyAuthor.split(' ').pop().replace(/[^a-zA-Z]/g, '');
    const titleCamelCase = storyTitle
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase().replace(/[^a-zA-Z]/g, ''))
        .join('');
    const filename = `${authorLastName}-${titleCamelCase}-${storyYear}.pdf`;
    const modalContent = document.querySelector('.story-modal-content');

    if (!modalContent) {
        alert('Modal content not found. Please try again.');
        return;
    }
    
    const closeButton = document.querySelector('.close-btn');
    const downloadButton = document.querySelector('.download-btn');
    const originalCloseDisplay = closeButton ? closeButton.style.display : null;
    const originalDownloadDisplay = downloadButton ? downloadButton.style.display : null;
    
    if (closeButton) closeButton.style.display = 'none';
    if (downloadButton) downloadButton.style.display = 'none';
    
    html2canvas(modalContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: modalContent.scrollWidth,
        height: modalContent.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        logging: false,
        onclone: function(clonedDoc) {
            const style = clonedDoc.createElement('style');
            style.textContent = `
                * {
                    border: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-top: none !important;
                    border-bottom: none !important;
                    box-shadow: none !important;
                    outline: none !important;
                    filter: none !important;
                    backdrop-filter: none !important;
                    -webkit-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                
                .story-meta, .story-abstract, .story-tags-section {
                    border: none !important;
                    background: white !important;
                    box-shadow: none !important;
                }
                
                /* University of Tübingen branding elements */
                .story-meta {
                    background-color: white !important;
                    border-left: 4px solid #a51e37 !important;
                    border-radius: 6px !important;
                    padding: 20px !important;
                    margin-bottom: 30px !important;
                }
                
                .story-abstract h3, .story-tags-section h3 {
                    border-bottom: 2px solid #a51e37 !important;
                    color: #a51e37 !important;
                    font-weight: 600 !important;
                    padding-bottom: 5px !important;
                }
                
                .story-modal-content {
                    max-height: none !important;
                    overflow: visible !important;
                    opacity: 1 !important;
                    filter: none !important;
                    animation: none !important;
                }
                
                .story-tags-container {
                    overflow: visible !important;
                    height: auto !important;
                    max-height: none !important;
                }
                
                /* University red separator line */
                .story-modal-header::after {
                    content: '' !important;
                    position: absolute !important;
                    bottom: 0 !important;
                    left: 30px !important;
                    right: 30px !important;
                    height: 3px !important;
                    background-color: #a51e37 !important;
                }
                
                /* Hide keywords section to avoid layout issues */
                .story-tags-section {
                    display: none !important;
                }
            `;
            clonedDoc.head.appendChild(style);
            
            const clonedModal = clonedDoc.querySelector('.story-modal-content');
            if (clonedModal) {
                clonedModal.style.maxHeight = 'none';
                clonedModal.style.overflow = 'visible';
                clonedModal.style.opacity = '1';
                clonedModal.style.filter = 'none';
                clonedModal.style.animation = 'none';
                
                const tagsContainer = clonedDoc.querySelector('.story-tags-container');
                if (tagsContainer) {
                    tagsContainer.style.overflow = 'visible';
                    tagsContainer.style.height = 'auto';
                    tagsContainer.style.maxHeight = 'none';
                }
            }
        },
        ignoreElements: function(element) {
            return element.classList.contains('close-btn') || 
                   element.classList.contains('download-btn');
        }
    }).then(canvas => {
        if (closeButton && originalCloseDisplay !== null) {
            closeButton.style.display = originalCloseDisplay;
        } else if (closeButton) {
            closeButton.style.display = '';
        }
        
        if (downloadButton && originalDownloadDisplay !== null) {
            downloadButton.style.display = originalDownloadDisplay;
        } else if (downloadButton) {
            downloadButton.style.display = '';
        }
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const availableWidth = pdfWidth - (2 * margin);
        const availableHeight = pdfHeight - (2 * margin) - 15;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasWidth / canvasHeight;
        let imgWidth = availableWidth;
        let imgHeight = availableWidth / aspectRatio;
        
        if (imgHeight > availableHeight) {
            imgHeight = availableHeight;
            imgWidth = availableHeight * aspectRatio;
        }
        
        const xPosition = margin + (availableWidth - imgWidth) / 2;
        const yPosition = margin + (availableHeight - imgHeight) / 2;
        const imgData = canvas.toDataURL('image/png', 1.0);

        pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);
        pdf.save(filename);
        
    }).catch(error => {
        if (closeButton && originalCloseDisplay !== null) {
            closeButton.style.display = originalCloseDisplay;
        } else if (closeButton) {
            closeButton.style.display = '';
        }
        
        if (downloadButton && originalDownloadDisplay !== null) {
            downloadButton.style.display = originalDownloadDisplay;
        } else if (downloadButton) {
            downloadButton.style.display = '';
        }
        
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please ensure the modal is open and try again.');
    });
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
