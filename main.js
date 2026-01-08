/* ===== LOAD JSON DATA ===== */
fetch("data.json")
  .then(r => r.json())
  .then(data => {
    document.querySelectorAll(".slider").forEach(slider => {
      const key = slider.dataset.panel;
      const items = data[key];
      if (!items) return;

      slider.innerHTML = items.map((item, i) => `
        <div class="card ${i === 0 ? "active" : ""}">
          <a href="${item.link}" target="_blank">
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
          </a>
        </div>
      `).join("");
    });
  });

/* ===== CORE LOGIC ===== */
const panels = document.querySelectorAll(".panel");
const buttons = document.querySelectorAll(".core-nav button");
const track = document.querySelector(".track");
const viewport = document.querySelector(".viewport");
const arrowLeft = document.querySelector(".arrow-left");
const arrowRight = document.querySelector(".arrow-right");
const modal = document.getElementById("modal");
const modalBox = document.getElementById("modal-box");

let active = false;
let currentIndex = null;
let currentSlide = 0;

const copy = {
  about: "Anglumea is a quiet archive of independent systems.",
  support: "Support keeps the systems alive.",
  follow: "Follow only if the work resonates."
};

function updateArrows() {
  arrowLeft.style.display = active ? "flex" : "none";
  arrowRight.style.display = active ? "flex" : "none";
}

function showPanel(index) {
  currentIndex = index;
  const nav = document.querySelector(".core-nav");

  gsap.to(nav, { opacity: 0, duration: 0.25, onComplete: () => nav.style.pointerEvents = "none" });
  panels.forEach((p, i) => p.style.display = i === index ? "flex" : "none");

  if (!active) {
    active = true;
    viewport.classList.add("active");
    gsap.to(track, { opacity: 1, duration: 0.5 });
    viewport.style.pointerEvents = "auto";
  }

  currentSlide = 0;
  updateSlide();
  updateArrows();
}

function updateSlide() {
  const cards = panels[currentIndex].querySelectorAll(".card");
  cards.forEach((c, i) => {
    const on = i === currentSlide;
    c.classList.toggle("active", on);
    gsap.to(c, { opacity: on ? 1 : 0, scale: on ? 1 : 0.9, duration: 0.4 });
  });
}

function moveSlide(dir) {
  const cards = panels[currentIndex].querySelectorAll(".card");
  currentSlide = (currentSlide + dir + cards.length) % cards.length;
  updateSlide();
}

buttons.forEach((btn, i) => {
  btn.onclick = e => {
    e.stopPropagation();
    showPanel(i);
  };
});

document.addEventListener("click", () => {
  if (!active) return;
  active = false;
  currentIndex = null;

  gsap.to(track, { opacity: 0, duration: 0.35 });
  viewport.classList.remove("active");
  viewport.style.pointerEvents = "none";
  panels.forEach(p => p.style.display = "none");

  const nav = document.querySelector(".core-nav");
  nav.style.pointerEvents = "auto";
  gsap.to(nav, { opacity: 1, duration: 0.3 });
  updateArrows();
});

panels.forEach(p => p.onclick = e => e.stopPropagation());
arrowLeft.onclick = e => (e.stopPropagation(), moveSlide(-1));
arrowRight.onclick = e => (e.stopPropagation(), moveSlide(1));

document.querySelectorAll(".peripheral span").forEach(el => {
  el.onclick = e => {
    e.stopPropagation();
    modalBox.textContent = copy[el.dataset.modal];
    modal.style.display = "flex";
  };
});
modal.onclick = () => modal.style.display = "none";

/* PARALLAX */
let px = 0, py = 0, ticking = false;
document.addEventListener("mousemove", e => {
  px = (e.clientX / innerWidth - 0.5) * 8;
  py = (e.clientY / innerHeight - 0.5) * 8;
  if (!ticking) {
    requestAnimationFrame(() => {
      gsap.to("#bg-parallax", { x: px, y: py, duration: 0.8 });
      ticking = false;
    });
    ticking = true;
  }
});

updateArrows();