export function initContact() {
 const form=document.querySelector('#request'),phone=form.querySelector('#phone'),comment=form.querySelector('#comment'),prepared=form.querySelector('#prepared'),message=form.querySelector('#message'),status=form.querySelector('#form-status'),error=form.querySelector('#phone-error');
 form.hidden=false;
 function invalidate(){prepared.hidden=true;status.textContent='';}
 phone.addEventListener('input',()=>{invalidate();phone.removeAttribute('aria-invalid');error.hidden=true;});comment.addEventListener('input',invalidate);
 form.addEventListener('submit',e=>{
   e.preventDefault();
   const digits=phone.value.replace(/\D/g,'');
   if(digits.length<10||digits.length>15){phone.setAttribute('aria-invalid','true');error.hidden=false;prepared.hidden=true;phone.focus();return;}
   error.hidden=true;phone.removeAttribute('aria-invalid');
   const text=`Здравствуйте, Евгений! Хочу получить персональный демо-сайт за 0 ₽.\nТелефон: ${phone.value.trim()}\nО бизнесе и задаче: ${comment.value.trim()||'Обсудим в переписке.'}`;
   message.value=text;
   form.querySelector('#send-whatsapp').href=`https://wa.me/79088990088?text=${encodeURIComponent(text)}`;
   form.querySelector('#send-email').href=`mailto:evsavelev.region@gmail.com?subject=${encodeURIComponent('Персональный демо-сайт')}&body=${encodeURIComponent(text)}`;
   prepared.hidden=false;status.textContent='Текст подготовлен. Ничего не отправлено. Выберите канал связи.';
 });
 form.querySelector('#copy-message').addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(message.value);status.textContent='Текст скопирован. Вставьте его в выбранный чат.';}
   catch{message.focus();message.select();status.textContent='Скопируйте выделенный текст вручную и вставьте в чат.';}
 });
}
