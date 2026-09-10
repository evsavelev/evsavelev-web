(() => {
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
    dialog.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>dialog.close()));
  });
  if (typeof document.querySelector('#menu-dialog').showModal === 'function') {
    menuButton.hidden = false;
    menuButton.addEventListener('click',()=>open(document.querySelector('#menu-dialog'),menuButton));
    document.querySelector('[data-contact-open]').addEventListener('click',event=>{if(open(document.querySelector('#contact-dialog'),event.currentTarget))event.preventDefault();});
  }
  document.querySelectorAll('[data-copy]').forEach(button=>{
    button.hidden=false;
    button.addEventListener('click',async()=>{
      const status=button.parentElement.querySelector('.copy-status');
      try{await navigator.clipboard.writeText('+79088990088');status.textContent='Номер скопирован. Найдите меня в MAX: +79088990088.';}
      catch{status.textContent='Не удалось скопировать автоматически. Номер для копирования: +79088990088.';}
    });
  });
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  if('IntersectionObserver' in window && !reduced.matches){
    document.documentElement.classList.add('motion-ready');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:0.06});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    reduced.addEventListener('change',event=>{if(event.matches){document.documentElement.classList.remove('motion-ready');observer.disconnect();}},{once:true});
  }
})();
