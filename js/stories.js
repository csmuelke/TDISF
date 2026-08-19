/* Story Loading and Display */

let isOpeningStoryModal = false;
let allStories = null;

// Load all stories from the single JSON file
function loadAllStories() {
    return fetch('data/abstracts-complete.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allStories = data;
            console.log('All stories loaded successfully');
            return allStories;
        })
        .catch(error => {
            console.error('Error loading stories:', error);
            throw error;
        });
}

// Find story by ID in the loaded stories array
function findStoryById(storyId) {
    if (!allStories) {
        console.error('Stories not loaded yet');
        return null;
    }
    return allStories.find(story => story.id === storyId);
}

function openStoryModal(storyId) {
    if (isOpeningStoryModal) {
        console.log('Already opening a story modal, ignoring duplicate call');
        return;
    }
    
    isOpeningStoryModal = true;
    
    // If stories aren't loaded yet, load them first
    if (!allStories) {
        loadAllStories()
            .then(() => {
                const story = findStoryById(storyId);
                if (story) {
                    displayStoryModal(story);
                } else {
                    displayErrorModal('Story not found. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error loading story data:', error);
                displayErrorModal('Failed to load story data. Please try again.');
            })
            .finally(() => {
                isOpeningStoryModal = false;
            });
    } else {
        // Stories are already loaded
        const story = findStoryById(storyId);
        if (story) {
            displayStoryModal(story);
        } else {
            displayErrorModal('Story not found. Please try again.');
        }
        isOpeningStoryModal = false;
    }
}

function displayStoryModal(story) {
    document.getElementById('story-title').textContent = story.title || 'Unknown Title';
    
    let authorText = 'Unknown Author';
    if (story.author && Array.isArray(story.author) && story.author.length > 0) {
        authorText = story.author.map(author => {
            if (author.given && author.family) {
                return `${author.given} ${author.family}`;
            } else if (author.family) {
                return author.family;
            } else if (author.given) {
                return author.given;
            } else {
                return 'Unknown Author';
            }
        }).join(', ');
    }

    document.getElementById('story-author').textContent = authorText;
    document.getElementById('story-publisher').textContent = story.publisher || 'Unknown Publisher';
    document.getElementById('story-publisher-place').textContent = story['publisher-place'] || 'Unknown Location';

    let yearText = 'Unknown Year';
    if (story.issued && story.issued['date-parts'] && story.issued['date-parts'][0] && story.issued['date-parts'][0][0]) {
        yearText = story.issued['date-parts'][0][0];
    }
    document.getElementById('story-year').textContent = yearText;

    const noteContainer = document.getElementById('story-note-container');
    const noteElement = document.getElementById('story-note');
    if (story.note && story.note.trim() !== '') {
        let processedNote = story.note;
        processedNote = processedNote.replace(/Richard Dehan/gi, '<span style="font-weight: bold; color: #747474ff;">Richard Dehan</span>');
        noteElement.innerHTML = processedNote;
        noteContainer.style.display = 'block';
    } else {
        noteContainer.style.display = 'none';
    }
    
    document.getElementById('story-abstract-text').textContent = story.abstract || 'No abstract available.';

    displayStoryTags(story);
    
    const modal = document.getElementById('story-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function displayStoryTags(story) {
    const tagsContainer = document.getElementById('story-tags-container');
    tagsContainer.innerHTML = '';
    
    const storyTile = document.querySelector(`[data-story-id="${story.id}"]`);
    
    if (storyTile && storyTile.dataset.tags) {
        const tags = storyTile.dataset.tags.split(' ');
        
        tags.forEach(tagData => {
            if (tagData.trim()) {
                const tagElement = document.createElement('span');
                tagElement.className = 'story-modal-tag';
                const tagDiv = document.querySelector(`.tag[data-tag="${tagData}"]`);
                const displayText = tagDiv ? tagDiv.textContent : tagData.replace(/-/g, ' ');
                tagElement.textContent = displayText;
                tagsContainer.appendChild(tagElement);
            }
        });
    }
    
    if (tagsContainer.children.length === 0) {
        const noTagsElement = document.createElement('span');
        noTagsElement.className = 'story-modal-tag no-tags';
        noTagsElement.textContent = 'No tags available';
        tagsContainer.appendChild(noTagsElement);
    }
}

function displayErrorModal(errorMessage) {
    document.getElementById('story-title').textContent = 'Error Loading Story';
    document.getElementById('story-author').textContent = 'N/A';
    document.getElementById('story-publisher').textContent = 'N/A';
    document.getElementById('story-publisher-place').textContent = 'N/A';
    document.getElementById('story-year').textContent = 'N/A';
    
    const noteContainer = document.getElementById('story-note-container');
    noteContainer.style.display = 'none';

    document.getElementById('story-abstract-text').textContent = errorMessage;
    
    const tagsContainer = document.getElementById('story-tags-container');
    tagsContainer.innerHTML = '';

    const modal = document.getElementById('story-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function generatePlaceholderTiles() {
    const storyGrid = document.getElementById('story-grid');
    if (!storyGrid) return;
    
    const existingTiles = storyGrid.querySelectorAll('.story-tile').length;
    const totalTiles = 5;
    
    if (existingTiles >= totalTiles) return;
    
    for (let i = existingTiles + 1; i <= totalTiles; i++) {
        const storyTile = document.createElement('div');
        storyTile.className = 'story-tile demo-tile';
        storyTile.setAttribute('data-story-id', '');
        storyTile.setAttribute('data-tags', '');
        storyTile.setAttribute('onclick', 'openStoryModal(\'\')');
        
        const paperPreview = document.createElement('div');
        paperPreview.className = 'paper-preview';
        
        for (let j = 0; j < 5; j++) {
            const paperLine = document.createElement('div');
            paperLine.className = 'paper-lines';
            paperPreview.appendChild(paperLine);
        }
        
        const storyTitle = document.createElement('div');
        storyTitle.className = 'story-title';
        storyTitle.textContent = `Demo Story ${i - 6}`;

        storyTile.appendChild(paperPreview);
        storyTile.appendChild(storyTitle);
        storyGrid.appendChild(storyTile);
    }
}

/* Sensitive Content Handling */
let pendingStoryId = null;
const CONTENT_WARNINGS = {
    'cannibalism': 'Cannibalism',
    'blood-gore': 'Blood and Gore',
    'sexual-assault-violence-implied': 'Sexual Assault and Violence (implied/off-page)'
};

function handleSensitiveContentClick(storyId, storyElement) {
    pendingStoryId = storyId;
    
    const warningsAttr = storyElement.getAttribute('data-content-warnings');
    const warnings = warningsAttr ? warningsAttr.split(' ') : [];
    
    showTriggerWarningModal(warnings);
}

function showTriggerWarningModal(warnings) {
    const modal = document.getElementById('trigger-warning-modal');
    const warningsContainer = document.getElementById('trigger-warnings-container');
    
    warningsContainer.innerHTML = '';
    warnings.forEach(warningCode => {
        if (CONTENT_WARNINGS[warningCode]) {
            const warningTag = document.createElement('span');
            warningTag.className = 'trigger-warning-tag';
            warningTag.textContent = CONTENT_WARNINGS[warningCode];
            warningsContainer.appendChild(warningTag);
        }
    });
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeTriggerWarningModal() {
    const modal = document.getElementById('trigger-warning-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    pendingStoryId = null;
}

function proceedToStory() {
    if (pendingStoryId) {
        const storyId = pendingStoryId;
        closeTriggerWarningModal();
        openStoryModal(storyId);
    }
}
