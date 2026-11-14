/* ESP AI Chatbot — reusable Back button (GitHub Pages; no API dependencies) */
(function () {
  'use strict';
  function init() {
    if (document.getElementById('esp-back-button')) return;
    var path = window.location.pathname;
    var inPracticeResult = /\/components\/practice-pages\/[^/]+\.html$/i.test(path);
    var inComponent = /\/components\/[^/]+\.html$/i.test(path);
    var root = path.split('/components/')[0];
    if (!inComponent) root = path.replace(/\/[^/]*$/, '');
    root = (root || '') + '/';

    var style = document.createElement('style');
    style.textContent = '\n#esp-back-button{position:fixed!important;top:14px;left:14px;z-index:2147483000;display:inline-flex;align-items:center;gap:8px;padding:10px 15px;background:rgba(255,255,255,.97);color:#0d4658;border:1px solid #a4d8dc;border-radius:999px;box-shadow:0 3px 16px rgba(0,55,71,.15);font:600 14px/1.2 system-ui,-apple-system,Segoe UI,Arial,sans-serif;cursor:pointer;transition:background .15s,transform .15s}#esp-back-button:hover{background:#dff7f5;transform:translateY(-1px)}#esp-back-button:focus-visible{outline:3px solid #139a9e;outline-offset:3px}@media(max-width:600px){#esp-back-button{top:9px;left:9px;padding:9px 12px;font-size:13px}}@media print{#esp-back-button{display:none!important}}';
    document.head.appendChild(style);

    var button = document.createElement('button');
    button.type = 'button';
    button.id = 'esp-back-button';
    button.setAttribute('aria-label', 'Quay lại trang trước');
    button.title = 'Quay lại';
    button.textContent = '← Quay lại';
    button.addEventListener('click', function () {
      var fallback = new URL(inPracticeResult ? '../practice.html' : root + 'index.html', window.location.href);
      var destination = fallback;
      try {
        if (document.referrer) {
          var previous = new URL(document.referrer);
          var sameSite = previous.origin === window.location.origin;
          var inApp = previous.pathname.startsWith(root);
          var differentPage = previous.pathname !== window.location.pathname || previous.search !== window.location.search;
          if (sameSite && inApp && differentPage) destination = previous;
        }
      } catch (_) { /* Use fallback */ }
      // Within an iframe, result pages should go back to Practice inside the frame.
      // Main components should return to the main application, not nest index.html in an iframe.
      if (window.top !== window.self && !inPracticeResult) {
        try { window.top.location.assign(destination.href); }
        catch (_) { window.location.assign(fallback.href); }
      } else {
        window.location.assign(destination.href);
      }
    });
    document.body.appendChild(button);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
