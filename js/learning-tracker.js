/* ESP AI Chatbot: local activity tracker (v1). Does NOT submit personal data to a server. */
(()=>{'use strict';
 const KEY='esp_ai_learning_progress_v1',MAX_EVENTS=2000,DAYZONE='Asia/Ho_Chi_Minh';
 const allowed=new Set(['lookup','flashcard','practice_generated','practice_reply','study_minute']);
 const now=()=>new Date().toISOString();
 const day=(iso)=>{try{return new Intl.DateTimeFormat('en-CA',{timeZone:DAYZONE,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));}catch{return String(iso).slice(0,10);}};
 const read=()=>{try{const o=JSON.parse(localStorage.getItem(KEY)||'{}');return Array.isArray(o.events)?o:{version:1,events:[]};}catch{return {version:1,events:[]};}};
 const emit=(type,label='')=>{if(!allowed.has(type))return false;const obj=read();const clean=String(label).trim().slice(0,120);obj.events.push({id:crypto.randomUUID(),type,label:clean,time:now()});if(obj.events.length>MAX_EVENTS)obj.events=obj.events.slice(-MAX_EVENTS);try{localStorage.setItem(KEY,JSON.stringify(obj));window.dispatchEvent(new CustomEvent('esp-learning-updated'));return true;}catch{return false;}};
 let lastActivity=Date.now(),lastMinute=Date.now();
 ['pointerdown','keydown','scroll','touchstart'].forEach(name=>window.addEventListener(name,()=>{lastActivity=Date.now();},{passive:true}));
 // Only count full minutes when the tab is visible and recently used; never treat a background tab as study.
 setInterval(()=>{const t=Date.now();const elapsed=t-lastMinute;lastMinute=t;if(!document.hidden&&t-lastActivity<120000&&elapsed>=45000&&elapsed<90000)emit('study_minute');},60000);
 const get=(id)=>document.getElementById(id);
 function watchMeaning(){let recorded='';const check=()=>{const page=get('page'),word=get('word');if(!page||page.hidden||page.hasAttribute('hidden')||!word)return;const w=word.textContent.trim();if(w&&w.length<=120&&w!==recorded){recorded=w;emit('lookup',w);}};const page=get('page');if(page){new MutationObserver(check).observe(page,{attributes:true,attributeFilter:['hidden','style','class']});}const word=get('word');if(word)new MutationObserver(check).observe(word,{childList:true,subtree:true,characterData:true});}
 function watchFlashcard(){const study=get('study');let last='';const check=()=>{if(!study||study.hidden||study.hasAttribute('hidden'))return;const word=get('word')?.textContent?.trim()||'';if(word&&word!==last){last=word;emit('flashcard',word);}};if(study)new MutationObserver(check).observe(study,{attributes:true,attributeFilter:['hidden','style','class']});const word=get('word');if(word)new MutationObserver(check).observe(word,{childList:true,subtree:true,characterData:true});}
 function watchPractice(){const box=get('practiceOutputBox'),content=get('practiceContent');let last='';const check=()=>{if(!box||box.hidden||box.hasAttribute('hidden'))return;const raw=content?.textContent?.trim()||'';if(raw.length<80||/^(loading|đang tạo|generating)/i.test(raw))return;const label=(get('practiceTopic')?.value||'Practice').trim().slice(0,120);const token=label+'|'+raw.slice(0,300);if(token===last)return;last=token;emit('practice_generated',label);};if(content)new MutationObserver(check).observe(content,{childList:true,subtree:true,characterData:true});if(box)new MutationObserver(check).observe(box,{attributes:true,attributeFilter:['hidden','style','class']});}
 window.ESPLearningTracker={read,emit,day,storageKey:KEY};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{watchMeaning();watchFlashcard();watchPractice();});else{watchMeaning();watchFlashcard();watchPractice();}
})();
