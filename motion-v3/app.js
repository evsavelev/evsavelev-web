import {heroScene,processScene,portfolioScene,responsiveScene} from './scenes.js';
import {initContact} from './contact.js';
document.documentElement.classList.add('js');
const header=document.querySelector('.header'),menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#navigation');
const mobile=matchMedia('(max-width:767px)'),full=matchMedia('(min-width:1024px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)');
function closeMenu(){nav.hidden=mobile.matches;menu.setAttribute('aria-expanded','false');}
function menuMode(){menu.hidden=!mobile.matches;closeMenu();}
menuMode();mobile.addEventListener('change',menuMode);
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';nav.hidden=open;menu.setAttribute('aria-expanded',String(!open));});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
let ticking=false;
function headerScroll(){if(ticking)return;ticking=true;requestAnimationFrame(()=>{header.classList.toggle('is-scrolled',scrollY>100);ticking=false;});}
addEventListener('scroll',headerScroll,{passive:true});headerScroll();
const services=[...document.querySelectorAll('.service')];
function openService(item){services.forEach(s=>s.open=s===item);}
services.forEach(item=>{
 item.querySelector('summary').addEventListener('pointerenter',()=>{if(fine.matches&&!mobile.matches)openService(item);});
 item.querySelector('summary').addEventListener('focus',()=>{if(!mobile.matches)openService(item);});
 item.addEventListener('toggle',()=>{if(item.open)services.filter(s=>s!==item).forEach(s=>s.open=false);});
});
initContact();
let cleanup=[];
function configureMotion(){
 cleanup.forEach(fn=>fn());cleanup=[];
 const enabled=!reduce.matches;
 document.body.classList.toggle('motion-ready',enabled&&full.matches);
 if(enabled){cleanup.push(heroScene());if(full.matches)cleanup.push(processScene(),portfolioScene());}
 cleanup.push(responsiveScene(enabled&&full.matches));
}
configureMotion();full.addEventListener('change',configureMotion);reduce.addEventListener('change',configureMotion);
addEventListener('pagehide',()=>{cleanup.forEach(fn=>fn());cleanup=[];});
addEventListener('pageshow',e=>{if(e.persisted)configureMotion();});
