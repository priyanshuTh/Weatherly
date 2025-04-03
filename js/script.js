// DOM Elements
const themeToggle = document.getElementById('theme');
const themeIcon = document.getElementById('themeicon');
const weatherImage = document.getElementById('weather-image');
const greeting = document.getElementById('greeting');

// Theme state
let isDarkMode = false;

// Theme toggle functionality
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    isDarkMode = !isDarkMode;
    
    // Update theme icon
    themeIcon.src = isDarkMode ? 'assets/images/dark-mode.png' : 'assets/images/light-mode.png';
    themeIcon.alt = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}

// Initialize theme
function initializeTheme() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.classList.add('dark-mode');
        themeIcon.src = 'assets/images/dark-mode.png';
    }
}

// Preload images for better performance
function preloadImages() {
    const images = [
        'assets/images/weather-default.jpg',
        'assets/images/light-mode.png',
        'assets/images/dark-mode.png',
        'assets/images/App-store.png',
        'assets/images/Google-Play.png',
        'assets/images/weatherlygif.gif'
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
    const minDisplayTime = 2000; // 2 seconds minimum display time
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
                        preloader.remove();
                    }
                }, 500);
            }, remainingTime);
        })
        .catch(error => {
            console.warn('Some images failed to load:', error);
            // Still remove preloader even if some images fail
            document.body.classList.add('loaded');
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