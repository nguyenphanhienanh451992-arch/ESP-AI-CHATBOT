/* Student progress sync: only sends events created AFTER login, never retroactively attributes anonymous browsing. */
(()=>{'use strict';
 const AUTH_KEY='esp_student_session_v1',LOCAL_KEY='esp_ai_learning_progress_v1';
 const api=()=>String(window.ESP_STUDENT_API_URL||'').replace(/\/+$/,'');
 const ready=()=>api().startsWith('https://')&&!api().includes('YOUR-ESP-');
 const session=()=>{try{const s=JSON.parse(localStorage.getItem(AUTH_KEY)||'null');return s&&s.token&&s.student?s:null;}catch{return null;}};
 const saveSession=(s)=>{localStorage.setItem(AUTH_KEY,JSON.stringify({...s,loginTime:new Date().toISOString()}));window.dispatchEvent(new Event('esp-student-session'));};
 const logoutLocal=()=>{localStorage.removeItem(AUTH_KEY);window.dispatchEvent(new Event('esp-student-session'));};
 async function request(action,data={},useToken=true,override=''){
   if(!ready())throw Error('Chưa cấu hình ESP_STUDENT_API_URL trong js/student-api-config.js');
   const tok=override||(useToken?session()?.token:'');
   const r=await fetch(api()+'/student/api',{method:'POST',headers:{'Content-Type':'application/json',...(tok?{'Authorization':'Bearer '+tok}:{})},body:JSON.stringify({action,data}),cache:'no-store'});
   const result=await r.json().catch(()=>({ok:false,error:'Phản hồi không hợp lệ'}));
   if(!r.ok||!result.ok){if(r.status===401&&useToken&&!override)logoutLocal();throw Error(result.error||'HTTP '+r.status);}
   return result.data;
 }
 async function login(code,password){const result=await request('student.login',{code,password},false);saveSession(result);await sync();return result;}
 async function logout(){const tok=session()?.token;logoutLocal();if(tok)try{await request('student.logout',{},false,tok);}catch{}}
 let busy=false;
 async function sync(){if(busy||!session()||!ready())return {accepted:0};busy=true;let total=0;
   try{
     const owner=session()?.student?.id;const since=Date.parse(session()?.loginTime||'');
     let log;try{log=JSON.parse(localStorage.getItem(LOCAL_KEY)||'{}');}catch{log={};}
     const ev=(Array.isArray(log.events)?log.events:[]).filter(e=>e.id&&Date.parse(e.time)>=since&&!e.syncedBy?.includes(owner));
     for(let i=0;i<ev.length;i+=60){const batch=ev.slice(i,i+60);const d=await request('student.recordEvents',{events:batch});total+=d.accepted||0;
       for(const e of batch)e.syncedBy=[...(e.syncedBy||[]),owner];
       try{localStorage.setItem(LOCAL_KEY,JSON.stringify(log));}catch{}
     }
     return {accepted:total};
   }finally{busy=false;}
 }
 window.ESPStudent={ready,session,login,logout,request,sync};
 window.addEventListener('esp-learning-updated',()=>{if(session())sync().catch(()=>{});});
 window.addEventListener('online',()=>{if(session())sync().catch(()=>{});});
 if(session())setTimeout(()=>sync().catch(()=>{}),1500);
})();
