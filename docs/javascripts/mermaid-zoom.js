/*
 * 讓 Mermaid 流程圖可縮放／拖曳，對齊 GitHub 上檢視 .md 時的體驗。
 *
 * 幾個實測得出的前提：
 *  - Material 產生的是 <pre class="mermaid">，不是 <div>；SVG 由 mermaid.js
 *    在瀏覽器端插入，建置產物裡沒有，所以 DOMContentLoaded 時抓不到。
 *  - SVG 不一定是直接子元素，用後代選擇器才穩；另外 mermaid 產生的 SVG
 *    id 以 "mermaid" 或 "mmd" 開頭，當成備援匹配。
 *  - 開了 navigation.instant，換頁不會重跑 DOMContentLoaded，必須掛 document$。
 *
 * 排查方式：F12 Console 會輸出 [mermaid-zoom] 開頭的訊息。
 */
(function () {
  var TAG = '[mermaid-zoom]';
  var OPTS = {
    zoomEnabled: true,
    controlIconsEnabled: true,
    fit: true,
    center: true,
    minZoom: 0.5,
    maxZoom: 10,
    zoomScaleSensitivity: 0.3
  };

  function collect() {
    var set = new Set();
    document.querySelectorAll('.mermaid svg, svg[id^="mermaid"], svg[id^="mmd"]')
      .forEach(function (s) { set.add(s); });
    return Array.from(set);
  }

  function enhance(svg) {
    if (svg.dataset.zoomReady) return false;
    if (typeof svgPanZoom !== 'function') {
      console.warn(TAG, 'svg-pan-zoom 未載入，跳過');
      return false;
    }
    // mermaid 的 SVG 帶 max-width，會讓 pan-zoom 量不到可用尺寸
    svg.style.maxWidth = 'none';
    svg.style.width = '100%';
    if (!svg.getAttribute('height') && !svg.style.height) {
      svg.style.height = '70vh';
    }
    try {
      svgPanZoom(svg, OPTS);
      svg.dataset.zoomReady = '1';
      return true;
    } catch (e) {
      console.warn(TAG, '初始化失敗', e);
      return false;
    }
  }

  function scan() {
    var found = collect();
    var done = 0;
    found.forEach(function (s) { if (enhance(s)) done++; });
    if (done) console.info(TAG, '已啟用縮放的流程圖：' + done + ' 張');
    return found.length;
  }

  function watch() {
    var blocks = document.querySelectorAll('.mermaid');
    if (!blocks.length) return;
    console.info(TAG, '本頁 mermaid 區塊：' + blocks.length + ' 個');

    scan();

    // SVG 由 mermaid 非同步插入，用 observer + 輪詢雙保險
    var obs = new MutationObserver(scan);
    obs.observe(document.body, { childList: true, subtree: true });

    var tries = 0;
    var timer = setInterval(function () {
      tries++;
      var n = scan();
      if (n >= blocks.length || tries > 25) {      // 最多等約 7.5 秒
        clearInterval(timer);
        obs.disconnect();
        if (n < blocks.length) {
          console.warn(TAG, '仍有圖未渲染完成：' + n + '/' + blocks.length);
        }
      }
    }, 300);
  }

  if (typeof document$ !== 'undefined') {
    document$.subscribe(watch);
  } else {
    console.warn(TAG, 'document$ 不存在，退回 DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', watch);
  }
})();
