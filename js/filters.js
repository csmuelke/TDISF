/* Filter Functionality */

function initializeFilters() {
    const allTags = extractAllTags();
    const allAuthors = extractAllAuthors();
    
    populateTagsDropdown(allTags);
    populateAuthorsDropdown(allAuthors);
    
    setupDropdownToggle('tags-dropdown');
    setupDropdownToggle('authors-dropdown');
    
    document.getElementById('tag-search').addEventListener('input', function() {
        filterDropdownItems('tags-list', this.value);
    });
    
    document.getElementById('author-search').addEventListener('input', function() {
        filterDropdownItems('authors-list', this.value);
    });
    
    document.getElementById('clearAllFiltersBtn').addEventListener('click', function() {
        clearAllFilters();
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.filter-dropdown')) {
            closeAllDropdowns();
        }
    });
}

function extractAllTags() {
    const tagsSet = new Set();
    const storyTiles = document.querySelectorAll('.story-tile');
    
    storyTiles.forEach(tile => {
        const tags = tile.dataset.tags;
        if (tags) {
            tags.split(' ').forEach(tag => {
                if (tag.trim()) {
                    tagsSet.add(tag.trim());
                }
            });
        }
    });
    
    const tagsArray = Array.from(tagsSet);
    return tagsArray.sort((a, b) => {
        const displayA = formatTagDisplay(a);
        const displayB = formatTagDisplay(b);
        return displayA.localeCompare(displayB);
    });
}

function extractAllAuthors() {
    const authorsSet = new Set();
    const storyTiles = document.querySelectorAll('.story-tile');
    
    storyTiles.forEach(tile => {
        const author = tile.dataset.author;
        if (author && author.trim()) {
            authorsSet.add(author.trim());
        }
    });
    
    const authorsArray = Array.from(authorsSet);
    return authorsArray.sort((a, b) => a.localeCompare(b));
}

function formatTagDisplay(tag) {
    return tag.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function populateTagsDropdown(tags) {
    const tagsList = document.getElementById('tags-list');
    tagsList.innerHTML = '';
    
    tags.forEach(tag => {
        const item = document.createElement('div');
        item.className = 'filter-dropdown-item';
        item.dataset.value = tag;
        item.dataset.type = 'tag';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'filter-checkbox';
        checkbox.id = `tag-${tag}`;
        
        const label = document.createElement('label');
        label.htmlFor = `tag-${tag}`;
        label.textContent = formatTagDisplay(tag);
        label.className = 'filter-label';
        
        item.appendChild(checkbox);
        item.appendChild(label);
        
        item.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            handleFilterChange();
        });
        
        tagsList.appendChild(item);
    });
}

function populateAuthorsDropdown(authors) {
    const authorsList = document.getElementById('authors-list');
    authorsList.innerHTML = '';
    
    authors.forEach(author => {
        const item = document.createElement('div');
        item.className = 'filter-dropdown-item';
        item.dataset.value = author;
        item.dataset.type = 'author';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'filter-checkbox';
        checkbox.id = `author-${author.replace(/\s+/g, '-')}`;
        
        const label = document.createElement('label');
        label.htmlFor = `author-${author.replace(/\s+/g, '-')}`;
        label.textContent = author;
        label.className = 'filter-label';
        
        item.appendChild(checkbox);
        item.appendChild(label);
        
        item.addEventListener('click', function(e) {
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            handleFilterChange();
        });
        
        authorsList.appendChild(item);
    });
}

function setupDropdownToggle(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const toggle = document.getElementById(`${dropdownId}-toggle`);
    const menu = document.getElementById(`${dropdownId}-menu`);
    
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('active');
        
        closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.classList.add('active');
        }
    });
}

function closeAllDropdowns() {
    document.querySelectorAll('.filter-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

function filterDropdownItems(listId, searchTerm) {
    const list = document.getElementById(listId);
    const items = list.querySelectorAll('.filter-dropdown-item');
    const term = searchTerm.toLowerCase();
    
    items.forEach(item => {
        const label = item.querySelector('.filter-label');
        const text = label.textContent.toLowerCase();
        
        if (text.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function handleFilterChange() {
    updateSelectedFiltersDisplay();
    filterAndSortStories();
}

function updateSelectedFiltersDisplay() {
    const selectedFiltersList = document.getElementById('selected-filters-list');
    const selectedFiltersContainer = document.getElementById('selected-filters-container');
    selectedFiltersList.innerHTML = '';
    
    const selectedTags = Array.from(document.querySelectorAll('#tags-list .filter-checkbox:checked'));
    const selectedAuthors = Array.from(document.querySelectorAll('#authors-list .filter-checkbox:checked'));
    
    if (selectedTags.length === 0 && selectedAuthors.length === 0) {
        selectedFiltersContainer.style.display = 'none';
        return;
    }
    
    selectedFiltersContainer.style.display = 'block';
    
    selectedTags.forEach(checkbox => {
        const item = checkbox.closest('.filter-dropdown-item');
        const value = item.dataset.value;
        const label = item.querySelector('.filter-label').textContent;
        
        const filterBadge = createFilterBadge(label, 'tag', value);
        selectedFiltersList.appendChild(filterBadge);
    });
    
    selectedAuthors.forEach(checkbox => {
        const item = checkbox.closest('.filter-dropdown-item');
        const value = item.dataset.value;
        const label = item.querySelector('.filter-label').textContent;
        
        const filterBadge = createFilterBadge(label, 'author', value);
        selectedFiltersList.appendChild(filterBadge);
    });
}

function createFilterBadge(label, type, value) {
    const badge = document.createElement('div');
    badge.className = `selected-filter-badge ${type}-badge`;
    
    const text = document.createElement('span');
    text.textContent = label;
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-filter-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.onclick = function(e) {
        e.stopPropagation();
        removeFilter(type, value);
    };
    
    badge.appendChild(text);
    badge.appendChild(removeBtn);
    
    return badge;
}

function removeFilter(type, value) {
    if (type === 'tag') {
        const checkbox = document.querySelector(`#tags-list .filter-dropdown-item[data-value="${value}"] .filter-checkbox`);
        if (checkbox) checkbox.checked = false;
    } else if (type === 'author') {
        const checkbox = document.querySelector(`#authors-list .filter-dropdown-item[data-value="${value}"] .filter-checkbox`);
        if (checkbox) checkbox.checked = false;
    }
    
    handleFilterChange();
}

function clearAllFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    document.getElementById('story-search').value = '';
    document.getElementById('tag-search').value = '';
    document.getElementById('author-search').value = '';
    
    filterDropdownItems('tags-list', '');
    filterDropdownItems('authors-list', '');
    
    handleFilterChange();
}

function getSelectedTags() {
    const selectedCheckboxes = document.querySelectorAll('#tags-list .filter-checkbox:checked');
    return Array.from(selectedCheckboxes).map(checkbox => {
        return checkbox.closest('.filter-dropdown-item').dataset.value;
    });
}

function getSelectedAuthors() {
    const selectedCheckboxes = document.querySelectorAll('#authors-list .filter-checkbox:checked');
    return Array.from(selectedCheckboxes).map(checkbox => {
        return checkbox.closest('.filter-dropdown-item').dataset.value;
    });
}

function filterAndSortStories() {
    const selectedTags = getSelectedTags();
    const selectedAuthors = getSelectedAuthors();
    const allStories = Array.from(document.querySelectorAll('.story-tile'));
    const searchInput = document.getElementById('story-search');
    const searchTerm = searchInput.value.toLowerCase();
    
    if (selectedTags.length === 0 && selectedAuthors.length === 0 && searchTerm === '') {
        allStories.forEach(story => {
            story.style.display = 'flex';
            story.style.order = '';
            story.style.opacity = '1';
        });
        return;
    }

    const storyMatches = allStories.map(story => {
        const storyTags = story.dataset.tags ? story.dataset.tags.split(' ') : [];
        const storyAuthor = (story.dataset.author || '').trim();
        const storyTitle = story.querySelector('.story-title').textContent.toLowerCase();
        
        const tagMatchCount = selectedTags.filter(tag => storyTags.includes(tag)).length;
        const tagMatch = selectedTags.length === 0 || (tagMatchCount === selectedTags.length);
        
        const authorMatch = selectedAuthors.length === 0 || selectedAuthors.includes(storyAuthor);
        
        const titleMatch = searchTerm === '' || storyTitle.includes(searchTerm);
        const searchAuthorMatch = searchTerm === '' || storyAuthor.toLowerCase().includes(searchTerm);
        const searchMatch = titleMatch || searchAuthorMatch;
        
        return {
            element: story,
            matchCount: tagMatchCount,
            hasMatch: searchMatch && tagMatch && authorMatch,
            titleMatch: titleMatch,
            authorMatch: authorMatch,
            tagMatch: tagMatch
        };
    });
    
    storyMatches.sort((a, b) => {
        if (a.hasMatch && !b.hasMatch) return -1;
        if (!a.hasMatch && b.hasMatch) return 1;
        if (a.hasMatch && b.hasMatch) {
            const titleA = a.element.querySelector('.story-title').textContent;
            const titleB = b.element.querySelector('.story-title').textContent;
            return titleA.localeCompare(titleB);
        }
        return 0;
    });
    
    storyMatches.forEach((storyMatch, index) => {
        const story = storyMatch.element;
        story.style.order = index;
        
        if (storyMatch.hasMatch) {
            story.style.display = 'flex';
            story.style.opacity = '1';
        } else {
            story.style.display = 'flex';
            story.style.opacity = '0.3';
        }
    });
}
