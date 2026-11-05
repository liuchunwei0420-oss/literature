/* 成語分享卡：在瀏覽器裡把插圖、成語、拼音、意思畫成一張 PNG，
   附網站名稱與網址浮水印。手機可直接分享，電腦則下載圖片。 */
(function () {
  var btns = document.querySelectorAll("[data-share-card]");
  if (!btns.length) return;
  var W = 1080, H = 1350;
  var C = { paper: "#fbf5ea", card: "#fffdf8", line: "#e7d9c2", ink: "#3a2e28", soft: "#6f5f55", jade: "#5f9a7e", seal: "#c8553d" };
  var SERIF = '"Noto Serif TC", "Songti TC", "PMingLiU", serif';
  var SANS = '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif';

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  // 中文逐字換行
  function wrap(ctx, text, maxW) {
    var lines = [], cur = "";
    for (var i = 0; i < text.length; i++) {
      var t = cur + text[i];
      if (ctx.measureText(t).width > maxW && cur) {
        // 標點不放行首
        if (/[，。、；：！？」』）]/.test(text[i])) { lines.push(t); cur = ""; continue; }
        lines.push(cur); cur = text[i];
      } else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  // SVG 沒寫寬高，先補上再轉成圖片，canvas 才畫得準
  function loadSvg(url) {
    return fetch(url).then(function (r) { return r.text(); }).then(function (svg) {
      svg = svg.replace("<svg ", '<svg width="1200" height="900" ');
      return new Promise(function (ok, bad) {
        var img = new Image();
        img.onload = function () { ok(img); };
        img.onerror = bad;
        img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
      });
    });
  }

  function draw(d, img) {
    var cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var ctx = cv.getContext("2d");
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, W, H);

    // 卡片
    var x = 60, y = 60, w = W - 120, h = H - 120;
    ctx.save(); ctx.shadowColor = "rgba(90,60,30,.18)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
    rr(ctx, x, y, w, h, 40); ctx.fillStyle = C.card; ctx.fill(); ctx.restore();

    // 插圖（上方圓角）
    var ih = Math.round(w * 3 / 4);
    ctx.save(); rr(ctx, x, y, w, ih + 40, 40); ctx.clip();
    ctx.fillRect(x, y, w, ih);
    if (img) ctx.drawImage(img, x, y, w, ih);
    ctx.restore();
    ctx.fillStyle = C.card; ctx.fillRect(x, y + ih, w, 40);

    // 插圖角落浮水印
    ctx.font = "500 26px " + SANS;
    var wm = d.site, wmw = ctx.measureText(wm).width;
    ctx.fillStyle = "rgba(255,253,248,.82)"; rr(ctx, x + w - wmw - 56, y + ih - 66, wmw + 32, 46, 23); ctx.fill();
    ctx.fillStyle = C.soft; ctx.textBaseline = "middle"; ctx.fillText(wm, x + w - wmw - 40, y + ih - 43);

    // 文字
    var tx = x + 56, ty = y + ih + 40;
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.ink;
    var size = d.title.length > 6 ? 72 : 96;
    ctx.font = "900 " + size + "px " + SERIF;
    // 字距
    var cx = tx;
    for (var i = 0; i < d.title.length; i++) { ctx.fillText(d.title[i], cx, ty + size); cx += ctx.measureText(d.title[i]).width + size * 0.08; }
    ty += size + 24;
    ctx.fillStyle = C.jade; ctx.font = "500 38px \"Charis SIL\", \"Gentium Plus\", \"Noto Sans\", \"Segoe UI\", " + SANS;
    ctx.fillText(d.pinyin, tx, ty + 38);
    ty += 38 + 34;
    ctx.fillStyle = C.soft; ctx.font = "400 38px " + SANS;
    wrap(ctx, d.meaning, w - 112).slice(0, 3).forEach(function (line) { ctx.fillText(line, tx, ty + 38); ty += 58; });

    // 底部品牌列
    var by = y + h - 92;
    ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(tx, by - 18); ctx.lineTo(x + w - 56, by - 18); ctx.stroke(); ctx.setLineDash([]);
    ctx.save(); ctx.translate(tx + 28, by + 34); ctx.rotate(-0.07);
    rr(ctx, -28, -28, 56, 56, 14); ctx.fillStyle = C.seal; ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "900 34px " + SERIF; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("典", 0, 2); ctx.restore();
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillStyle = C.ink; ctx.font = "700 34px " + SERIF; ctx.fillText(d.site, tx + 76, by + 22);
    ctx.fillStyle = C.soft; ctx.font = "400 24px " + SANS; ctx.fillText(d.link, tx + 76, by + 56);
    // 卡片外框最後畫，才不會被插圖蓋掉
    rr(ctx, x, y, w, h, 40); ctx.strokeStyle = C.line; ctx.lineWidth = 3; ctx.stroke();
    return cv;
  }

  function toBlob(cv) { return new Promise(function (ok) { cv.toBlob(ok, "image/png"); }); }

  btns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var d = {
        title: btn.getAttribute("data-title"), pinyin: btn.getAttribute("data-pinyin") || "",
        meaning: btn.getAttribute("data-meaning") || "", site: btn.getAttribute("data-site"),
        link: btn.getAttribute("data-link")
      };
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = "製作中…";
      var fonts = document.fonts ? document.fonts.ready : Promise.resolve();
      fonts.then(function () { return loadSvg(btn.getAttribute("data-img")).catch(function () { return null; }); })
        .then(function (img) { return toBlob(draw(d, img)); })
        .then(function (blob) {
          var name = (btn.getAttribute("data-slug") || "card") + ".png";
          var file = window.File ? new File([blob], name, { type: "image/png" }) : null;
          // 手機：直接叫出分享選單（LINE、IG…）；不支援就下載
          if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
            return navigator.share({ files: [file], title: d.title, text: d.title + "｜" + d.site + " " + d.link }).catch(function () {});
          }
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob); a.download = name;
          a.style.display = "none";
          document.body.appendChild(a); a.click();
          setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
        })
        .catch(function () { alert("圖片製作失敗，請重新整理頁面後再試一次。"); })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    });
  });
})();
