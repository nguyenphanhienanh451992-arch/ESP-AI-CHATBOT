/* Shared navbar. Relative links resolved from the repository root; no tokens are read/stored. */
(()=>{'use strict';
const base=new URL('../',document.currentScript.src);
const paths={home:'index.html',hub:'portal.html',assistant:'assistant.html',meaning:'components/meaning.html',flashcard:'components/flashcard.html',practice:'components/practice.html',studentProgress:'student-progress.html',studentAssignments:'student-assignments.html',teacherDashboard:'teacher-dashboard.html',teacherStudents:'teacher-students.html',teacherAssignments:'teacher-assignments.html',teacherReview:'teacher.html',admin:'admin.html'};
const target=k=>new URL(paths[k],base).href;
function create(){if(document.getElementById('esp-nav'))return;
  const nav=document.createElement('nav');nav.id='esp-nav';nav.setAttribute('aria-label','Điều hướng ESP AI');
  const inner=document.createElement('div');inner.className='esp-nav-inner';nav.append(inner);
  const brand=document.createElement('a');brand.className='esp-brand';brand.href=target('hub');brand.textContent='ESP AI · Trung tâm';inner.append(brand);
  const menu=document.createElement('div');menu.className='esp-menu';inner.append(menu);
  function link(parent,k,label,klass){const a=document.createElement('a');a.href=target(k);a.textContent=label;if(klass)a.className=klass;if(location.pathname===new URL(a.href).pathname)a.classList.add('esp-active');parent.append(a);return a;}
  function dropdown(title,items){const d=document.createElement('details'),s=document.createElement('summary');s.textContent=title+' ▾';d.append(s);const wrap=document.createElement('div');wrap.className='esp-dropdown';for(const [k,label] of items)link(wrap,k,label);d.append(wrap);menu.append(d);d.addEventListener('toggle',()=>{if(d.open){for(const other of menu.querySelectorAll('details'))if(other!==d)other.open=false;}});}
  link(menu,'hub','Tổng quan');
  dropdown('Học tập',[['assistant','Trợ lý AI'],['meaning','Tra nghĩa từ'],['flashcard','Flashcard'],['practice','Luyện tập']]);
  dropdown('Học viên',[['studentProgress','Tiến độ học tập'],['studentAssignments','Bài tập được giao']]);
  dropdown('Giảng viên',[['teacherDashboard','Dashboard'],['teacherStudents','Quản lý học viên'],['teacherAssignments','Giao bài & ngân hàng câu hỏi'],['teacherReview','Duyệt học liệu']]);
  link(menu,'home','Trang chủ','esp-home');
  document.body.insertBefore(nav,document.body.firstChild);
  document.addEventListener('click',e=>{if(!nav.contains(e.target))for(const d of nav.querySelectorAll('details'))d.open=false;});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')for(const d of nav.querySelectorAll('details'))d.open=false;});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',create,{once:true});else create();
})();
