/* 成語列表頁：依分類篩選。網址可帶 ?tag=動物 直接篩好。 */
(function () {
  var bar = document.querySelector("[data-filter-bar]");
  var grid = document.querySelector("[data-filter-grid]");
  var empty = document.querySelector("[data-filter-empty]");
  var count = document.querySelector("[data-filter-count]");
  if (!bar || !grid) return;

  function apply(tag) {
    var shown = 0;
    bar.querySelectorAll(".chip").forEach(function (b) {
      b.classList.toggle("is-on", b.getAttribute("data-tag") === tag);
    });
    grid.querySelectorAll(".idiom-card").forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").split(",");
      var ok = !tag || tags.indexOf(tag) > -1;
      card.hidden = !ok;
      if (ok) shown++;
    });
    empty.hidden = shown > 0;
    if (count) count.textContent = (tag ? "#" + tag + "：" : "全部：") + shown + " 則";
    history.replaceState(null, "", tag ? "?tag=" + encodeURIComponent(tag) : location.pathname);
  }

  bar.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (b) apply(b.getAttribute("data-tag"));
  });
  apply(new URLSearchParams(location.search).get("tag") || "");
})();
