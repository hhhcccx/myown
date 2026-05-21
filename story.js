const scenes = [...document.querySelectorAll("[data-scene]")];
const items = [...document.querySelectorAll(".item")];
const progress = document.querySelector(".progress span");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

items.forEach((item) => {
  const id = item.dataset.id;
  if (!id) return;

  const image = new Image();
  image.onload = () => {
    image.alt = item.querySelector("figcaption")?.textContent?.trim() || id;
    image.decoding = "async";
    item.prepend(image);
    item.classList.add("has-image");
  };
  image.src = `./assets/story/${id}.jpg`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  },
);

scenes.forEach((scene) => observer.observe(scene));

const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max <= 0 ? 0 : window.scrollY / max;
  progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
};

const updateParallax = () => {
  if (reduceMotion) return;

  const center = window.innerHeight / 2;
  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const distance = (rect.top + rect.height / 2 - center) / window.innerHeight;
    const drift = Math.max(-18, Math.min(18, distance * -14));
    const light = Math.max(0, 1 - Math.abs(distance) * 1.25);
    item.style.setProperty("--drift", `${drift.toFixed(2)}px`);
    item.style.setProperty("--light", (0.72 + light * 0.28).toFixed(3));
    item.style.setProperty("--delay", `${(index % 4) * 60}ms`);
  });
};

updateProgress();
updateParallax();
window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("scroll", updateParallax, { passive: true });
window.addEventListener("resize", updateProgress);
window.addEventListener("resize", updateParallax);

window.addEventListener("load", () => {
  const target = window.location.hash && document.querySelector(window.location.hash);
  if (target) {
    window.setTimeout(() => target.scrollIntoView({ block: "start" }), 120);
  }
});
