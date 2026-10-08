/* =========================================================
   CRESCER — interações compartilhadas
   Atualizado em outubro de 2026.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header");

  // 2026-10: deixei a navegação mais leve; o cabeçalho só ganha destaque quando precisa.
  const syncHeader = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 24);
  };
  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });

  // Pequeno detalhe que faz diferença: elementos entram na tela sem parecer uma apresentação engessada.
  const revealItems = document.querySelectorAll(".card, .material-card, .sobre-container, .destaque, .metas, .crescer, .stat-card, .stat-mini, .termo-card");
  revealItems.forEach((item) => item.setAttribute("data-reveal", ""));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll("[data-reveal]").forEach((item) => item.classList.add("is-visible"));
  }

  // Busca do glossário e da central de materiais: tudo acontece no navegador.
  const input = document.getElementById("searchInput");
  const cards = [...document.querySelectorAll(".termo-card, .material-card")];
  const visible = document.getElementById("visibleCount");
  const total = document.getElementById("totalCount");

  if (input && cards.length) {
    if (total) total.textContent = cards.length;

    const filter = () => {
      const query = input.value.trim().toLocaleLowerCase("pt-BR");
      let count = 0;

      cards.forEach((card) => {
        const searchable = (card.dataset.search || card.textContent).toLocaleLowerCase("pt-BR");
        const match = !query || searchable.includes(query);
        card.classList.toggle("hidden-term", !match);
        if (match) count += 1;
      });

      if (visible) visible.textContent = count;
    };

    input.addEventListener("input", filter);
    filter();
  }

  // Se a pessoa abriu uma página interna, o retorno para a home continua previsível.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // 2026-10: ano automático no rodapé. Assim ninguém precisa lembrar de trocar isso no próximo ano.
  document.querySelectorAll("[data-current-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
});
