/* Navigation Dropdown Functionality */

document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.navigation-vertical .dropdown');
    
    dropdowns.forEach(dropdown => {
        const arrow = dropdown.querySelector('.dropdown-arrow');
        
        if (arrow) {
            arrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                dropdown.classList.toggle('active');
            });
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navigation-vertical .dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});
