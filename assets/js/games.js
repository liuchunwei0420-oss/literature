/* 成語小遊戲：看意思猜成語、看圖猜成語、缺字填空。
   題目都從 /search.json 隨機抽，不用另外準備題庫；新增成語會自動進入遊戲。 */
(function () {
  var BASE = document.body.getAttribute("data-baseurl") || "";
  var ROUNDS = 10;
  var $ = function (s) { return document.querySelector(s); };
  var modes = $("[data-game-modes]"), board = $("[data-game-board]"), result = $("[data-game-result]");
  if (!modes || !board) return;

  var pool = [], state = null;
  var NAMES = { meaning: "看意思猜成語", picture: "看圖猜成語", blank: "缺字填空" };

  function load() {
    var p = window.ClassicsSearch ? window.ClassicsSearch.loadIndex()
      : fetch(BASE + "/search.json").then(function (r) { return r.json(); });
    return p.then(function (items) { return items.filter(function (i) { return i.section === "成語"; }); });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function esc(s) { return String(s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function getBest(m) { try { return +localStorage.getItem("game-best-" + m) || 0; } catch (e) { return 0; } }
  function setBest(m, v) { try { localStorage.setItem("game-best-" + m, v); } catch (e) {} }
  function showBest() {
    document.querySelectorAll("[data-best]").forEach(function (el) {
      var b = getBest(el.getAttribute("data-best"));
      el.textContent = b ? "最佳紀錄：" + b + "／" + ROUNDS : "";
    });
  }

  // 出一題：回傳 { html, options:[文字], answer:文字, item }
  function makeQuestion(mode, item) {
    var others = shuffle(pool.filter(function (x) { return x.title !== item.title; }));
    if (mode === "meaning") {
      return { item: item, answer: item.title,
        html: '<p class="q-label">哪一個成語的意思是：</p><p class="q-text">「' + esc(item.summary) + '」</p>',
        options: shuffle([item.title].concat(others.slice(0, 3).map(function (x) { return x.title; }))) };
    }
    if (mode === "picture") {
      return { item: item, answer: item.title,
        html: '<p class="q-label">這張圖畫的是哪一個成語？</p><img class="q-img" src="' + esc(item.image) + '" alt="成語插圖">',
        options: shuffle([item.title].concat(others.slice(0, 3).map(function (x) { return x.title; }))) };
    }
    // blank：挖掉一個字
    var chars = item.title.split("");
    var idx = Math.floor(Math.random() * chars.length);
    var ans = chars[idx], picks = [];
    for (var i = 0; i < others.length && picks.length < 3; i++) {
      var oc = others[i].title.split("");
      var c = oc[idx] || oc[Math.floor(Math.random() * oc.length)];
      if (c && c !== ans && picks.indexOf(c) < 0 && chars.indexOf(c) < 0) picks.push(c);
    }
    var shown = chars.map(function (c, i) { return i === idx ? '<span class="q-blank">？</span>' : esc(c); }).join("");
    return { item: item, answer: ans,
      html: '<p class="q-label">缺了哪一個字？</p><p class="q-idiom">' + shown + '</p><p class="q-hint">提示：' + esc(item.summary.split(ans).join("○")) + '</p>',
      options: shuffle([ans].concat(picks)) };
  }

  function start(mode) {
    var src = mode === "picture" ? pool.filter(function (x) { return x.image; }) : pool;
    state = { mode: mode, list: shuffle(src).slice(0, ROUNDS), i: 0, score: 0, wrong: [] };
    modes.hidden = true; result.hidden = true; board.hidden = false;
    ask();
  }
  function ask() {
    var q = state.q = makeQuestion(state.mode, state.list[state.i]);
    $("[data-game-progress]").textContent = NAMES[state.mode] + "　第 " + (state.i + 1) + "／" + state.list.length + " 題";
    $("[data-game-score]").textContent = "答對 " + state.score + " 題";
    $("[data-game-question]").innerHTML = q.html;
    $("[data-game-feedback]").textContent = "";
    $("[data-game-feedback]").className = "game-feedback";
    $("[data-game-next]").hidden = true;
    var box = $("[data-game-options]");
    box.className = "game-options" + (state.mode === "blank" ? " is-chars" : "");
    box.innerHTML = q.options.map(function (o) { return '<button type="button" class="opt" data-opt="' + esc(o) + '">' + esc(o) + "</button>"; }).join("");
  }
  function answer(btn) {
    var q = state.q, pick = btn.getAttribute("data-opt"), ok = pick === q.answer;
    document.querySelectorAll("[data-opt]").forEach(function (b) {
      b.disabled = true;
      if (b.getAttribute("data-opt") === q.answer) b.classList.add("is-right");
    });
    var fb = $("[data-game-feedback]");
    if (ok) { state.score++; fb.textContent = "答對了！"; fb.className = "game-feedback is-right"; }
    else {
      btn.classList.add("is-wrong");
      state.wrong.push(q.item);
      fb.innerHTML = "差一點！正確答案是「" + esc(q.item.title) + "」。";
      fb.className = "game-feedback is-wrong";
    }
    $("[data-game-score]").textContent = "答對 " + state.score + " 題";
    var next = $("[data-game-next]");
    next.textContent = state.i + 1 < state.list.length ? "下一題" : "看成績";
    next.hidden = false; next.focus();
  }
  function finish() {
    var s = state.score, n = state.list.length, best = getBest(state.mode);
    if (s > best) setBest(state.mode, s);
    var msg = s === n ? "全對！你是成語達人。" : s >= n * 0.7 ? "很厲害，再接再厲！" : s >= n * 0.4 ? "不錯喔，多玩幾次就記住了。" : "沒關係，點下面的成語複習一下吧。";
    var html = '<h2>成績：' + s + "／" + n + "</h2><p>" + msg + (s > best ? "　🎉 新紀錄！" : "") + "</p>";
    if (state.wrong.length) {
      html += '<p class="muted">這幾則可以再看一次：</p><ul class="chips">' + state.wrong.map(function (w) {
        return '<li><a href="' + esc(w.url) + '">' + esc(w.title) + "</a></li>";
      }).join("") + "</ul>";
    }
    html += '<div class="game-actions"><button type="button" class="btn" data-again>再玩一次</button><button type="button" class="btn-ghost" data-back>換玩法</button></div>';
    result.innerHTML = html;
    board.hidden = true; result.hidden = false;
    showBest();
  }
  function backToModes() { board.hidden = true; result.hidden = true; modes.hidden = false; showBest(); }

  modes.addEventListener("click", function (e) {
    var b = e.target.closest("[data-mode]");
    if (b && pool.length) start(b.getAttribute("data-mode"));
  });
  board.addEventListener("click", function (e) {
    var o = e.target.closest("[data-opt]");
    if (o && !o.disabled) answer(o);
    if (e.target.closest("[data-game-next]")) { state.i++; state.i < state.list.length ? ask() : finish(); }
    if (e.target.closest("[data-game-quit]")) backToModes();
  });
  result.addEventListener("click", function (e) {
    if (e.target.closest("[data-again]")) start(state.mode);
    if (e.target.closest("[data-back]")) backToModes();
  });

  load().then(function (items) {
    pool = items;
    showBest();
    var m = new URLSearchParams(location.search).get("mode");
    if (m && NAMES[m]) start(m);
  });
})();
