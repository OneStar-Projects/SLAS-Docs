/*
 * 右側目錄的收合開關。
 *
 * Material 沒有內建這個功能。右側目錄是 .md-sidebar--secondary，
 * 它是 .md-main__inner 的 flex 項目，display:none 之後正文會自動補滿寬度，
 * 不需要另外調版面。
 *
 * 收合狀態存在 localStorage，換頁與重新整理都保留。
 * 開了 navigation.instant，換頁不重跑 DOMContentLoaded，所以用輪詢補掛。
 */
(function () {
  var KEY = 'slasdocs-toc-hidden';
  var hidden = localStorage.getItem(KEY) === '1';

  var ICON_HIDE = 'M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z';   // →
  var ICON_SHOW = 'M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6z'; // ←

  function svg(d) {
    return '<svg viewBox="0 0 24 24" width="18" height="18">'
         + '<path fill="currentColor" d="' + d + '"/></svg>';
  }

  function apply(toc, handle, btn) {
    if (toc) toc.style.display = hidden ? 'none' : '';
    if (handle) handle.style.display = hidden ? 'flex' : 'none';
    if (btn) {
      btn.innerHTML = svg(ICON_HIDE);
      btn.title = '收起目錄';
    }
  }

  function mount() {
    var toc = document.querySelector('.md-sidebar--secondary');
    // 寬度不足時 Material 本來就不顯示右側目錄，不要多畫一個把手出來
    if (!toc || window.innerWidth < 1220) return;

    var inner = toc.querySelector('.md-sidebar__inner') || toc;
    var btn = toc.querySelector('.toc-toggle-btn');
    var handle = document.querySelector('.toc-toggle-handle');

    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toc-toggle-btn';
      btn.style.cssText = 'display:flex;align-items:center;gap:4px;margin:.4rem 0 .2rem auto;'
        + 'padding:2px 6px;border:1px solid var(--md-default-fg-color--lightest);'
        + 'border-radius:4px;background:transparent;color:var(--md-default-fg-color--light);'
        + 'font-size:.6rem;cursor:pointer;';
      btn.addEventListener('click', function () {
        hidden = true;
        localStorage.setItem(KEY, '1');
        apply(toc, handle, btn);
      });
      inner.insertBefore(btn, inner.firstChild);
    }

    if (!handle) {
      handle = document.createElement('button');
      handle.type = 'button';
      handle.className = 'toc-toggle-handle';
      handle.title = '顯示目錄';
      handle.innerHTML = svg(ICON_SHOW);
      handle.style.cssText = 'position:fixed;top:50%;right:0;transform:translateY(-50%);'
        + 'z-index:5;display:none;align-items:center;justify-content:center;'
        + 'width:22px;height:48px;padding:0;border:1px solid var(--md-default-fg-color--lightest);'
        + 'border-right:0;border-radius:4px 0 0 4px;background:var(--md-default-bg-color);'
        + 'color:var(--md-default-fg-color--light);cursor:pointer;'
        + 'box-shadow:-1px 0 3px rgba(0,0,0,.08);';
      handle.addEventListener('click', function () {
        hidden = false;
        localStorage.setItem(KEY, '0');
        apply(document.querySelector('.md-sidebar--secondary'), handle,
              document.querySelector('.toc-toggle-btn'));
      });
      document.body.appendChild(handle);
    }

    btn.innerHTML = svg(ICON_HIDE);
    btn.title = '收起目錄';
    apply(toc, handle, btn);
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(mount);
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
  setInterval(mount, 800);   // 換頁或延遲渲染都補得上
  mount();
})();
