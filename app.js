(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const dialogs = [...document.querySelectorAll('dialog')];

  const openDialog = (dialog, invoker) => {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.returnFocus = invoker;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  };

  dialogs.forEach(dialog => {
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (dialog.returnFocus?.isConnected) dialog.returnFocus.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
      if (outside) dialog.close();
    });
    dialog.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => dialog.close()));
  });

  const menu = document.querySelector('.menu-toggle');
  const menuDialog = document.querySelector('#menu-dialog');
  if (menu && menuDialog && typeof menuDialog.showModal === 'function') {
    menu.hidden = false;
    menu.addEventListener('click', () => openDialog(menuDialog, menu));
  }

  const revealItems = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealItems.forEach(el => observer.observe(el));
  }

  const header = document.querySelector('[data-header]');
  if (header) {
    const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    syncHeader();
    window.addEventListener('scroll', syncHeader, { passive: true });
  }

  document.querySelectorAll('[data-price-target]').forEach(link => {
    link.addEventListener('click', () => {
      const target = link.dataset.priceTarget;
      requestAnimationFrame(() => {
        const details = [...document.querySelectorAll('.price-item')].find(item => item.dataset.priceName === target);
        if (!details) return;
        details.open = true;
        if (!reduceMotion) setTimeout(() => details.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
      });
    });
  });

  const finePointer = window.matchMedia('(pointer: fine)').matches;
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.project-media').forEach(media => {
      const img = media.querySelector('img');
      if (!img) return;
      media.addEventListener('pointermove', event => {
        const r = media.getBoundingClientRect();
        const x = (event.clientX - r.left) / r.width - 0.5;
        const y = (event.clientY - r.top) / r.height - 0.5;
        img.style.transform = `scale(1.045) translate(${x * -8}px,${y * -8}px)`;
      });
      media.addEventListener('pointerleave', () => { img.style.transform = ''; });
    });
  }

  document.querySelectorAll('.faq-list details').forEach(detail => {
    detail.addEventListener('toggle', () => {
      if (!detail.open) return;
      document.querySelectorAll('.faq-list details[open]').forEach(other => {
        if (other !== detail) other.open = false;
      });
    });
  });
})();
