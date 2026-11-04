/* 首頁「今日成語」：依日期每天換一則，同一天大家看到的都一樣。 */
(function () {
  var card = document.querySelector("[data-daily]");
  if (!card || !window.ClassicsSearch) return;
  window.ClassicsSearch.loadIndex().then(function (items) {
    var list = items.filter(function (it) { return it.section === "成語"; });
    if (!list.length) return;
    var d = new Date();
    var day = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
    var it = list[day % list.length];
    card.href = it.url;
    card.querySelector("[data-daily-img]").src = it.image;
    card.querySelector("[data-daily-title]").textContent = it.title;
    card.querySelector("[data-daily-meaning]").textContent = it.summary;
  });
})();
