/* 列表頁：依分類篩選。支援多排按鈕；網址可帶 ?tag=動物 直接篩好。 */
(function () {
  var bars = document.querySelectorAll("[data-filter-bar]");
  var grid = document.querySelector("[data-filter-grid]");
  var empty = document.querySelector("[data-filter-empty]");
  var count = document.querySelector("[data-filter-count]");
  if (!bars.length || !grid) return;
  var unit = (count && count.getAttribute("data-unit")) || "則";

  function apply(tag) {
    var shown = 0;
    bars.forEach(function (bar) {
      bar.querySelectorAll(".chip").forEach(function (b) {
        b.classList.toggle("is-on", b.getAttribute("data-tag") === tag);
      });
    });
    grid.querySelectorAll("[data-tags]").forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").split(",");
      var ok = !tag || tags.indexOf(tag) > -1;
      card.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (count) count.textContent = (tag ? tag + "：" : "全部：") + shown + " " + unit;
    history.replaceState(null, "", tag ? "?tag=" + encodeURIComponent(tag) : location.pathname);
  }

  bars.forEach(function (bar) {
    bar.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (b) apply(b.getAttribute("data-tag"));
    });
  });
  apply(new URLSearchParams(location.search).get("tag") || "");
})();
