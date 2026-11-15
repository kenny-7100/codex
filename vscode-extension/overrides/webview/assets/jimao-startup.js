// Keep the original image node (and animation phase) through empty React commits
// and successive full-page provider fallbacks. Retire it permanently at content,
// including login and error screens; subsequent route loads use their own UI.
(() => {
  const startup = document.getElementById('jimao-startup');
  const root = document.getElementById('root');
  if (!startup || !root) return;
  const observer = new MutationObserver(check);
  function check() {
    if (root.querySelector('.jimao-loading-avatar')) return;
    if (!root.textContent.trim() && !root.querySelector('input, textarea, [contenteditable], button, a[href], [role=alert]')) return;
    startup.remove();
    observer.disconnect();
  }
  observer.observe(root, { childList: true, subtree: true });
  check();
})();
