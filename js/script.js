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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    // Theme toggle button
    themeToggle.addEventListener('click', toggleTheme);
    
    // Save theme preference
    themeToggle.addEventListener('click', () => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
});