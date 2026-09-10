(() => {
  const portfolio=document.querySelector('#portfolio-content');
  const workTitle=document.querySelector('#work-title');
  const workToggle=document.querySelector('[data-work-toggle]');
  const workOpen=document.querySelector('[data-work-open]');
  const setPortfolio=(expanded, navigate=false)=>{
    portfolio.hidden=!expanded;
    portfolio.toggleAttribute('data-open',expanded);
    [workToggle,workOpen].forEach(button=>button.setAttribute('aria-expanded',String(expanded)));
    workToggle.textContent=expanded?'Скрыть работы':'Посмотреть работы';
    if(navigate){workTitle.focus({preventScroll:true});document.querySelector('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}
  };
  setPortfolio(location.hash==='#work');
  workOpen.addEventListener('click',()=>setPortfolio(true,true));
  workToggle.addEventListener('click',()=>{const opening=portfolio.hidden;setPortfolio(opening,opening);});
  document.querySelectorAll('a[href="#work"]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();if(location.hash!=='#work')history.pushState(null,'','#work');setPortfolio(true);requestAnimationFrame(()=>setPortfolio(true,true));}));
  window.addEventListener('hashchange',()=>{if(location.hash==='#work')setPortfolio(true,true);});
  const dialogs = [...document.querySelectorAll('dialog')];
  const menuButton = document.querySelector('.menu-toggle');
  const open = (dialog, invoker) => { if (typeof dialog.showModal !== 'function') return false; dialog.returnFocus=invoker || document.activeElement; dialog.showModal(); document.body.classList.add('dialog-open'); return true; };
  dialogs.forEach(dialog => {
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {document.body.classList.remove('dialog-open');if(dialog.returnFocus?.isConnected)dialog.returnFocus.focus({preventScroll:true});});
    dialog.addEventListener('keydown', event => {
      if(event.key !== 'Tab') return;
      const items=[...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.getClientRects().length);
      const first=items[0],last=items[items.length-1];
      if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
    });
    dialog.addEventListener('click', event => { if(event.target === dialog){const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();} });
    dialog.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{if(link.getAttribute('href')==='#work')dialog.returnFocus=null;dialog.close();}));
  });
  if (typeof document.querySelector('#menu-dialog').showModal === 'function') {
    menuButton.hidden = false;
    menuButton.addEventListener('click',()=>open(document.querySelector('#menu-dialog'),menuButton));
    document.querySelector('[data-contact-open]').addEventListener('click',event=>{if(window.matchMedia('(max-width: 767px)').matches && open(document.querySelector('#contact-dialog'),event.currentTarget))event.preventDefault();});
  }
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if('IntersectionObserver' in window && !reduced.matches){
    document.documentElement.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:0.06});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    reduced.addEventListener('change',event=>{if(event.matches){document.documentElement.classList.remove('motion-ready');observer.disconnect();}},{once:true});
  }
})();
