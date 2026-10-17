/*
 * 流程圖檢視工具列：放大／縮小／重設／全螢幕 + 拖曳平移。
 *
 * 這一版刻意做成完全自包含，因為前幾版在實機上都沒出現按鈕，逐一排除：
 *   - 不依賴 svg-pan-zoom：縮放改用 CSS transform，少一個載入失敗點
 *   - 不依賴 Material 的 document$：改用輪詢，開了 navigation.instant 也能接上
 *   - 不碰 wheel：macOS 的捏合是 ctrl+wheel，會被瀏覽器自身的頁面縮放攔走
 *   - 關鍵樣式寫成 inline：避免外部 CSS 沒載入或被主題覆蓋時按鈕看不見
 *
 * 排查：Console 會輸出 [mermaid-zoom]；window.__mermaidZoom 可看狀態。
 */
(function () {
  var TAG = '[mermaid-zoom]';
  var P = {
    zoomIn:  'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14m2.5-4h-2v2H9v-2H7V9h2V7h1v2h2z',
    zoomOut: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14M7 9h5v1H7z',
    reset:   'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8',
    full:    'M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z',
    exit:    'M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z'
  };
  var count = 0;

  function mkBtn(d, title, fn) {
    var b = document.createElement('button');
    b.type = 'button';
    b.title = title;
    b.setAttribute('aria-label', title);
    b.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;'
      + 'width:28px;height:28px;padding:0;margin:0;border:1px solid rgba(128,128,128,.35);'
      + 'border-radius:4px;background:#fff;color:#333;cursor:pointer;line-height:0;';
    b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="' + d + '"/></svg>';
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
    return b;
  }

  function setup(svg) {
    if (svg.dataset.mzoom) return false;
    var box = svg.parentElement;
    while (box && !(box.classList && box.classList.contains('mermaid'))) box = box.parentElement;
    if (!box) box = svg.parentElement;           // 退而求其次，至少掛得上
    if (!box) return false;

    svg.dataset.mzoom = '1';
    box.style.position = 'relative';
    box.style.overflow = 'hidden';

    var scale = 1, tx = 0, ty = 0;
    function apply() {
      svg.style.transformOrigin = '0 0';
      svg.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    }
    function zoom(f) { scale = Math.min(20, Math.max(0.2, scale * f)); apply(); }

    // 拖曳平移
    svg.style.cursor = 'grab';
    var dragging = false, sx = 0, sy = 0;
    svg.addEventListener('mousedown', function (e) {
      dragging = true; sx = e.clientX - tx; sy = e.clientY - ty;
      svg.style.cursor = 'grabbing'; e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      tx = e.clientX - sx; ty = e.clientY - sy; apply();
    });
    window.addEventListener('mouseup', function () {
      dragging = false; svg.style.cursor = 'grab';
    });

    var bar = document.createElement('div');
    bar.className = 'mzoom-bar';
    bar.style.cssText = 'position:absolute;top:8px;right:8px;display:flex;gap:4px;'
      + 'padding:4px;border-radius:6px;background:rgba(255,255,255,.92);'
      + 'box-shadow:0 1px 4px rgba(0,0,0,.2);z-index:10;';

    bar.appendChild(mkBtn(P.zoomIn,  '放大', function () { zoom(1.3); }));
    bar.appendChild(mkBtn(P.zoomOut, '縮小', function () { zoom(1 / 1.3); }));
    bar.appendChild(mkBtn(P.reset,   '重設', function () { scale = 1; tx = 0; ty = 0; apply(); }));

    var fb = mkBtn(P.full, '全螢幕', function (b) {
      if (document.fullscreenElement === box) {
        document.exitFullscreen();
      } else if (box.requestFullscreen) {
        box.requestFullscreen().catch(function (e) { console.warn(TAG, '全螢幕失敗', e); });
      }
    });
    bar.appendChild(fb);
    box.appendChild(bar);

    document.addEventListener('fullscreenchange', function () {
      var on = document.fullscreenElement === box;
      fb.title = on ? '結束全螢幕' : '全螢幕';
      fb.querySelector('path').setAttribute('d', on ? P.exit : P.full);
      box.style.background = on ? '#fff' : '';
      scale = 1; tx = 0; ty = 0; apply();
    });

    count++;
    return true;
  }

  function scan() {
    var n = 0;
    document.querySelectorAll('.mermaid svg, svg[id^="mermaid"], svg[id^="mmd"]')
      .forEach(function (s) { if (setup(s)) n++; });
    if (n) console.info(TAG, '已加上工具列：' + n + ' 張（累計 ' + count + '）');
  }

  // 不依賴 document$：持續輪詢，換頁與延遲渲染都能接上
  var ticks = 0;
  setInterval(function () { ticks++; scan(); }, 500);
  scan();
  document.addEventListener('DOMContentLoaded', scan);
  window.addEventListener('load', scan);

  window.__mermaidZoom = {
    rescan: scan,
    get info() {
      return {
        圖塊數: document.querySelectorAll('.mermaid').length,
        已處理: count,
        已輪詢: ticks
      };
    }
  };
  console.info(TAG, '腳本已載入');
})();
