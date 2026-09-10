(() => {
  const video = document.querySelector('#hero-video');
  const button = document.querySelector('[data-hero-video-toggle]');
  if (!video || !button) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let wanted = !reduced.matches;
  let nearby = false;
  let loaded = false;
  let manuallyPaused = false;
  video.muted = true;
  // Source is intentionally absent until HTML is parsed and the hero is nearby.
  video.autoplay = !reduced.matches;
  button.hidden = false;

  function label() {
    button.textContent = video.paused ? 'Play' : 'Pause';
    button.setAttribute('aria-label', video.paused ? 'Воспроизвести видео' : 'Приостановить видео');
  }
  function sync() {
    if (!wanted || !nearby || document.hidden) {
      video.pause();
      return;
    }
    if (!loaded) {
      loaded = true;
      video.src = video.dataset.src;
      video.load();
    }
    video.play().then(() => {
      if (!wanted || !nearby || document.hidden) video.pause();
    }).catch(() => { label(); });
  }
  button.addEventListener('click', () => {
    wanted = video.paused;
    manuallyPaused = !wanted;
    sync();
  });
  video.addEventListener('play', label);
  video.addEventListener('pause', label);
  video.addEventListener('error', () => { wanted = false; label(); });
  reduced.addEventListener('change', () => {
    video.autoplay = !reduced.matches && !manuallyPaused;
    wanted = !reduced.matches && !manuallyPaused;
    sync();
  });
  document.addEventListener('visibilitychange', sync);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      nearby = entry.isIntersecting;
      sync();
    }, { rootMargin: '240px 0px' }).observe(video);
  } else {
    // Older browsers keep the poster until explicit Play.
    nearby = true;
    wanted = false;
  }
  label();
})();
