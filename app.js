(() => {
  const dialogs = [...document.querySelectorAll('dialog')];
  const open = (dialog, invoker) => {
    if (!dialog || typeof dialog.showModal !== 'function') return;
    dialog.returnFocus = invoker;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  };
  dialogs.forEach(dialog => {
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.classList.remove('dialog-open');
      if (dialog.returnFocus?.isConnected) dialog.returnFocus.focus({preventScroll:true});
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    dialog.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => dialog.close()));
  });
  const menu = document.querySelector('.menu-toggle');
  if (typeof document.querySelector('#menu-dialog')?.showModal === 'function') {
    menu.hidden = false;
    menu.addEventListener('click', () => open(document.querySelector('#menu-dialog'), menu));
  }
  const projects = [...document.querySelectorAll('.project')];
  const more = document.querySelector('.show-projects');
  if (projects.length > 4 && more) {
    let expanded = false;
    const extra = projects.slice(4);
    extra.forEach((p,i) => {p.hidden=true;p.id=`extra-project-${i+1}`;});
    more.hidden=false;
    more.setAttribute('aria-controls',extra.map(p=>p.id).join(' '));
    more.addEventListener('click', () => {
      expanded=!expanded;
      extra.forEach(p=>p.hidden=!expanded);
      more.setAttribute('aria-expanded',String(expanded));
      more.innerHTML=expanded?'Скрыть дополнительные проекты <span aria-hidden="true">↑</span>':`Ещё ${extra.length} проектов <span aria-hidden="true">↓</span>`;
      if(expanded){extra[0].querySelector('a').focus({preventScroll:true});extra[0].scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
      else more.scrollIntoView({block:'center',behavior:'instant'});
    });
  }
})();
