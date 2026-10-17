/*
 * 流程圖檢視工具列：放大／縮小／重設／全螢幕，外加拖曳平移。
 *
 * 為什麼不用手勢：
 *   觸控板沒有實體滾輪，雙指滑動會送出 wheel；而捏合手勢瀏覽器是送 ctrl+wheel，
 *   這個組合在 macOS 會被瀏覽器自己的頁面縮放攔走，preventDefault 不一定來得及。
 *   所以完全不碰 wheel，改用明確的按鈕（和 GitHub 預覽 .md 時的做法一致）。
 *
 * 實測前提：
 *   Material 產生 <pre class="mermaid">，SVG 由 mermaid.js 在瀏覽器端插入，
 *   不保證是直接子元素；開了 navigation.instant，換頁要靠 document$ 重跑。
 */
(function () {
  var TAG = '[mermaid-zoom]';
  var STEP = 1.3;

  var ICON = {
    zoomIn:  'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14m2.5-4h-2v2H9v-2H7V9h2V7h1v2h2z',
    zoomOut: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14M7 9h5v1H7z',
    reset:   'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8',
    full:    'M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z',
    exit:    'M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z'
  };

  function btn(name, title, onClick) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'mzoom-btn';
    b.title = title;
    b.setAttribute('aria-label', title);
    b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">'
                + '<path fill="currentColor" d="' + ICON[name] + '"/></svg>';
    b.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    });
    return b;
  }

  function enhance(svg) {
    if (svg.dataset.zoomReady) return false;

    var box = svg.closest('.mermaid');
    if (!box) {
      console.warn(TAG, '找不到 .mermaid 容器，略過一張圖');
      return false;
    }

    svg.style.maxWidth = 'none';
    svg.style.width = '100%';
    if (!svg.style.height) svg.style.height = '60vh';

    // 縮放依賴 svg-pan-zoom；即使它載入失敗，全螢幕仍可用，所以工具列照建
    var api = null;
    if (typeof svgPanZoom === 'function') {
      try {
        api = svgPanZoom(svg, {
          zoomEnabled: true,
          controlIconsEnabled: false,   // 用下面自己的工具列
          panEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.2,
          maxZoom: 20,
          mouseWheelZoomEnabled: false  // 完全不碰 wheel，交還給瀏覽器捲動
        });
      } catch (e) {
        console.warn(TAG, 'svg-pan-zoom 初始化失敗，只提供全螢幕', e);
      }
    } else {
      console.warn(TAG, 'svg-pan-zoom 未載入，只提供全螢幕');
    }

    var bar = document.createElement('div');
    bar.className = 'mzoom-bar';
    if (api) {
      bar.appendChild(btn('zoomIn',  '放大', function () { api.zoomIn(); }));
      bar.appendChild(btn('zoomOut', '縮小', function () { api.zoomOut(); }));
      bar.appendChild(btn('reset',   '重設', function () { api.resetZoom(); api.center(); api.fit(); }));
    }

    var full = btn('full', '全螢幕', function () {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else if (box.requestFullscreen) {
        box.requestFullscreen();
      }
    });
    bar.appendChild(full);
    box.appendChild(bar);

    // 全螢幕進出後畫布尺寸變了，要重新量一次，否則圖會偏掉
    document.addEventListener('fullscreenchange', function () {
      var on = document.fullscreenElement === box;
      full.title = on ? '結束全螢幕' : '全螢幕';
      full.querySelector('path').setAttribute('d', on ? ICON.exit : ICON.full);
      if (!api) return;
      setTimeout(function () {
        try { api.resize(); api.fit(); api.center(); } catch (e) {}
      }, 120);
    });

    svg.dataset.zoomReady = '1';
    return true;
  }

  function scan() {
    var found = document.querySelectorAll('.mermaid svg, svg[id^="mermaid"], svg[id^="mmd"]');
    var n = 0;
    found.forEach(function (s) { if (enhance(s)) n++; });
    if (n) console.info(TAG, '已啟用工具列：' + n + ' 張');
    return found.length;
  }

  function watch() {
    var blocks = document.querySelectorAll('.mermaid');
    if (!blocks.length) return;
    scan();

    var obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });

    var tries = 0;
    var timer = setInterval(function () {
      if (scan() >= blocks.length || ++tries > 25) {
        clearInterval(timer);
        obs.disconnect();
      }
    }, 300);
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(watch);
  } else {
    document.addEventListener('DOMContentLoaded', watch);
  }
})();
