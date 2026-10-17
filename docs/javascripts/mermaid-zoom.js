/*
 * 讓 Mermaid 流程圖可縮放／拖曳，對齊 GitHub 上檢視 .md 時的體驗。
 *
 * Material 的 Mermaid 是在瀏覽器端渲染的：建置產物裡只有 <div class="mermaid">，
 * SVG 要等 mermaid.js 跑完才出現，所以不能在 DOMContentLoaded 直接抓。
 * 這裡用 MutationObserver 等 SVG 真的插進來再初始化。
 *
 * document$ 是 Material 提供的 observable，navigation.instant 切頁時也會觸發，
 * 否則換頁後新頁面的圖不會被處理。
 */
(function () {
  var ZOOM_OPTS = {
    zoomEnabled: true,
    controlIconsEnabled: true,   // 右下角 +/-/reset 按鈕
    fit: true,
    center: true,
    minZoom: 0.5,
    maxZoom: 10,
    zoomScaleSensitivity: 0.3
  };

  function enhance(svg) {
    if (svg.dataset.zoomReady) return;        // 避免重複初始化
    if (typeof svgPanZoom !== 'function') return;

    // mermaid 產生的 SVG 預設 max-width 會讓 pan-zoom 量不到尺寸
    svg.style.maxWidth = 'none';
    svg.style.width = '100%';
    if (!svg.style.height) svg.style.height = '70vh';

    try {
      svgPanZoom(svg, ZOOM_OPTS);
      svg.dataset.zoomReady = '1';
    } catch (e) {
      /* 單張圖失敗不該影響整頁 */
    }
  }

  function scan(root) {
    (root || document).querySelectorAll('.mermaid > svg').forEach(enhance);
  }

  function watch() {
    scan();

    var blocks = document.querySelectorAll('.mermaid');
    if (!blocks.length) return;

    // 不用 :has()，舊瀏覽器不支援會讓整段失效；直接全部掛上，enhance 自己會去重
    var obs = new MutationObserver(function () { scan(); });
    blocks.forEach(function (el) {
      obs.observe(el, { childList: true, subtree: true });
    });
    // 保險：mermaid 偶爾在 observer 掛上前就渲染完
    setTimeout(scan, 1200);
    setTimeout(function () { obs.disconnect(); }, 15000);
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(watch);        // Material：含 instant navigation
  } else {
    document.addEventListener('DOMContentLoaded', watch);
  }
})();
