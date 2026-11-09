(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const modeButton = document.querySelector('#reader-mode');
  const topButton = document.querySelector('#back-top');
  const progress = document.querySelector('#page-progress');
  let overview = false;
  function fit() {
    const width = root.clientWidth;
    const targetWidth = width < 700 && !overview ? 1100 : width;
    root.style.setProperty('--page-scale', Math.min(1, targetWidth / 1928));
    modeButton.textContent = overview ? '阅读模式' : '总览';
    modeButton.setAttribute('aria-pressed', String(overview));
  }
  fit();
  addEventListener('resize', fit, { passive: true });
  modeButton.addEventListener('click', () => {
    const ratio = scrollY / Math.max(1, root.scrollHeight - innerHeight);
    overview = !overview;
    fit();
    scrollTo({ top: ratio * (root.scrollHeight - innerHeight), left: 0, behavior: 'instant' });
  });
  function updateProgress() {
    const total = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
    topButton.classList.toggle('show', scrollY > 500);
    topButton.tabIndex = scrollY > 500 ? 0 : -1;
  }
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  topButton.addEventListener('click', () => scrollTo({ top: 0, left: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.06 });
  document.querySelectorAll('.study-section').forEach(section => observer.observe(section));
  const routeButtons = document.querySelectorAll('.route-toggle');
  routeButtons.forEach(button => button.addEventListener('click', () => {
    const active = button.getAttribute('aria-pressed') !== 'true';
    routeButtons.forEach(other => other.setAttribute('aria-pressed', String(active && other === button)));
    document.querySelector('[data-node-id="188:355"]').style.opacity = active && button.dataset.route === 'optimized' ? '.18' : '1';
    document.querySelector('[data-node-id="188:356"]').style.opacity = active && button.dataset.route === 'original' ? '.18' : '1';
  }));
})();
