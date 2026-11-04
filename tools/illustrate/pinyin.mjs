// 數字聲調拼音（例：po4 fu3 chen2 zhou1）→ 標調拼音、注音、網址代稱
const INI = { b: "ㄅ", p: "ㄆ", m: "ㄇ", f: "ㄈ", d: "ㄉ", t: "ㄊ", n: "ㄋ", l: "ㄌ", g: "ㄍ", k: "ㄎ", h: "ㄏ", j: "ㄐ", q: "ㄑ", x: "ㄒ", zh: "ㄓ", ch: "ㄔ", sh: "ㄕ", r: "ㄖ", z: "ㄗ", c: "ㄘ", s: "ㄙ" };
const FIN = { a: "ㄚ", o: "ㄛ", e: "ㄜ", ai: "ㄞ", ei: "ㄟ", ao: "ㄠ", ou: "ㄡ", an: "ㄢ", en: "ㄣ", ang: "ㄤ", eng: "ㄥ", er: "ㄦ", ong: "ㄨㄥ",
  i: "ㄧ", ia: "ㄧㄚ", ie: "ㄧㄝ", iao: "ㄧㄠ", iu: "ㄧㄡ", ian: "ㄧㄢ", in: "ㄧㄣ", iang: "ㄧㄤ", ing: "ㄧㄥ", iong: "ㄩㄥ",
  u: "ㄨ", ua: "ㄨㄚ", uo: "ㄨㄛ", uai: "ㄨㄞ", ui: "ㄨㄟ", uan: "ㄨㄢ", un: "ㄨㄣ", uang: "ㄨㄤ",
  v: "ㄩ", ve: "ㄩㄝ", van: "ㄩㄢ", vn: "ㄩㄣ" };
const TONE_ZY = ["", "", "ˊ", "ˇ", "ˋ", ""];
const MARKS = { a: "āáǎà", e: "ēéěè", i: "īíǐì", o: "ōóǒò", u: "ūúǔù", v: "ǖǘǚǜ" };

function split(syl) {
  let s = syl.toLowerCase().replace(/ü/g, "v");
  const tone = /\d$/.test(s) ? +s.slice(-1) : 5;
  s = s.replace(/\d$/, "");
  return { s, tone };
}

export function toZhuyin(syl) {
  let { s, tone } = split(syl);
  let ini = "", fin = s;
  if (s.startsWith("y")) { fin = { yi: "i", ya: "ia", ye: "ie", yao: "iao", you: "iu", yan: "ian", yin: "in", yang: "iang", ying: "ing", yong: "iong", yu: "v", yue: "ve", yuan: "van", yun: "vn", yo: "io" }[s]; }
  else if (s.startsWith("w")) { fin = { wu: "u", wa: "ua", wo: "uo", wai: "uai", wei: "ui", wan: "uan", wen: "un", wang: "uang", weng: "ong" }[s]; if (s === "weng") return "ㄨㄥ" + TONE_ZY[tone]; }
  else {
    const m = s.match(/^(zh|ch|sh|[bpmfdtnlgkhjqxrzcs])(.*)$/);
    if (m) { ini = m[1]; fin = m[2]; }
    if ("jqx".includes(ini) && fin.startsWith("u")) fin = "v" + fin.slice(1);
    if (fin === "ue") fin = "ve";
    if ("zh ch sh r z c s".split(" ").includes(ini) && fin === "i") fin = "";
  }
  const zf = fin === "" ? "" : FIN[fin] ?? (fin === "io" ? "ㄧㄛ" : null);
  if (zf == null) throw new Error("無法轉換注音：" + syl);
  const body = (INI[ini] || "") + zf;
  return tone === 5 ? "˙" + body : body + TONE_ZY[tone];
}

export function toMarked(syl) {
  let { s, tone } = split(syl);
  if (tone === 5) return s.replace(/v/g, "ü");
  let i = s.search(/[ae]/);
  if (i < 0) i = s.indexOf("ou");
  if (i < 0) { for (let k = s.length - 1; k >= 0; k--) if ("aeiouv".includes(s[k])) { i = k; break; } }
  const ch = s[i];
  s = s.slice(0, i) + MARKS[ch][tone - 1] + s.slice(i + 1);
  return s.replace(/v/g, "ü");
}

export function convert(numbered) {
  const syls = numbered.trim().split(/\s+/);
  return {
    pinyin: syls.map(toMarked).join(" "),
    zhuyin: syls.map(toZhuyin).join(" "),
    slug: syls.map((x) => x.replace(/\d/g, "").replace(/ü|v/g, "v")).join("-"),
  };
}
