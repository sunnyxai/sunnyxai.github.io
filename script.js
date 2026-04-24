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
if (document.getElementById("particles-js")) {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: { enable: true, value_area: 800 }
      },
      color: { value: ["#00f3ff", "#bc13fe"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.5,
        random: true
      },
      size: {
        value: 3,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00f3ff",
        opacity: 0.2,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        out_mode: "out"
      }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        repulse: { distance: 100 },
        push: { particles_nb: 4 }
      }
    },
    retina_detect: true
  });
}

// ================= RESOURCES PAGE — FILTER =================
function initResourceFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.resource-card');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      // Clear search when changing filters
      const searchInput = document.getElementById('resource-search');
      if (searchInput) searchInput.value = '';
    });
  });
}

// ================= RESOURCES PAGE — SEARCH =================
function initResourceSearch() {
  const searchInput = document.getElementById('resource-search');
  const cards = document.querySelectorAll('.resource-card');
  const grid = document.getElementById('resource-grid');
  if (!searchInput || !cards.length) return;

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();

    // Reset filter buttons to "All" when searching
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');

    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const tags = card.querySelector('.resource-tags')?.textContent.toLowerCase() || '';

      if (title.includes(query) || desc.includes(query) || tags.includes(query)) {
        card.classList.remove('hidden');
        visibleCount++;
      } else {
        card.classList.add('hidden');
      }
    });

    // Show / hide "no results" message
    let noResults = grid.querySelector('.no-results');
    if (visibleCount === 0 && query.length > 0) {
      if (!noResults) {
        noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No resources found. Try a different search term.';
        grid.appendChild(noResults);
      }
    } else if (noResults) {
      noResults.remove();
    }
  });
}

// ================= RESOURCES PAGE — COPY TO CLIPBOARD =================
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  if (!copyBtns.length) return;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Find the <code> element inside the sibling <pre>
      const snippetCard = btn.closest('.snippet-card');
      const codeBlock = snippetCard?.querySelector('code');
      if (!codeBlock) return;

      const codeText = codeBlock.textContent;

      navigator.clipboard.writeText(codeText).then(() => {
        // Visual feedback
        btn.textContent = 'Copied!';
        btn.classList.add('copied');

        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = codeText;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

// ================= RESOURCES PAGE — SCROLL ANIMATIONS =================
function initResourceAnimations() {
  const cards = document.querySelectorAll('.resource-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animation for each card
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  cards.forEach(card => observer.observe(card));
}

// ================= STAT COUNTER ANIMATION =================
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target, 10);
        const duration = 2000; // 2 seconds
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + '+';
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current) + '+';
          }
        }, stepTime);

        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ================= SCROLL REVEAL (SITE-WIDE) =================
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

// ================= EXTENDED INIT =================
document.addEventListener('DOMContentLoaded', () => {
  initResourceFilters();
  initResourceSearch();
  initCopyButtons();
  initResourceAnimations();
  initCounterAnimation();
  initScrollReveal();
});
