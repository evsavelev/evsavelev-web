const clamp = v => Math.min(1, Math.max(0, v));
// Reflow once at a breakpoint; soften the state change without stretching text.
// Width is never written continuously during scrolling.
function reflow(canvas, change) {
 const el=canvas.querySelector('.site-object');
 el.getAnimations().forEach(a=>a.cancel());
 change();
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 el.animate([{opacity:.85},{opacity:1}],{duration:240,easing:'cubic-bezier(.22,1,.36,1)'});
}
export function scrollScene(element, render) {
  let frame = 0, active = false;
  const draw = () => { frame = 0; if (!active) return; const r=element.getBoundingClientRect(); render(clamp((innerHeight*.8-r.top)/(r.height+innerHeight*.4)),r); };
  const schedule = () => { if (!frame && active) frame=requestAnimationFrame(draw); };
  const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;schedule();},{rootMargin:'100px'});
  observer.observe(element);addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
  return ()=>{observer.disconnect();removeEventListener('scroll',schedule);removeEventListener('resize',schedule);cancelAnimationFrame(frame);};
}
export function heroScene() {
  const canvas=document.querySelector('.hero-canvas');
  const animations=[];
  const animate=(selector,frames,options)=>{const el=canvas.querySelector(selector);if(el)animations.push(el.animate(frames,{fill:'backwards',easing:'cubic-bezier(.22,1,.36,1)',...options}));};
  animate('.canvas-grid',[{opacity:0},{opacity:.28}],{duration:250});
  animate('.guides',[{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0)'}],{delay:150,duration:300});
  // The hero's flex container owns centering. Animate only the visual scale:
  // neither keyframe replaces/repeats the positioning translate used by other scenes.
  // scale(1) and the underlying transform:none have identical final geometry.
  animate('.site-object',[{opacity:0,transform:'scale(.985)'},{opacity:1,transform:'scale(1)'}],{delay:300,duration:400});
  canvas.dataset.stage='2';
  for(const selector of ['.mini-copy','.mini-image','.mini-action','.mini-footer'])animate(selector,[{opacity:0},{opacity:1}],{delay:450,duration:450});
  const timers=[setTimeout(()=>canvas.dataset.stage='3',700),setTimeout(()=>canvas.dataset.stage='6',1400)];
  // H1 and CTA remain readable from first paint; the build is the animated layer.
  const cleanup=scrollScene(document.querySelector('.hero-workspace'),(_,r)=>{const p=clamp(-r.top/(r.height*.8));canvas.style.transform=`scale(${1-.08*p})`;});
  return ()=>{timers.forEach(clearTimeout);animations.forEach(a=>a.cancel());cleanup();canvas.dataset.stage='6';canvas.style.removeProperty('transform');};
}
export function processScene() {
  const section=document.querySelector('.process-layout'),canvas=document.querySelector('.process-canvas');
  const steps=[...document.querySelectorAll('.process-step')],label=document.querySelector('.current-stage'),progress=document.querySelector('.progress-track span');
  const thresholds=[.14,.30,.46,.63,.76,.90,1];
  let last=-1;
  const cleanup=scrollScene(section,(_,r)=>{
    const p=clamp((130-r.top)/(r.height-innerHeight*.85));
    const stage=Math.max(0,thresholds.findIndex(t=>p<=t));
    progress.style.transform=`scaleX(${p})`;
    if(stage!==last){reflow(canvas,()=>canvas.dataset.stage=stage);steps.forEach((s,i)=>s.classList.toggle('is-current',i===stage));label.textContent=steps[stage].querySelector('.meta').textContent;last=stage;}
  });
  steps[0].classList.add('is-current');
  return ()=>{cleanup();canvas.dataset.stage='6';steps.forEach(s=>s.classList.remove('is-current'));progress.style.removeProperty('transform');};
}
export function portfolioScene() {
  const projects=[...document.querySelectorAll('.project')];
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('is-entering');observer.unobserve(e.target);}}),{threshold:.12});
  projects.forEach(p=>{if(p.getBoundingClientRect().top>innerHeight)p.classList.add('is-entering');observer.observe(p);});
  return ()=>{observer.disconnect();projects.forEach(p=>p.classList.remove('is-entering'));};
}
export function responsiveScene(allowScroll) {
  const section=document.querySelector('#responsive'),canvas=section.querySelector('.responsive-canvas'),controls=section.querySelector('.responsive-controls'),buttons=[...controls.querySelectorAll('button')];
  controls.hidden=false;let manual=false,last='';
  function setSize(size){if(last===size)return;last=size;reflow(canvas,()=>{canvas.classList.toggle('is-mobile',size==='mobile');canvas.classList.toggle('is-tablet',size==='tablet');});buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.size===size)));}
  const click=e=>{const button=e.target.closest('button');if(button){manual=true;setSize(button.dataset.size);}};
  controls.addEventListener('click',click);
  const cleanup=allowScroll?scrollScene(section,(p)=>{if(!manual)setSize(p<.25?'desktop':p<.55?'tablet':'mobile');}):()=>{};
  return ()=>{cleanup();controls.removeEventListener('click',click);canvas.classList.remove('is-mobile','is-tablet');};
}
