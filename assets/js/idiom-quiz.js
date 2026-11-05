/* 成語內頁底下的「考考你」：一題選意思、一題排字。 */
(function () {
  var box = document.querySelector("[data-idiom-quiz]");
  if (!box) return;
  var BASE = document.body.getAttribute("data-baseurl") || "";
  var title = box.getAttribute("data-title"), meaning = box.getAttribute("data-meaning");
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var p = window.ClassicsSearch ? window.ClassicsSearch.loadIndex() : fetch(BASE + "/search.json").then(function (r) { return r.json(); });
  p.then(function (items) {
    var others = shuffle(items.filter(function (i) { return i.section === "成語" && i.title !== title; })).slice(0, 3);
    var opts = shuffle([meaning].concat(others.map(function (o) { return o.summary; })));

    // 第一題：選意思
    var q1 = box.querySelector("[data-q1]");
    q1.innerHTML = '<p class="q-label">1. 「' + esc(title) + '」是什麼意思？</p><div class="game-options is-list">' +
      opts.map(function (o) { return '<button type="button" class="opt" data-opt="' + esc(o) + '">' + esc(o) + "</button>"; }).join("") +
      '</div><p class="game-feedback" aria-live="polite"></p>';
    q1.addEventListener("click", function (e) {
      var b = e.target.closest("[data-opt]"); if (!b || b.disabled) return;
      var ok = b.getAttribute("data-opt") === meaning;
      q1.querySelectorAll("[data-opt]").forEach(function (x) { x.disabled = true; if (x.getAttribute("data-opt") === meaning) x.classList.add("is-right"); });
      if (!ok) b.classList.add("is-wrong");
      var fb = q1.querySelector(".game-feedback");
      fb.textContent = ok ? "答對了！" : "再看一次上面的故事吧。";
      fb.className = "game-feedback " + (ok ? "is-right" : "is-wrong");
    });

    // 第二題：排字
    var q2 = box.querySelector("[data-q2]");
    var chars = title.split(""), mixed = shuffle(chars);
    if (mixed.join("") === title && chars.length > 1) mixed = mixed.slice(1).concat(mixed[0]);
    var picked = [];
    function draw() {
      var slots = chars.map(function (_, i) { return '<span class="slot">' + esc(picked[i] ? picked[i].c : "") + "</span>"; }).join("");
      var tiles = mixed.map(function (c, i) {
        var used = picked.some(function (p) { return p.i === i; });
        return '<button type="button" class="tile" data-i="' + i + '"' + (used ? " disabled" : "") + ">" + esc(c) + "</button>";
      }).join("");
      var done = picked.length === chars.length, ok = done && picked.map(function (p) { return p.c; }).join("") === title;
      q2.innerHTML = '<p class="q-label">2. 把字照順序點一遍，排回這個成語：</p><div class="slots' + (done ? (ok ? " is-right" : " is-wrong") : "") + '">' + slots +
        '</div><div class="tiles">' + tiles + '</div><p class="game-feedback ' + (done ? (ok ? "is-right" : "is-wrong") : "") + '" aria-live="polite">' +
        (done ? (ok ? "排對了！" : "順序不對，按「重來」再試一次。") : "") + '</p><button type="button" class="btn-ghost" data-reset>重來</button>';
    }
    q2.addEventListener("click", function (e) {
      var t = e.target.closest("[data-i]");
      if (t && !t.disabled && picked.length < chars.length) { var i = +t.getAttribute("data-i"); picked.push({ i: i, c: mixed[i] }); draw(); }
      if (e.target.closest("[data-reset]")) { picked = []; draw(); }
    });
    draw();
    box.hidden = false;
  });
})();
