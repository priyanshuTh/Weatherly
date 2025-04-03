// DOM Elements
const themeToggle = document.getElementById('theme');
const themeIcon = document.getElementById('themeicon');
const greeting = document.getElementById('greeting');

// Theme state
let isDarkMode = false;

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    const preloaderImage = document.getElementById('preloader-image');
    
    // Update theme icon
    themeIcon.src = isDarkMode ? 'assets/images/dark-mode.png' : 'assets/images/light-mode.png';
    themeIcon.alt = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    // Update preloader image
    if (preloaderImage) {
        preloaderImage.src = isDarkMode ? 'assets/images/preload-dark.gif' : 'assets/images/preload-light.gif';
    }
    //save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme
function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const preloaderImage = document.getElementById('preloader-image');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        themeIcon.src = 'assets/images/dark-mode.png';
        if (preloaderImage) {
            preloaderImage.src = 'assets/images/preload-dark.gif';
        }
    } else {
        if (preloaderImage) {
            preloaderImage.src = 'assets/images/preload-light.gif';
        }
    }
}

// Preload images for better performance
function preloadImages() {
    const images = [
        'assets/images/light-mode.png',
        'assets/images/dark-mode.png',
        'assets/images/App-store.png',
        'assets/images/Google-Play.png',
        'assets/images/preload-light.gif',
        'assets/images/preload-dark.gif'
    ];
    
    return Promise.all(images.map(src => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = reject;
            img.src = src;
        });
    }));
}

// Handle preloader with improved timing
function handlePreloader() {
    const minDisplayTime = 1000; // 1 seconds minimum display time
    const startTime = Date.now();
    
    // Start preloading images
    preloadImages()
        .then(() => {
            const loadTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minDisplayTime - loadTime);
            
            setTimeout(() => {
                document.body.classList.add('loaded');
                
                // Remove preloader from DOM after transition
                setTimeout(() => {
                    const preloader = document.querySelector('.preloader');
                    if (preloader) {
                        preloader.style.display = 'none';
                    }
                }, 500);
            }, minDisplayTime);
        })
        .catch(error => {
            console.warn('Some images failed to load:', error);
            // Still remove preloader even if some images fail
            document.body.classList.add('loaded');
            const preloader = document.querySelector('preloader');
            if (preloader) {
                preloader.style.display = 'none';
                preloader.remove();
            }
        });
}

// Add a greeting based on time of day
function setGreeting() {
    const hour = new Date().getHours();
    let greetingText = 'Welcome to Weatherly';
    
    if (hour < 12) {
        greetingText = 'Good Morning with Weatherly';
    } else if (hour < 18) {
        greetingText = 'Good Afternoon with Weatherly';
    } else {
        greetingText = 'Good Evening with Weatherly';
    }
    
    if (greeting) {
        greeting.textContent = greetingText;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    handlePreloader();
    setGreeting();
    
    // Theme toggle button
    themeToggle.addEventListener('click', () => {
        toggleTheme();
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
});