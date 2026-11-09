"use strict";
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const header=document.querySelector("header");
function scrollState(){header.classList.toggle("scrolled",scrollY>60);}addEventListener("scroll",scrollState,{passive:true});scrollState();
if("IntersectionObserver" in window&&!reduced){document.documentElement.classList.add("js");const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));}
const dialog=document.getElementById("nav"),open=document.getElementById("open-menu");
open.addEventListener("click",()=>{dialog.showModal();open.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";});
document.getElementById("close-menu").addEventListener("click",()=>dialog.close());
dialog.addEventListener("close",()=>{open.setAttribute("aria-expanded","false");document.body.style.overflow="";open.focus({preventScroll:true});});
dialog.querySelectorAll("a").forEach(a=>a.addEventListener("click",e=>{e.preventDefault();dialog.close();document.querySelector(a.getAttribute("href")).scrollIntoView({behavior:reduced?"instant":"smooth"});history.replaceState(null,"",a.getAttribute("href"));}));
const tabs=[...document.querySelectorAll('[role="tab"]')];
function activate(tab,focus=false){tabs.forEach(t=>{const active=t===tab;t.setAttribute("aria-selected",String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute("aria-controls")).hidden=!active;});if(focus)tab.focus();}
tabs.forEach((t,i)=>{t.addEventListener("click",()=>activate(t));t.addEventListener("keydown",e=>{let n;if(e.key==="ArrowRight")n=(i+1)%tabs.length;if(e.key==="ArrowLeft")n=(i+tabs.length-1)%tabs.length;if(e.key==="Home")n=0;if(e.key==="End")n=tabs.length-1;if(n!==undefined){e.preventDefault();activate(tabs[n],true);}});});
const date=new Date("2027-09-12T16:30:00+02:00").getTime();function count(){let d=Math.max(0,date-Date.now());document.querySelector('[data-days]').textContent=Math.floor(d/86400000);document.querySelector('[data-hours]').textContent=String(Math.floor(d/3600000)%24).padStart(2,"0");document.querySelector('[data-minutes]').textContent=String(Math.floor(d/60000)%60).padStart(2,"0");}count();setInterval(count,30000);
document.querySelector("form").addEventListener("submit",e=>{e.preventDefault();const form=e.currentTarget;if(!form.reportValidity())return;const data=new FormData(form),name=String(data.get("name")).trim().split(/\s+/)[0];document.getElementById("status").textContent=data.get("attendance")==="yes"?`¡Qué ilusión, ${name}! Así se vería tu respuesta para ${data.get("guests")} persona(s). Es una demostración: no se ha enviado ningún dato.`:`Gracias, ${name}. Esta es una respuesta de demostración; no se han enviado datos.`;});
