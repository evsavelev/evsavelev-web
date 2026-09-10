(() => {
  const dialog=document.querySelector('#request-dialog'),form=document.querySelector('#request-form');
  const name=form.elements.name,phone=form.elements.phone,service=form.elements.service,comment=form.elements.comment;
  const prepared=form.querySelector('.prepared-message'),preview=form.querySelector('#request-preview'),status=form.querySelector('.form-status'),manualOpen=form.querySelector('.prepared-open');
  const profiles={telegram:'https://t.me/+79088990088?profile',max:'https://max.ru/u/f9LHodD0cOI3lG2rCNUhXaH2sHDji6eki00A8hQZEJLe7xK2dwy4zaDRH88'};
  let revision=0;
  const clearOutput=()=>{revision++;prepared.hidden=true;preview.value='';status.textContent='';manualOpen.hidden=true;manualOpen.href='#';};
  const error=(input,id,message)=>{document.getElementById(id).textContent=message;input.setAttribute('aria-invalid',String(Boolean(message)));};
  const validate=()=>{const digits=phone.value.replace(/\D/g,'');error(name,'name-error',name.value.trim()?'':'Укажите ваше имя.');error(phone,'phone-error',digits.length>=7&&digits.length<=18?'':'Укажите телефон: от 7 до 18 цифр.');const invalid=[name,phone].find(el=>el.getAttribute('aria-invalid')==='true');if(invalid){invalid.focus();return false;}return true;};
  const message=()=>`Здравствуйте, Евгений.\n\n${service.value.startsWith('Бесплатное демо')?'Хочу получить бесплатное демо сайта.':'Хочу обсудить создание сайта.'}\n\nУслуга:\n${service.value}\n\nИмя:\n${name.value.trim()}\n\nТелефон:\n${phone.value.trim()}${comment.value.trim()?'\n\nКомментарий:\n'+comment.value.trim():''}`;
  document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',event=>{
    if(typeof dialog.showModal!=='function')return;
    event.preventDefault();clearOutput();service.value=link.dataset.service;dialog.returnFocus=link;dialog.showModal();document.body.classList.add('dialog-open');
    // Keep the introduction visible on phones; the user opens the keyboard explicitly.
    dialog.querySelector('[data-close]').focus({preventScroll:true});dialog.scrollTop=0;
  }));
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',event=>{if(event.target===preview)return;clearOutput();if(event.target===name)error(name,'name-error','');if(event.target===phone)error(phone,'phone-error','');});
  dialog.addEventListener('close',()=>{clearOutput();form.reset();error(name,'name-error','');error(phone,'phone-error','');});
  const copy=async text=>{try{await navigator.clipboard.writeText(text);return true;}catch{return false;}};
  form.querySelector('[data-copy-request]').addEventListener('click',async()=>{
    const text=preview.value,version=revision;if(!text)return;
    const ok=await copy(text);if(version!==revision)return;
    status.textContent=ok?'Текст заявки скопирован — вставьте его в чат.':'Не удалось скопировать автоматически. Выделите текст заявки и скопируйте вручную.';
    if(!ok){preview.focus();preview.select();}
  });
  form.querySelectorAll('[data-channel]').forEach(button=>button.addEventListener('click',async()=>{
    if(!validate())return;
    const text=message(),channel=button.dataset.channel,version=++revision;
    preview.value=text;prepared.hidden=false;manualOpen.hidden=true;
    if(channel==='email'){
      const subject='Заявка с сайта — '+service.value.split(' — ')[0];
      status.textContent='Письмо подготовлено. Проверьте его в почтовой программе и отправьте самостоятельно.';
      window.location.href=`mailto:evsavelev.region@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
      return;
    }
    const url=channel==='whatsapp'?`https://wa.me/79088990088?text=${encodeURIComponent(text)}`:profiles[channel];
    manualOpen.href=url;manualOpen.textContent=`Открыть ${channel==='whatsapp'?'WhatsApp':channel==='telegram'?'Telegram':'MAX'} ↗`;manualOpen.hidden=false;
    if(channel==='whatsapp'){
      window.open(url,'_blank','noopener,noreferrer');status.textContent='Сообщение подготовлено. Если чат не открылся, воспользуйтесь ссылкой ниже. Отправку подтвердите в WhatsApp.';return;
    }
    // Reserve a window during the click, then navigate only after clipboard resolves.
    // This preserves mobile popup activation without exposing window.opener to the destination.
    const popup=window.open('about:blank','_blank');if(popup)popup.opener=null;
    const copied=await copy(text);
    if(version!==revision){if(popup&&!popup.closed)popup.close();return;}
    if(popup&&!popup.closed){try{popup.location.replace(url);}catch{popup.close();}}
    status.textContent=copied?'Текст заявки скопирован — вставьте его в чат.':'Автоматическое копирование недоступно. Текст заявки показан ниже: скопируйте его вручную или кнопкой «Скопировать заявку».';
    if(!popup)status.textContent+=' Если чат не открылся, используйте ссылку ниже.';
  }));
})();
