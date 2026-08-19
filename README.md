# TDISF - Tübingen Database of Irish Science Fiction

A comprehensive digital database showcasing Irish science fiction literature, created as part of the research-based learning initiative at the University of Tübingen.

## Overview

The **Tübingen Database of Irish Science Fiction (TDISF)** aims to increase the visibility of Irish science fiction by providing researchers and enthusiasts with a searchable, well-organized collection of Irish SF texts. The database highlights the unique role of Irish science fiction in negotiating tradition and modernity within the Irish cultural imaginary.

## Project Background

- **Institution**: University of Tübingen, English Department
- **Program**: [Mehr innovative Lehre wagen!](https://uni-tuebingen.de/en/lehrende/foerderformate/)
- **Funding**: Division III Academic Affairs
- **Course Leader**: PD Dr. Raphael Zähringer
- **Courses**: 
  - "Irish Science Fiction" (Summer 2025)
  - "Anthologising Anglophone Science Fiction" (Winter 2025/2026)
- **Expected Entries**: ~200 database entries by spring 2026

The database builds upon Jack Fennell's bibliography *A Short Guide to Irish Science Fiction* (2019) and includes additional entries researched and validated by students through peer review.

## Features

### Core Functionality
- **Story Grid Display**: Visual representation of stories as paper-like tiles
- **Advanced Filtering**: Filter stories by keywords (tags) and authors
- **Search Functionality**: Real-time search by title or author name
- **Story Modal**: Detailed view showing:
  - Title, author(s), publisher information
  - Publication year and location
  - Abstract
  - Keywords/tags
  - Additional notes
- **PDF Export**: Download story information as formatted PDF
- **Content Warnings**: Trigger warning system for sensitive content
- **Responsive Design**: Optimized for various screen sizes

### User Interface
- Clean, university-branded design (University of Tübingen colors)
- Intuitive navigation with dropdown menus
- Real-time filter updates
- Smooth animations and transitions
- Accessible design with keyboard support (ESC to close modals)

## File Structure

```
irish-short-stories/
│
├── index.html                 # Main HTML file
│
├── css/                       # Stylesheets (modular organization)
│   ├── base.css              # Resets and typography
│   ├── layout.css            # Grid layouts and containers
│   ├── navigation.css        # Navigation menu styles
│   ├── filters.css           # Filter dropdown styles
│   ├── story-tiles.css       # Story grid and tile styles
│   ├── modals.css            # Modal window styles
│   ├── search.css            # Search input styles
│   ├── footer.css            # Footer styles
│   └── media.css             # Media queries and accessibility
│
├── js/                        # JavaScript (modular organization)
│   ├── init.js               # Main initialization
│   ├── stories.js            # Story loading and display
│   ├── filters.js            # Filter functionality
│   ├── modal.js              # Modal operations and PDF download
│   ├── navigation.js         # Navigation dropdowns
│   └── search.js             # Search functionality
│
├── data/                      # JSON files for each story
│   ├── [StoryTitle]-[Author].json
│   └── ...
│
├── media/                     # Images and media assets
│   ├── Logo_Universitaet_Tuebingen.svg
│   ├── csm_Neue-Aula_05641c7f7d.jpg
│   ├── sensitive-content-badge.jpg
│   └── ...
│
├── docs/                      # Documentation and resources
│   └── ...
│
└── README.md                  # This file
```

## Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox and Grid
- **JavaScript (ES6+)**: Interactive functionality

### Libraries
- **jQuery 3.7.1**: DOM manipulation and utilities
- **html2canvas 1.4.1**: Canvas-based screenshot for PDF generation
- **jsPDF 2.5.1**: PDF creation and export

### Design Principles
- Mobile-first responsive design
- Progressive enhancement
- Accessibility (WCAG considerations)
- University of Tübingen branding (#a51e37 brand color)

## Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for loading JSON files)

### Quick Start

1. **Clone or download the repository**
   ```bash
   git clone [repository-url]
   cd irish-short-stories
   ```

2. **Start a local web server**
   
   **⚠️ Important**: Due to browser security restrictions, JSON files cannot be loaded when opening `index.html` directly. You must use a local web server.
   
   **Option 1 - Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   ```
   
   **Option 2 - Node.js:**
   ```bash
   # Install http-server globally (one time)
   npm install -g http-server
   
   # Run server
   http-server
   ```
   
   **Option 3 - PHP:**
   ```bash
   php -S localhost:8000
   ```
   
   **Option 4 - VS Code:**
   - Install the "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Access the database**
   - Open `http://localhost:8000` in your browser
   - Start exploring Irish science fiction!

## Usage

### Browsing Stories
- Scroll through the story grid in the center panel
- Click on any story tile to view details
- Stories are displayed with visual paper-like representations

### Filtering & Searching

**By Keywords:**
1. Click "Keywords" in the right sidebar
2. Search or select tags from the dropdown
3. Apply multiple tags for refined results

**By Author:**
1. Click "Authors" in the right sidebar
2. Search or select authors from the dropdown
3. Combine with keyword filters if needed

**By Title/Author Search:**
- Use the search bar at the top of the story grid
- Type to filter stories in real-time
- Search matches both titles and author names

**Clear Filters:**
- Click "Clear All" in the active filters section
- Or individually remove filter badges

### Viewing Story Details
1. Click on a story tile
2. View comprehensive information in the modal
3. Download as PDF using the 📄 button
4. Close with the × button or press ESC

### Content Warnings
- Stories with sensitive content display a warning badge
- Click to view trigger warnings before accessing the story
- Choose to proceed or go back

## Data Structure

Each story is stored as a JSON file in the `data/` folder with the following structure:

```json
{
  "id": "story-identifier",
  "title": "Story Title",
  "author": [
    {
      "given": "FirstName",
      "family": "LastName"
    }
  ],
  "publisher": "Publisher Name",
  "publisher-place": "City, Country",
  "issued": {
    "date-parts": [[2020]]
  },
  "abstract": "Story description...",
  "note": "Additional notes..."
}
```

Story tiles in HTML reference these files with data attributes:
- `data-story-id`: Unique identifier
- `data-tags`: Space-separated list of keywords
- `data-author`: Author name
- `data-content-warnings`: Trigger warnings (if applicable)

## Development

### Modular Architecture

The codebase follows a modular approach for maintainability:

**CSS Modules:**
- Each module handles a specific UI component
- Import order matters (base → layout → components → media)

**JavaScript Modules:**
- Separated by functionality
- Clear dependencies between modules
- Event-driven architecture

### Adding New Stories

1. **Create JSON file** in `data/` folder:
   ```
   data/NewStory-AuthorName.json
   ```

2. **Add story tile** in `index.html`:
   ```html
   <div class="story-tile" 
        data-story-id="story-id"
        data-tags="tag1 tag2 tag3"
        data-author="Author Name"
        onclick="openStoryModal('data/NewStory-AuthorName.json')">
     <div class="paper-preview">
       <div class="paper-lines"></div>
       <div class="paper-lines"></div>
       <div class="paper-lines"></div>
       <div class="paper-lines"></div>
       <div class="paper-lines"></div>
     </div>
     <div class="story-title">Story Title</div>
   </div>
   ```

3. **For sensitive content**, add:
   ```html
   <div class="story-tile sensitive-content"
        data-content-warnings="warning-tag1 warning-tag2"
        onclick="handleSensitiveContentClick('data/Story.json', this)">
     <!-- ... tile content ... -->
     <div class="sensitive-content-badge"></div>
   </div>
   ```

### Customization

**Colors:**
- University red: `#a51e37`
- Update in respective CSS modules

**Layout:**
- Grid dimensions: Edit `layout.css`
- Story tile count: Modify `.story-grid` columns in `story-tiles.css`

**Features:**
- Add new filters: Extend `filters.js`
- Custom search logic: Modify `search.js`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Keyboard navigation support (ESC to close modals)
- ARIA labels where appropriate
- High contrast mode support (`@media (prefers-contrast: high)`)
- Reduced motion preferences respected (`@media (prefers-reduced-motion)`)
- Minimum touch target sizes (44x44px)

## Version History

- **v2.2**: Added trigger warning cover and modal for sensitive content
- **v2.3**: Refactored codebase into modular CSS and JavaScript files

## Credits

### Project Team
- **PD Dr. Raphael Zähringer**: Course Leader and Project Supervisor
- **Students**: Research and database entry creation
- **University of Tübingen**: Funding and institutional support

### Bibliography
- Jack Fennell: *A Short Guide to Irish Science Fiction* (2019)

## License

© University of Tübingen, English Department

## Acknowledgments

This project is part of the "Mehr innovative Lehre wagen!" program, funded by Division III Academic Affairs of the University of Tübingen, promoting innovative and research-based learning approaches.

---

**Last Updated**: February 2026