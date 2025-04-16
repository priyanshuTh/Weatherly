// Add scroll animation for value cards
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = "translateY(0)";
    }
  });
});

document.querySelectorAll(".value-card").forEach((card) => {
  card.style.opacity = 0;
  card.style.transform = "translateY(20px)";
  card.style.transition = "all 0.6s ease-out";
  observer.observe(card);
});

// Smooth scroll for contact button
document.querySelector(".contact-btn").addEventListener("click", (e) => {
  e.preventDefault();
  // Add your contact form logic here
  console.log("Contact button clicked");
  alert(
    "Thank you for your interest! Our contact form will be available soon."
  );
});
