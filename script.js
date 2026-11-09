// Cursor personalizado
const cursor = document.querySelector(".cursor");
const magneticElements = document.querySelectorAll(".magnetic");

if (window.matchMedia("(hover: hover)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  magneticElements.forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));

    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .18;
      const y = (event.clientY - rect.top - rect.height / 2) * .18;
      element.style.transform = `translate(${x}px, ${y}px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "translate(0, 0)";
    });
  });
}

// Header que desaparece al bajar y reaparece al subir
const header = document.querySelector(".site-header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  header.classList.toggle("is-hidden", currentScroll > lastScroll && currentScroll > 180);
  lastScroll = currentScroll;
}, { passive: true });

// Reveals
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

// Parallax suave
const parallaxItems = document.querySelectorAll("[data-parallax]");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  parallaxItems.forEach((item) => {
    const speed = parseFloat(item.dataset.parallax);
    const rect = item.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    item.style.transform = `translateY(${scrollY * speed * -0.2}px)`;
  });
}, { passive: true });

// Menú overlay
const menuToggle = document.querySelector(".menu-toggle");
const menuOverlay = document.querySelector(".menu-overlay");
const menuLinks = document.querySelectorAll(".menu-nav a");

function toggleMenu(open) {
  menuOverlay.classList.toggle("is-open", open);
  menuOverlay.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
}

menuToggle.addEventListener("click", () => {
  toggleMenu(!menuOverlay.classList.contains("is-open"));
});

menuLinks.forEach((link, index) => {
  link.style.transitionDelay = `${index * 70}ms`;

  link.addEventListener("click", () => toggleMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") toggleMenu(false);
});

// Pestañas de agenda
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".agenda-panel");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selectedDay = tab.dataset.day;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.id === `panel-${selectedDay}`;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  });
});

// Cuenta atrás
const weddingDate = new Date("2027-09-12T16:30:00").getTime();
const countdown = document.getElementById("countdown");

function updateCountdown() {
  const difference = weddingDate - Date.now();

  if (difference <= 0) {
    countdown.innerHTML = "<div><strong>¡Hoy!</strong><span>es el gran día</span></div>";
    return;
  }

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  countdown.querySelector("[data-days]").textContent = String(days).padStart(2, "0");
  countdown.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
  countdown.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
  countdown.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP
const form = document.getElementById("rsvp-form");
const formStatus = document.getElementById("form-status");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const guests = form.guests.value;
  const attendance = form.attendance.value;

  if (!name || !email || !guests || !attendance) {
    formStatus.textContent = "Por favor, completa todos los campos obligatorios.";
    formStatus.style.color = "#a4573d";
    return;
  }

  const firstName = name.split(" ")[0];
  formStatus.textContent = attendance === "yes"
    ? `¡Gracias, ${firstName}! Hemos recibido tu confirmación para ${guests} ${guests === "1" ? "persona" : "personas"}.`
    : `Gracias por avisarnos, ${firstName}. Te echaremos de menos.`;

  formStatus.style.color = "var(--olive)";
  form.reset();
});