// ================= TYPING EFFECT =================
const roles = ["AI/ML Enthusiast", "Python Developer", "Future AI Engineer"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const target = document.getElementById("typing");
  if (!target) return;

  const current = roles[roleIndex];
  target.textContent = current.substring(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    setTimeout(typeEffect, 90);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeEffect, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 50);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeEffect, 300);
}

// ================= RENDER PROJECTS =================
function renderProjects(items) {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.innerHTML = ""; // clear old

  items.slice(0, 6).forEach((repo) => {
    const card = document.createElement("article");
    card.className = "project-card";

    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description available."}</p>
      <div>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</div>
      <a href="${repo.html_url}" target="_blank">View repository →</a>
    `;

    container.appendChild(card);
  });
}

// ================= LOAD PROJECTS =================
function loadProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  container.innerHTML = "<p>Loading projects...</p>";

  fetch("https://api.github.com/users/sunnyxai/repos")
    .then((res) => res.json())
    .then((repos) => {
      if (Array.isArray(repos)) {
        const sorted = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
        renderProjects(sorted);
      }
    })
    .catch(() => {
      container.innerHTML = "<p>⚠️ Failed to load projects</p>";
    });
}

// ================= CONTACT FORM (EMAILJS) =================
function handleContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  emailjs.init("OK1DK2zWwsDCZP668"); // your public key

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const btn = form.querySelector("button");
    const originalText = btn.textContent;

    btn.textContent = "Sending...";
    btn.disabled = true;

    emailjs.sendForm(
      "service_vaeogkl",
      "template_e6oecxp",
      this
    )
    .then(() => {
      form.reset();
      btn.textContent = "✅ Message Sent!";
    })
    .catch(() => {
      btn.textContent = "❌ Failed!";
    });

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  });
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  typeEffect();
  loadProjects();
  handleContactForm();
});
