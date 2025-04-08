document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thanks for reaching out! We’ll get back to you soon.');
    this.reset();
});