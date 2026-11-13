/* ESP AI Chatbot — bridge generated Practice result to standalone exercise page.
 * Only installed in components/practice-pages/*.html.
 * Keeps original exercise page UI as a sample below, presents Dify result first.
 */
(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  const resultId = params.get('practice_result');
  if (!resultId || !/^p[a-z0-9]{8,40}$/i.test(resultId)) return;
  const key = 'esp_practice_result_' + resultId;
  let item;
  try {
    item = JSON.parse(localStorage.getItem(key) || 'null');
  } catch (_) { item = null; }
  if (!item || typeof item.answer !== 'string' || !item.answer.trim()) return;
  // Expire generated data after 6 hours to reduce persistence.
  if (!Number.isFinite(item.createdAt) || Date.now() - item.createdAt > 21600000) {
    try { localStorage.removeItem(key); } catch (_) {}
    return;
  }
  // Remove storage after loading, so generated answers are not permanently stored.
  try { localStorage.removeItem(key); } catch (_) {}
  const panel = document.createElement('section');
  panel.id = 'esp-dify-result';
  panel.style.cssText = 'position:relative;z-index:9999;box-sizing:border-box;margin:0 auto 20px;padding:22px;max-width:1300px;background:#f0fcf7;border:2px solid #158369;border-radius:16px;color:#14352e;font:16px/1.6 system-ui,Arial,sans-serif;overflow-wrap:anywhere';
  const heading = document.createElement('h2');
  heading.textContent = 'Bài tập vừa được AI tạo / AI-generated exercises';
  heading.style.cssText = 'margin:0 0 6px;font-size:clamp(20px,3vw,29px);color:#006b56';
  panel.appendChild(heading);
  const details = document.createElement('p');
  details.style.cssText = 'font-size:13px;margin:0 0 12px;color:#40675c';
  details.textContent = [item.topic && 'Chủ đề: ' + item.topic, item.words && 'Từ vựng: ' + item.words].filter(Boolean).join(' · ');
  panel.appendChild(details);
  const output = document.createElement('div');
  output.style.cssText = 'padding:16px;background:white;border-radius:12px;border:1px solid #c4ded5;white-space:normal';
  function render(answer) {
    let text = String(answer || '');
    try {
      const parsed = JSON.parse(text.replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/i,''));
      if (parsed && typeof parsed.display_text === 'string') text = parsed.display_text;
    } catch (_) {}
    if (window.marked && window.DOMPurify) output.innerHTML = DOMPurify.sanitize(marked.parse(text));
    else output.textContent = text;
  }
  render(item.answer);
  panel.appendChild(output);
  const form = document.createElement('div');
  form.style.cssText = 'display:flex;flex-wrap:wrap;gap:10px;margin-top:14px';
  const input = document.createElement('textarea');
  input.rows = 2;
  input.placeholder = 'Nhập câu trả lời của bạn để AI kiểm tra...';
  input.style.cssText = 'box-sizing:border-box;flex:1;min-width:240px;padding:10px;border:1px solid #91bdb1;border-radius:8px;font:inherit';
  const submit = document.createElement('button');
  submit.type = 'button'; submit.textContent = 'Gửi câu trả lời cho AI';
  submit.style.cssText = 'padding:10px 16px;border:0;border-radius:8px;background:#006b56;color:white;font:700 15px system-ui;cursor:pointer';
  const status = document.createElement('p');status.style.cssText = 'font-size:13px;margin:8px 0;color:#006b56';
  form.append(input, submit);
  panel.append(form, status);
  submit.onclick = function () {
    const message = input.value.trim();
    if (!message) {status.textContent = 'Vui lòng nhập câu trả lời.';return;}
    if (!item.sessionToken) {status.textContent = 'Không có phiên Dify để gửi câu trả lời.';return;}
    if (!window.google?.script?.run) {status.textContent = 'Cầu nối API chưa hoạt động trên trang này.';return;}
    submit.disabled = true;
    status.textContent = 'Đang nhận phản hồi từ Dify...';
    google.script.run.withSuccessHandler(function (res) {
      submit.disabled = false;
      if (res && typeof res.answer === 'string') {render(res.answer);input.value='';status.textContent='Đã nhận phản hồi từ AI.';}
      else status.textContent = 'Dify chưa trả nội dung.';
    }).withFailureHandler(function (error) {
      submit.disabled = false;
      status.textContent = 'Lỗi: ' + String(error && error.message || error);
    }).replyPractice({message:message,sessionToken:item.sessionToken});
  };
  const note = document.createElement('p');
  note.textContent = 'Phần bên dưới là giao diện bài mẫu gốc của trang này; nội dung AI vừa tạo được hiển thị ở khung trên, chưa tự điền vào từng câu hỏi mẫu.';
  note.style.cssText = 'font-size:13px;color:#61756c;margin:12px 0 0';
  panel.appendChild(note);
  // Head of body; before the fixed question content.
  const insert = () => {
    document.body.insertBefore(panel, document.body.firstChild);
    if (window.parent !== window) window.parent.postMessage({type:'ESP_PRACTICE_HEIGHT',height:Math.ceil(document.documentElement.scrollHeight)},location.origin);
  };
  if (document.body) insert();
  else document.addEventListener('DOMContentLoaded',insert,{once:true});
})();
