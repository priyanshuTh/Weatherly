$(document).ready(function() {
    // Add logo click refresh functionality
    $('.navbar-brand').click(function(e) {
        e.preventDefault();
        window.location.reload();
    });

    // Preloader Handling
    setTimeout(function() {
        $('.preloader').fadeOut(500);
        document.body.classList.add('loaded');
    }, 1500);

    // Cookie Notice Management
    function hasSeenCookieNotice() {
        return document.cookie.includes('noticeSeen=true');
    }

    function showCookieNotice() {
        if (!hasSeenCookieNotice()) {
            setTimeout(function() {
                $('.cookie-consent').addClass('active');
            }, 2000);
        }
    }

    function dismissCookieNotice() {
        const date = new Date();
        date.setFullYear(date.getFullYear() + 1);
        document.cookie = `noticeSeen=true; expires=${date.toUTCString()}; path=/`;
        $('.cookie-consent').removeClass('active');
        // Since we're using necessary cookies by default, we can now update the recent searches
        updateRecentSearches();
    }

    $('#dismissCookieNotice').click(dismissCookieNotice);
    showCookieNotice();

    // Theme Toggle
    $('#themeToggle').click(function(e) {
        e.preventDefault();
        $('body').toggleClass('dark-mode');
        
        if ($('body').hasClass('dark-mode')) {
            $('#themeToggle i').removeClass('bi-moon-stars').addClass('bi-sun');
        } else {
            $('#themeToggle i').removeClass('bi-sun').addClass('bi-moon-stars');
        }
        
        localStorage.setItem('theme', $('body').hasClass('dark-mode') ? 'dark' : 'light');
    });

    // Determine current season and update hero background
    function updateSeasonalBackground() {
        const date = new Date();
        const month = date.getMonth(); // 0-based (0 = January, 11 = December)
        let season;
        let backgroundImage;
        
        // Determine season based on Northern Hemisphere seasons
        if (month >= 2 && month <= 4) {
            season = 'spring';
            backgroundImage = 'assets/images/spring-bg.jpg';
        } else if (month >= 5 && month <= 7) {
            season = 'summer';
            backgroundImage = 'assets/images/summer-bg.jpg';
        } else if (month >= 8 && month <= 10) {
            season = 'autumn';
            backgroundImage = 'assets/images/autumn-bg.jpg';
        } else {
            season = 'winter';
            backgroundImage = 'assets/images/winter-bg.jpg';
        }
        
        // Update hero section background
        $('.hero-section').css('background-image', `url('${backgroundImage}')`);
        
        // Add a data attribute for potential additional styling
        $('.hero-section').attr('data-season', season);
        
        console.log(`Season set to: ${season}`);
    }

    // Call the function to set initial seasonal background
    updateSeasonalBackground();

    // Initialize Theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    $('body').toggleClass('dark-mode', savedTheme === 'dark');
    
    if (savedTheme === 'dark') {
        $('#themeToggle i').removeClass('bi-moon-stars').addClass('bi-sun');
        $('.preloader').css('background-color', '#1a1a1a');
        $('.preloader .text-muted').css('color', '#adb5bd');
    }

    // Search Functionality
    $('#searchForm').submit(function(e) {
        e.preventDefault();
        const location = $(this).find('input').val().trim();
        
        if(location) {
            // Always add to recent searches
            addRecentSearch(location);
            $(this).find('input').val('');
            
            // Simulate search result with toast notification
            showToast(`Searching forecast for ${location}...`);
        }
    });

    // Toast notification
    function showToast(message) {
        // Create toast element if it doesn't exist
        if ($('#toast-container').length === 0) {
            $('body').append(`
                <div id="toast-container" class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
                </div>
            `);
        }
        
        const toastId = 'toast-' + Date.now();
        const toast = `
            <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header">
                    <strong class="me-auto">Weatherly</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            </div>
        `;
        
        $('#toast-container').append(toast);
        const toastElement = new bootstrap.Toast(document.getElementById(toastId));
        toastElement.show();
        
        // Auto remove after it's hidden
        $(`#${toastId}`).on('hidden.bs.toast', function() {
            $(this).remove();
        });
    }

    // Recent Searches Handling
    function addRecentSearch(location) {
        const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if(!searches.includes(location)) {
            searches.unshift(location);
            localStorage.setItem('recentSearches', JSON.stringify(searches.slice(0, 5)));
            updateRecentSearches();
        }
    }

    function updateRecentSearches() {
        const searches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        $('.recent-searches').empty();
        if (searches.length > 0) {
            searches.forEach(location => {
                $('.recent-searches').append(
                    `<a href="#" class="list-group-item list-group-item-action bg-transparent text-white border-0 d-flex align-items-center">
                        <i class="bi bi-geo-alt me-2"></i>
                        ${location}
                    </a>`
                );
            });
            $('.recent-places p').hide();
        } else {
            $('.recent-places p').show();
        }
    }

    // Initialize Recent Searches
    updateRecentSearches();

    // Video Controls
    $('video').on({
        mouseenter: function() {
            if(this.paused) {
                $(this).attr('data-bs-toggle', 'tooltip');
                $(this).attr('data-bs-title', 'Click to play');
                new bootstrap.Tooltip(this).show();
            }
        },
        mouseleave: function() {
            $(this).removeAttr('data-bs-toggle');
            $(this).removeAttr('data-bs-title');
            var tooltip = bootstrap.Tooltip.getInstance(this);
            if (tooltip) {
                tooltip.dispose();
            }
        }
    });

    // Video click handler
    $('video').click(function() {
        if(this.paused) {
            this.play();
        } else {
            this.pause();
        }
    });

    // Initialize all tooltips
    setTimeout(function() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(function(tooltipTriggerEl) {
            new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, 2000);
    
    // Smooth scrolling for anchor links
    $('a[href^="#"]:not([data-bs-toggle])').on('click', function(e) {
        e.preventDefault();
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800);
        }
    });
}); 