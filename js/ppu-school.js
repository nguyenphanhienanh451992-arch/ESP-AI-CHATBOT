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
