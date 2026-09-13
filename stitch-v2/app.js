(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  menuButton.hidden = false;
  const closeMenu = () => { menu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') !== 'true';
    menu.hidden = !expanded;
    menuButton.setAttribute('aria-expanded', String(expanded));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { closeMenu(); menuButton.focus(); }
  });
  matchMedia('(min-width: 1024px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

  const projects = [...document.querySelectorAll('.project')];
  const filters = document.querySelector('.filters');
  const more = document.querySelector('.more-projects');
  const count = document.querySelector('.result-count');
  let activeFilter = 'all', expanded = false;
  projects.forEach((project, i) => { project.id = `project-${i + 1}`; });
  more.setAttribute('aria-controls', projects.slice(4).map(p => p.id).join(' '));
  const renderProjects = () => {
    const matching = projects.filter(p => activeFilter === 'all' || p.dataset.category === activeFilter);
    const visible = activeFilter === 'all' && !expanded ? matching.slice(0, 4) : matching;
    projects.forEach(p => { p.hidden = !visible.includes(p); });
    filters.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === activeFilter)));
    more.hidden = activeFilter !== 'all';
    more.setAttribute('aria-expanded', String(expanded));
    more.innerHTML = expanded ? 'Показать меньше <span aria-hidden="true">↑</span>' : 'Показать все проекты <span aria-hidden="true">↓</span>';
    count.textContent = `Показано ${visible.length} из ${matching.length} проектов`;
  };
  filters.hidden = false;
  renderProjects();
  filters.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter; expanded = false; renderProjects();
  }));
  more.addEventListener('click', () => {
    expanded = !expanded; renderProjects();
    if (expanded) { projects[4].querySelector('a').focus({preventScroll: true}); projects[4].scrollIntoView({block: 'start', behavior: 'instant'}); }
    else more.scrollIntoView({block: 'center', behavior: 'instant'});
  });

  const form = document.querySelector('#request');
  const name = form.elements.name, contact = form.elements.contact, format = form.elements.format, comment = form.elements.comment;
  const prepared = document.querySelector('#prepared'), output = document.querySelector('#message-text'), status = document.querySelector('#form-status');
  const submit = form.querySelector('.prepare-button');
  const whatsapp = document.querySelector('#send-whatsapp'), email = document.querySelector('#send-email');
  let revision = 0;
  submit.hidden = false;
  form.tabIndex = -1;
  const clearPrepared = () => {
    revision++; prepared.hidden = true; output.value = ''; status.textContent = '';
    whatsapp.removeAttribute('href'); email.removeAttribute('href');
  };
  const updateButton = () => {
    submit.innerHTML = (format.value.startsWith('Персональное демо') ? 'Получить бесплатное демо' : 'Подготовить обращение') + ' <span aria-hidden="true">↗</span>';
  };
  const fieldError = (field, message) => {
    document.querySelector(`#${field.name}-error`).textContent = message;
    field.setAttribute('aria-invalid', String(Boolean(message)));
  };
  document.querySelectorAll('[data-format]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); format.value = link.dataset.format; clearPrepared(); updateButton();
    form.focus({preventScroll: true}); form.scrollIntoView({block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }));
  form.addEventListener('input', event => {
    if (event.target === output) return;
    clearPrepared(); updateButton();
    if (event.target === name || event.target === contact) fieldError(event.target, '');
  });
  form.addEventListener('change', updateButton);
  form.addEventListener('submit', event => {
    event.preventDefault();
    fieldError(name, name.value.trim() ? '' : 'Укажите ваше имя.');
    fieldError(contact, contact.value.trim().length >= 3 ? '' : 'Укажите телефон, e-mail или другой контакт.');
    const invalid = [name, contact].find(field => field.getAttribute('aria-invalid') === 'true');
    if (invalid) { invalid.focus(); return; }
    const isDemo = format.value.startsWith('Персональное демо');
    const text = `Здравствуйте, Евгений!\n\n${isDemo ? 'Хочу получить бесплатное персональное демо.' : 'Хочу обсудить сайт.'}\nФормат: ${format.value}\nИмя: ${name.value.trim()}\nКонтакт: ${contact.value.trim()}${comment.value.trim() ? '\n\nЗадача: ' + comment.value.trim() : ''}`;
    output.value = text;
    whatsapp.href = 'https://wa.me/79088990088?text=' + encodeURIComponent(text);
    email.href = 'mailto:evsavelev.region@gmail.com?subject=' + encodeURIComponent(isDemo ? 'Персональное демо сайта' : 'Обсуждение сайта') + '&body=' + encodeURIComponent(text);
    prepared.hidden = false;
    status.textContent = 'Сообщение подготовлено. Выберите канал связи и подтвердите отправку в нём.';
    output.focus({preventScroll: true}); prepared.scrollIntoView({block: 'nearest', behavior: 'instant'});
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    const text = output.value, version = revision;
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (version === revision) status.textContent = 'Текст скопирован. Откройте Telegram или MAX и вставьте его в чат.';
    } catch {
      if (version !== revision) return;
      output.focus(); output.select();
      status.textContent = 'Скопируйте выделенный текст вручную и вставьте его в чат.';
    }
  });
})();
