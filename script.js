"use strict";
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const header = document.querySelector(".header");
const progress = document.querySelector(".progress");
let ticking = false;
function updateScroll(){
 const y = window.scrollY;
 header.classList.toggle("scrolled", y > 60);
 const total = document.documentElement.scrollHeight - innerHeight;
 progress.style.width = `${total > 0 ? y / total * 100 : 0}%`;
 ticking = false;
}
addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(updateScroll);}}, {passive:true});
updateScroll();
if("IntersectionObserver" in window && !reduced){
 document.documentElement.classList.add("js");
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}}),{threshold:.08});
 document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
}
const toggle=document.querySelector(".menu-toggle");
const dialog=document.querySelector(".navigation");
let savedScroll=0;
function closeMenu(){if(dialog.open)dialog.close();}
function restoreMenu(){
 toggle.setAttribute("aria-expanded","false");
 header.classList.remove("menu-open");
 document.body.style.overflow="";
 toggle.focus({preventScroll:true});
}
toggle.addEventListener("click",()=>{
 if(dialog.open){closeMenu();return;}
 savedScroll=scrollY;
 dialog.showModal();
 toggle.setAttribute("aria-expanded","true");
 header.classList.add("menu-open");
 document.body.style.overflow="hidden";
});
dialog.addEventListener("close",restoreMenu);
dialog.addEventListener("keydown",e=>{
 if(e.key==="Escape"){e.preventDefault();closeMenu();}
});
dialog.querySelectorAll("a").forEach(a=>a.addEventListener("click",e=>{
 e.preventDefault();const target=document.querySelector(a.getAttribute("href"));
 closeMenu();target.scrollIntoView({behavior:reduced?"instant":"smooth"});
 history.replaceState(null,"",a.getAttribute("href"));
}));
// The modal top layer needs its own accessible close control.
const close=document.createElement("button");
close.className="modal-close";close.type="button";
close.setAttribute("aria-label","Cerrar menú");close.innerHTML='<span>CERRAR</span><span aria-hidden="true">×</span>';
dialog.prepend(close);close.addEventListener("click",closeMenu);
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectTab(tab,focus=false){
 tabs.forEach(t=>{const active=t===tab;t.setAttribute("aria-selected",String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute("aria-controls")).hidden=!active;});
 if(focus)tab.focus();
}
tabs.forEach((tab,i)=>{
 tab.addEventListener("click",()=>selectTab(tab));
 tab.addEventListener("keydown",e=>{
 let next;if(e.key==="ArrowRight")next=(i+1)%tabs.length;if(e.key==="ArrowLeft")next=(i+tabs.length-1)%tabs.length;if(e.key==="Home")next=0;if(e.key==="End")next=tabs.length-1;
 if(next!==undefined){e.preventDefault();selectTab(tabs[next],true);}
 });
});
const wedding=new Date("2027-09-12T16:30:00+02:00").getTime();
function countdown(){const d=Math.max(0,wedding-Date.now());document.querySelector('[data-days]').textContent=Math.floor(d/86400000);document.querySelector('[data-hours]').textContent=String(Math.floor(d/3600000)%24).padStart(2,"0");document.querySelector('[data-minutes]').textContent=String(Math.floor(d/60000)%60).padStart(2,"0");}
countdown();setInterval(countdown,30000);
const form=document.getElementById("rsvp-form");
form.addEventListener("submit",e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const data=new FormData(form);const first=String(data.get("name")).trim().split(/\s+/)[0];
 document.getElementById("form-status").textContent=data.get("attendance")==="yes"?`¡Qué ilusión, ${first}! Así se vería tu confirmación para ${data.get("guests")} persona(s). Es una demostración: no se ha enviado ninguna respuesta.`:`Gracias, ${first}. Esta es una respuesta de demostración; no se ha enviado ningún dato.`;
});
