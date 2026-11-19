/* Portal interactions only. Does not touch D1, authentication or Worker. */
(() => {
 'use strict';
 const button=document.getElementById('menuBtn');
 const menu=document.getElementById('mainNav');
 if(button&&menu){
   button.addEventListener('click',()=>{const open=menu.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Đóng menu':'Mở menu');});
   menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('open');button.setAttribute('aria-expanded','false');}));
   document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.classList.remove('open');button.setAttribute('aria-expanded','false');}});
 }
 // Only display a remote/local photo if it loads. Missing files keep attractive placeholders.
 document.querySelectorAll('[data-image]').forEach(el=>{
   const path=el.getAttribute('data-image');if(!path)return;
   const img=new Image();
   img.onload=()=>{el.style.backgroundImage='url("'+path.replace(/"/g,'%22')+'")';el.classList.add('has-image');};
   img.onerror=()=>{};
   img.src=path;
 });
 const search=document.getElementById('pageSearch');
 const result=document.getElementById('searchResults');
 const links=Array.from(document.querySelectorAll('#allLinks a'));
 if(search&&result){
   search.addEventListener('input',()=>{
     const q=search.value.trim().toLocaleLowerCase('vi');let n=0;
     for(const a of links){const label=(a.textContent+' '+(a.dataset.label||'')).toLocaleLowerCase('vi');const match=!q||label.includes(q);a.hidden=!match;if(match)n++;}
     result.textContent=q?(n?'Tìm thấy '+n+' trang phù hợp.':'Không tìm thấy trang phù hợp.'):'Tổng cộng '+links.length+' đường dẫn.';
   });
   result.textContent='Tổng cộng '+links.length+' đường dẫn.';
 }
})();
