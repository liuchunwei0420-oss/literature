/* ============================================================
   站內搜尋
   - 資料來源：/search.json（Jekyll 建置時自動產生）
   - 支援：中文、拼音（可不打聲調、可不打空格）、注音（可不打聲調）、
          拼音首字母（例如 szdt = 守株待兔）
   - 不需要任何外部套件，GitHub Pages 直接可用
   ============================================================ */
(function () {
  var BASE = document.body.getAttribute("data-baseurl") || "";
  var indexPromise = null;

  function loadIndex() {
    if (!indexPromise) {
      indexPromise = fetch(BASE + "/search.json")
        .then(function (r) { return r.json(); })
        .then(function (items) { return items.map(prepare); })
        .catch(function () { return []; });
    }
    return indexPromise;
  }

  // 拼音：去掉聲調符號、空格，轉小寫。ü 也當作 v / u。
  function normPinyin(s) {
    return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase().replace(/ü/g, "v").replace(/[\s'’\-]/g, "");
  }
  // 注音：去掉聲調（ˊˇˋ˙）與空格
  function normZhuyin(s) { return (s || "").replace(/[ˊˇˋ˙\s]/g, ""); }
  function normText(s) { return (s || "").toLowerCase().replace(/\s+/g, ""); }

  function prepare(it) {
    var syl = (it.pinyin || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().split(/\s+/);
    it._py = normPinyin(it.pinyin);
    it._pyv = it._py.replace(/v/g, "u");
    it._initials = syl.map(function (x) { return x.charAt(0); }).join("");
    it._zy = normZhuyin(it.zhuyin);
    it._zyt = (it.zhuyin || "").replace(/\s/g, "");
    it._tags = (it.tags || []).join(" ");
    it._related = (it.related || []).join(" ");
    return it;
  }

  function score(it, q) {
    var raw = normText(q);
    if (!raw) return 0;
    var py = normPinyin(q), zy = normZhuyin(q), s = 0;

    if (it.title === raw) s += 200;
    else if (it.title.indexOf(raw) === 0) s += 140;
    else if (it.title.indexOf(raw) > -1) s += 120;
    if (py && /^[a-z]+$/.test(py)) {
      if (it._py === py) s += 150;
      else if (it._py.indexOf(py) === 0) s += 110;
      else if (it._py.indexOf(py) > -1 || it._pyv.indexOf(py) > -1) s += 90;
      if (py.length >= 2 && it._initials.indexOf(py) === 0) s += 80;
    }
    if (zy && /[ㄅ-ㄩ]/.test(zy) && it._zy.indexOf(zy) > -1) {
      s += it._zy.indexOf(zy) === 0 ? 120 : 100;
      var zt = raw.replace(/\s/g, "");
      if (/[ˊˇˋ˙]/.test(zt) && it._zyt.indexOf(zt) > -1) s += 40; // 有打聲調、而且聲調也對
    }
    if (it._tags.indexOf(raw) > -1) s += 50;
    if (it._related.indexOf(raw) > -1) s += 35;
    if ((it.summary || "").indexOf(raw) > -1) s += 30;
    if ((it.source || "").indexOf(raw) > -1) s += 25;
    if ((it.author || "").indexOf(raw) > -1) s += 25;
    if ((it.text || "").indexOf(raw) > -1) s += 15;

    // 打錯一兩個字時的保底：標題裡有幾個字對得上
    if (s === 0 && /[一-鿿]/.test(raw)) {
      var hit = 0;
      for (var i = 0; i < raw.length; i++) if (it.title.indexOf(raw[i]) > -1) hit++;
      if (hit >= 2 || (hit === 1 && raw.length === 1)) s += hit * 10;
    }
    return s;
  }

  function search(items, q) {
    return items.map(function (it) { return { it: it, s: score(it, q) }; })
      .filter(function (x) { return x.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .map(function (x) { return x.it; });
  }

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function mark(text, q) {
    var t = esc(text), k = esc((q || "").trim());
    if (!k || !/[一-鿿]/.test(k)) return t;
    return t.split(k).join("<mark>" + k + "</mark>");
  }
  // 從故事內文中，截出關鍵字附近的一小段
  function snippet(it, q) {
    var k = (q || "").trim(), txt = it.text || "", i = k ? txt.indexOf(k) : -1;
    if (i < 0) return mark(it.summary, q);
    var start = Math.max(0, i - 24);
    return (start > 0 ? "…" : "") + mark(txt.slice(start, i + k.length + 40), q) + "…";
  }

  /* ---------- 搜尋框下拉建議 ---------- */
  document.querySelectorAll(".search-box").forEach(function (form) {
    var input = form.querySelector("[data-search-input]");
    var list = form.querySelector("[data-search-suggest]");
    var focus = -1;
    if (!input || !list) return;

    input.addEventListener("focus", loadIndex);
    input.addEventListener("input", function () {
      var q = input.value;
      if (!q.trim()) { list.hidden = true; return; }
      loadIndex().then(function (items) {
        var res = search(items, q).slice(0, 6);
        focus = -1;
        if (!res.length) { list.hidden = true; return; }
        list.innerHTML = res.map(function (it) {
          return '<li><a href="' + esc(it.url) + '"><span>' + mark(it.title, q) +
            '</span><small>' + esc(it.pinyin || it.author) + "</small></a></li>";
        }).join("");
        list.hidden = false;
      });
    });
    input.addEventListener("keydown", function (e) {
      var links = list.querySelectorAll("a");
      if (list.hidden || !links.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        focus = (focus + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links.forEach(function (a, i) { a.classList.toggle("is-focus", i === focus); });
      } else if (e.key === "Enter" && focus > -1) {
        e.preventDefault();
        location.href = links[focus].href;
      } else if (e.key === "Escape") {
        list.hidden = true;
      }
    });
    document.addEventListener("click", function (e) {
      if (!form.contains(e.target)) list.hidden = true;
    });
  });

  /* ---------- 搜尋結果頁 ---------- */
  var box = document.querySelector("[data-search-results]");
  if (box) {
    var status = document.querySelector("[data-search-status]");
    var pageInput = document.querySelector(".search-page [data-search-input]");
    var params = new URLSearchParams(location.search);
    var q0 = params.get("q") || "";
    if (pageInput) pageInput.value = q0;

    var render = function (q) {
      loadIndex().then(function (items) {
        if (!q.trim()) { status.textContent = "輸入關鍵字開始搜尋。"; box.innerHTML = ""; return; }
        var res = search(items, q);
        status.textContent = res.length ? "找到 " + res.length + " 筆「" + q + "」的結果" : "找不到「" + q + "」。換個關鍵字試試，例如動物名稱或拼音。";
        box.innerHTML = res.map(function (it) {
          return '<a class="card result" href="' + esc(it.url) + '">' +
            (it.image ? '<img src="' + esc(it.image) + '" alt="" loading="lazy">' : "<span></span>") +
            "<div><h3>" + mark(it.title, q) + '<span class="tag">' + esc(it.section) + "</span></h3>" +
            '<div class="meta">' + esc(it.pinyin) + (it.source ? "　出自" + esc(it.source) : "") + "</div>" +
            "<p>" + snippet(it, q) + "</p></div></a>";
        }).join("");
      });
    };
    render(q0);
    if (pageInput) {
      pageInput.addEventListener("input", function () {
        var q = pageInput.value;
        history.replaceState(null, "", q ? "?q=" + encodeURIComponent(q) : location.pathname);
        render(q);
      });
    }
  }

  // 給其他腳本用（例如首頁的今日成語）
  window.ClassicsSearch = { loadIndex: loadIndex, search: search };
})();
