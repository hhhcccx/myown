const pages = [...document.querySelectorAll(".photo-page")];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  {
    root: null,
    threshold: 0.38,
  },
);

pages.forEach((page) => observer.observe(page));

const updatePageTurn = () => {
  const center = window.innerHeight / 2;

  pages.forEach((page) => {
    const sheet = page.querySelector(".album-sheet");
    const rect = page.getBoundingClientRect();
    const distance = (rect.top + rect.height / 2 - center) / window.innerHeight;
    const turn = Math.max(-12, Math.min(10, distance * -11));
    sheet.style.setProperty("--turn", `${turn.toFixed(2)}deg`);
  });
};

updatePageTurn();
window.addEventListener("scroll", updatePageTurn, { passive: true });
window.addEventListener("resize", updatePageTurn);
