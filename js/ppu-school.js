(()=>{
  'use strict';
  const buttons=[...document.querySelectorAll('[data-set-lang]')];
  function setLanguage(lang){
    const next=lang==='en'?'en':'vi';
    document.documentElement.lang=next;
    document.body.classList.toggle('english',next==='en');
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.setLang===next)));
    try{sessionStorage.setItem('ppu-school-language',next)}catch(_e){}
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.setLang)));
  let saved='vi';try{saved=sessionStorage.getItem('ppu-school-language')||'vi'}catch(_e){}
  setLanguage(saved);
})();

// Independent accessible gallery. Language buttons continue to use the existing school switch.
(()=>{
 'use strict';
 const root=document.querySelector('#future-slider');
 if(!root)return;
 const slides=[...root.querySelectorAll('.future-slide')];
 const dots=[...document.querySelectorAll('.future-dot')];
 let index=0,timer;
 function show(n){index=(n+slides.length)%slides.length;
  slides.forEach((s,i)=>{const active=i===index;s.classList.toggle('is-active',active);s.setAttribute('aria-hidden',String(!active));});
  dots.forEach((d,i)=>{const active=i===index;d.classList.toggle('is-active',active);if(active)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current');});
 }
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function pause(){clearInterval(timer);timer=null;}
 function play(){pause();if(!reduce&&!document.hidden)timer=setInterval(()=>show(index+1),5000);}
 dots.forEach(d=>d.addEventListener('click',()=>{show(Number(d.dataset.slideIndex));play();}));
 document.querySelectorAll('[data-slide-step]').forEach(b=>b.addEventListener('click',()=>{show(index+Number(b.dataset.slideStep));play();}));
 root.parentElement.addEventListener('mouseenter',pause);
 root.parentElement.addEventListener('mouseleave',play);
 root.parentElement.addEventListener('focusin',pause);
 root.parentElement.addEventListener('focusout',e=>{if(!root.parentElement.contains(e.relatedTarget))play();});
 document.addEventListener('visibilitychange',()=>document.hidden?pause():play());
 document.querySelectorAll('[data-toggle-school-language]').forEach(b=>b.addEventListener('click',()=>{
  const en=document.body.classList.contains('english');
  const next=document.querySelector('[data-set-lang="'+(en?'vi':'en')+'"]');if(next)next.click();
 }));
 show(0);play();
})();
