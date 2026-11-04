// ============================================================
// 把成語文字稿（tools/data/*.txt）轉成 _idioms/*.md 與插圖 SVG
// 用法：node tools/illustrate/build-idioms.mjs
//
// 文字稿格式（每則以 === 開頭）：
//   === 破釜沉舟 | po4 fu3 chen2 zhou1
//   意思: ……
//   分類: 歷史, 戰爭
//   出處: shiji | 項羽本紀
//   原文: ……
//   難字: 釜=鍋子 ; 甑=蒸飯的器具
//   例句: 例句一 / 例句二
//   近義: 背水一戰
//   反義:
//   場景: river | general@200,240,1,a | boat@300,250,.8
//   提醒: ……（可省略）
//   故事:
//   第一段
//   第二段
// ============================================================
import fs from "fs"; import path from "path"; import { fileURLToPath } from "url";
import { convert } from "./pinyin.mjs"; import { renderScene } from "./scene.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DATA = path.join(ROOT, "tools/data");
const OUT_MD = path.join(ROOT, "_idioms");
const OUT_SVG = path.join(ROOT, "assets/illustrations/idioms");

const q = (s) => JSON.stringify(s); // YAML 可直接讀 JSON 字串
const list = (s) => (s || "").split(/[,，、]/).map((x) => x.trim()).filter(Boolean);

const entries = [];
for (const f of fs.readdirSync(DATA).filter((f) => f.endsWith(".txt")).sort()) {
  const blocks = fs.readFileSync(path.join(DATA, f), "utf8").split(/^===\s*/m).slice(1);
  for (const b of blocks) {
    const lines = b.split("\n");
    const [title, py] = lines[0].split("|").map((s) => s.trim());
    const e = { title, py, file: f, story: [] };
    let inStory = false;
    for (const ln of lines.slice(1)) {
      if (inStory) { if (ln.trim()) e.story.push(ln.trim()); continue; }
      const m = ln.match(/^(意思|分類|出處|原文|難字|例句|近義|反義|場景|提醒|故事)[:：]\s*(.*)$/);
      if (!m) continue;
      if (m[1] === "故事") { inStory = true; if (m[2].trim()) e.story.push(m[2].trim()); continue; }
      e[m[1]] = m[2].trim();
    }
    entries.push(e);
  }
}

const seen = new Map();
let n = 0;
for (const e of entries) {
  const where = `${e.file}「${e.title}」`;
  for (const k of ["意思", "分類", "出處", "原文", "場景"]) if (!e[k]) throw new Error(`${where} 缺少 ${k}`);
  if (!e.story.length) throw new Error(`${where} 缺少故事`);
  const { pinyin, zhuyin, slug } = convert(e.py);
  if ([...e.title].length !== zhuyin.split(" ").length) throw new Error(`${where} 字數與拼音數不符`);
  if (seen.has(slug)) throw new Error(`${where} 網址重複：${slug}（${seen.get(slug)}）`);
  seen.set(slug, e.title);
  const [book, chapter = ""] = e.出處.split("|").map((s) => s.trim());
  const gloss = (e.難字 || "").split(/\s*;\s*/).filter(Boolean).map((g) => { const [t, ...d] = g.split("="); return { term: t.trim(), def: d.join("=").trim() }; });
  const usage = (e.例句 || "").split(/\s*\/\s*/).filter(Boolean);
  const syn = list(e.近義), ant = list(e.反義), tags = list(e.分類);

  let y = `---\ntitle: ${e.title}\npinyin: ${pinyin}\nzhuyin: ${zhuyin}\nmeaning: ${q(e.意思)}\n`;
  y += `illustration: /assets/illustrations/idioms/${slug}.svg\ntags: [${tags.join(", ")}]\n`;
  y += `source:\n  book: ${book}\n  chapter: ${q(chapter)}\n  text: ${q(e.原文)}\n`;
  if (gloss.length) y += `  glossary:\n` + gloss.map((g) => `    - term: ${q(g.term)}\n      def: ${q(g.def)}\n`).join("");
  if (usage.length) y += `usage:\n` + usage.map((u) => `  - ${q(u)}\n`).join("");
  if (syn.length) y += `synonyms: [${syn.join(", ")}]\n`;
  if (ant.length) y += `antonyms: [${ant.join(", ")}]\n`;
  y += `proofread: false   # 原文尚待對照版本校對，校完改成 true\n---\n\n`;
  y += e.story.join("\n\n") + "\n";
  if (e.提醒) y += `\n> **小提醒**：${e.提醒}\n`;

  fs.writeFileSync(path.join(OUT_MD, slug + ".md"), y);
  fs.writeFileSync(path.join(OUT_SVG, slug + ".svg"), renderScene(e.場景));
  n++;
}
console.log(`完成：${n} 則`);
