const roles = ["AI/ML Enthusiast", "Python Developer", "Future AI Engineer"];
let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  const target = document.getElementById("typing");
  if (!target) {
    return;
  }

  const current = roles[roleIndex];
  target.textContent = current.substring(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex += 1;
    setTimeout(typeEffect, 90);
    return;
  }

  if (!deleting && charIndex === current.length) {
    deleting = true;
    setTimeout(typeEffect, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeEffect, 50);
    return;
  }

  deleting = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeEffect, 300);
}

typeEffect();

function renderProjects(items) {
  const container = document.getElementById("projects-container");
  if (!container) {
    return;
  }

  items.slice(0, 6).forEach((repo) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      <p>${repo.description || "No description available."}</p>
      <a href="${repo.html_url}" target="_blank" rel="noreferrer">View repository</a>`;
    container.appendChild(card);
  });
}

const projectsContainer = document.getElementById("projects-container");
if (projectsContainer) {
  fetch("https://api.github.com/users/sunnyxai/repos")
    .then((response) => response.json())
    .then((repos) => {
      if (Array.isArray(repos)) {
        renderProjects(repos);
      }
    })
    .catch(() => {
      projectsContainer.innerHTML = "<p>Unable to load projects at this time.</p>";
    });
}
