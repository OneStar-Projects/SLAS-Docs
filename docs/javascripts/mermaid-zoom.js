/*
 * 流程圖工具列：放大／縮小／重設／全螢幕 + 拖曳平移。
 *
 * 關鍵前提（實測得出，前幾版都栽在這裡）：
 *   Material 渲染完的 .mermaid 是 <div class="mermaid"></div>，innerHTML 為空、
 *   卻有 1300px 以上的高度 —— 圖畫在 Shadow DOM 裡。所以：
 *     - document.querySelectorAll('svg') 查不到流程圖（shadow 內部對外不可見）
 *     - 任何「找到 SVG 再處理」的做法都必然落空
 *
 *   因此這一版完全不碰內部 SVG，改成對 .mermaid 這個容器本身做 CSS transform。
 *   不論 shadow root 是 open 還是 closed 都適用。
 *
 * 排查：Console 輸出 [mermaid-zoom]；window.__mermaidZoom.info 看狀態。
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
      + 'width:28px;height:28px;padding:0;margin:0;border:1px solid rgba(128,128,128,.4);'
      + 'border-radius:4px;background:#fff;color:#333;cursor:pointer;line-height:0;';
    b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); fn(b); });
    b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="' + d + '"/></svg>';
    return b;
  }

  function setup(el) {
    if (!el.parentNode) return false;
    // 以 DOM 結構判斷是否已處理：dataset 會在 Material 重新渲染時被清掉，
    // 結果同一張圖被包第二層，畫面上就出現兩組工具列。
    if (el.closest('.mzoom-wrap')) return false;
    // Material 是捲到才渲染：圖還沒畫出來就包容器會干擾它，沒高度就留給下一輪
    if (el.getBoundingClientRect().height < 40) return false;

    // 自己包一層當作視窗，裁切與工具列定位都放在這裡
    var box = document.createElement('div');
    box.className = 'mzoom-wrap';
    // overflow:auto 而非 hidden：放大後要能捲動看到圖的其餘部分
    box.style.cssText = 'position:relative;overflow:auto;border:1px solid rgba(128,128,128,.25);'
      + 'border-radius:4px;margin:1em 0;max-height:80vh;display:flex;'
      + 'background:var(--md-default-bg-color,#fff);';
    el.parentNode.insertBefore(box, el);
    box.appendChild(el);

    // 縮放／平移套在 .mermaid 容器上，不進 shadow DOM
    /*
     * 用 zoom 而不是 transform:scale()：scale 只是視覺變形，不改變版面尺寸，
     * 外層永遠不會產生捲軸，放大的部分會直接被裁掉（看起來就像按鈕沒作用）。
     * zoom 會實際撐大元素，配合上面的 overflow:auto 才捲得動。
     */
    el.style.cursor = 'grab';
    // flex 容器裡用 margin:auto 置中：圖比容器小時置中，比容器大時兩側仍捲得到。
    // 換成 justify-content:center 的話，放大後左半邊會捲不出來。
    el.style.margin = 'auto';
    // flex 子元素預設 flex-shrink:1，會被壓縮以塞進容器，圖一進來就變小了。
    // 設 0 才會保持原始尺寸，超出的部分交給容器捲動。
    el.style.flexShrink = '0';
    var scale = 1;
    function apply() { el.style.zoom = scale; }
    function zoom(f) {
      var old = scale;
      scale = Math.min(8, Math.max(0.3, scale * f));
      // 以可視區中心為基準調整捲動位置，放大時不會跑掉焦點
      var cx = box.scrollLeft + box.clientWidth / 2;
      var cy = box.scrollTop + box.clientHeight / 2;
      apply();
      var r = scale / old;
      box.scrollLeft = cx * r - box.clientWidth / 2;
      box.scrollTop = cy * r - box.clientHeight / 2;
    }
    function reset() { scale = 1; apply(); box.scrollLeft = 0; box.scrollTop = 0; }

    // 拖曳改成捲動容器，和放大後的捲軸一致
    var drag = false, sx = 0, sy = 0, sl = 0, st = 0;
    el.addEventListener('mousedown', function (e) {
      drag = true; sx = e.clientX; sy = e.clientY;
      sl = box.scrollLeft; st = box.scrollTop;
      el.style.cursor = 'grabbing'; e.preventDefault();
    });
    window.addEventListener('mousemove', function (e) {
      if (!drag) return;
      box.scrollLeft = sl - (e.clientX - sx);
      box.scrollTop = st - (e.clientY - sy);
    });
    window.addEventListener('mouseup', function () {
      drag = false; el.style.cursor = 'grab';
    });

    var bar = document.createElement('div');
    bar.className = 'mzoom-bar';
    bar.style.cssText = 'position:absolute;top:8px;right:8px;display:flex;gap:4px;padding:4px;'
      + 'border-radius:6px;background:rgba(255,255,255,.94);box-shadow:0 1px 4px rgba(0,0,0,.2);z-index:10;';
    bar.appendChild(mkBtn(P.zoomIn,  '放大', function () { zoom(1.3); }));
    bar.appendChild(mkBtn(P.zoomOut, '縮小', function () { zoom(1 / 1.3); }));
    bar.appendChild(mkBtn(P.reset,   '重設', reset));

    var fb = mkBtn(P.full, '全螢幕', function () {
      if (document.fullscreenElement === box) document.exitFullscreen();
      else if (box.requestFullscreen) box.requestFullscreen()['catch'](function (e) {
        console.warn(TAG, '全螢幕失敗', e);
      });
    });
    bar.appendChild(fb);
    box.appendChild(bar);

    document.addEventListener('fullscreenchange', function () {
      var on = document.fullscreenElement === box;
      fb.title = on ? '結束全螢幕' : '全螢幕';
      fb.querySelector('path').setAttribute('d', on ? P.exit : P.full);
      box.style.background = on ? (getComputedStyle(document.body).backgroundColor || '#fff') : '';
      box.style.maxHeight = on ? 'none' : '80vh';
      box.style.height = on ? '100vh' : '';
      reset();
    });

    count++;
    return true;
  }

  function scan() {
    var n = 0;
    document.querySelectorAll('.mermaid').forEach(function (el) { if (setup(el)) n++; });
    if (n) console.info(TAG, '已加上工具列：' + n + ' 張（累計 ' + count + '）');
  }

  setInterval(scan, 500);
  scan();
  document.addEventListener('DOMContentLoaded', scan);
  window.addEventListener('load', scan);

  window.__mermaidZoom = {
    rescan: scan,
    get info() {
      return {
        圖塊數: document.querySelectorAll('.mermaid').length,
        已處理: document.querySelectorAll('.mzoom-wrap').length,
        工具列: document.querySelectorAll('.mzoom-bar').length
      };
    }
  };
  console.info(TAG, '腳本已載入（容器模式）');
})();
