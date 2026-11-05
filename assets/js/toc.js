/* 文章頁：用內文的 h2 小標自動產生目錄（只有兩個以上小標才顯示）。 */
(function () {
  var body = document.querySelector("[data-article-body]");
  var box = document.querySelector("[data-toc]");
  var list = document.querySelector("[data-toc-list]");
  if (!body || !box || !list) return;
  var hs = body.querySelectorAll("h2");
  if (hs.length < 2) return;
  hs.forEach(function (h, i) {
    h.id = "sec-" + (i + 1);
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    list.appendChild(li);
  });
  box.hidden = false;
})();
