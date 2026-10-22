const placeholderRoutes = {
  "/navigators": {
    number: "02",
    rank: "Navigator",
    audience: "Programmers",
    accent: "navigator",
    summary: "A secure-building curriculum for the people charting routes through code, architecture, and delivery systems."
  }
};

const path = window.location.pathname.replace(/\/+$/, "") || "/";
const route = placeholderRoutes[path];

if (route) {
  document.title = `${route.rank} Academy · Coming Soon`;
  document.querySelector(".text-link")?.remove();
  document.querySelector("#main").innerHTML = `
    <section class="holding ${route.accent}" aria-labelledby="holding-title">
      <div class="holding-grid" aria-hidden="true"></div>
      <div class="holding-card">
        <p class="eyebrow">Academy path ${route.number} // ${route.audience}</p>
        <span class="holding-number">${route.number}</span>
        <h1 id="holding-title">${route.rank}<br><span>training inbound.</span></h1>
        <p class="lede">${route.summary}</p>
        <div class="transmission"><i></i><span>Curriculum in development</span></div>
        <a class="button" href="/">Return to Academy directory</a>
      </div>
    </section>`;
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });
});
