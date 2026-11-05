// 詩詞插圖：依下面的場景描述產生 SVG，並把 illustration 欄位寫進 _poems/*.md
// 用法：node tools/illustrate/build-poems.mjs（在網站根目錄執行）
// 場景格式和 scene.mjs 一樣：背景 | 元件@x,y,大小,選項 | ...
// 背景先找這裡的 PBG（詩詞專用色調），找不到才用 scene.mjs 的。
import fs from "fs";
import { SPRITES, C, dedupe } from "./sprites.mjs";
import { renderScene } from "./scene.mjs";

const S = `stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
const grad = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
const snowDots = (n, seed, y0 = 10, y1 = 280, op = 1) => {
  let s = seed, out = "";
  const r = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < n; i++) out += `<circle cx="${(r() * 400).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${(2 + r() * 2.6).toFixed(1)}" fill="#fff" opacity="${op}"/>`;
  return out;
};

// ---------- 詩詞新增元件 ----------
Object.assign(SPRITES, {
  bed: () => `<rect x="-70" y="-40" width="140" height="18" rx="5" fill="#B5835A" ${S}/><path d="M-62 -22 v22 M62 -22 v22" ${S} stroke-width="6"/><path d="M-70 -40 v-34 q0 -8 8 -8 h8 v42" fill="#9C6B43" ${S}/><ellipse cx="-44" cy="-46" rx="18" ry="8" fill="#FFFDF8" ${S} stroke-width="2"/><path d="M-26 -40 q30 -14 90 -4 v4z" fill="#9FB8D6" ${S} stroke-width="2"/>`,
  tower: () => {
    const roof = (w, y, h) => `<path d="M${-w} ${y} Q${-w * 0.62} ${y - 4} ${-w * 0.5} ${y - h} H${w * 0.5} Q${w * 0.62} ${y - 4} ${w} ${y} Q${w * 0.8} ${y + 6} ${w * 0.6} ${y + 4} H${-w * 0.6} Q${-w * 0.8} ${y + 6} ${-w} ${y}Z" fill="#C8553D" ${S}/>`;
    return `<rect x="-64" y="-22" width="128" height="22" fill="#C9B79C" ${S}/><rect x="-48" y="-86" width="96" height="64" fill="#F3E2C2" ${S}/><g fill="#C8553D" ${S} stroke-width="2"><rect x="-44" y="-84" width="9" height="62"/><rect x="35" y="-84" width="9" height="62"/><rect x="-5" y="-84" width="10" height="62"/></g>${roof(78, -86, 18)}<rect x="-36" y="-150" width="72" height="50" fill="#F3E2C2" ${S}/><path d="M-42 -112 h84 M-42 -104 h84" ${S} stroke-width="2"/><path d="M-36 -112 v8 M-18 -112 v8 M0 -112 v8 M18 -112 v8 M36 -112 v8" ${S} stroke-width="2"/>${roof(62, -150, 16)}<path d="M0 -166 v-14" ${S} stroke-width="4"/><circle cx="0" cy="-182" r="4" fill="${C.gold}" ${S} stroke-width="2"/>`;
  },
  skiff: () => `<path d="M-64 -16 h128 q-12 20 -42 20 h-44 q-30 0 -42 -20z" fill="#8C6A4A" ${S}/><path d="M-50 -10 h100" stroke="#6F4A2E" stroke-width="2"/>`,
  fisher: (m) => SPRITES.farmer(m) + `<g transform="translate(0 34) scale(1 .72)"><path d="M-30 -96 q-10 30 -12 74 l8 -6 6 8 6 -8 6 8 6 -8 6 8 6 -8 6 8 6 -8 8 6 q-2 -44 -12 -74z" fill="#B7A46E" ${S} stroke-width="2"/><path d="M-26 -80 l52 0 M-30 -60 l60 0 M-34 -40 l68 0" stroke="#8E7C4C" stroke-width="2"/></g><path d="M24 -50 L118 -126" stroke="#6F4A2E" stroke-width="3.5" stroke-linecap="round"/><path d="M118 -126 q8 60 4 112" fill="none" stroke="${C.ink}" stroke-width="1.2"/>`,
  reach_hand: () => `<path d="M10 -52 h90 v28 h-90z" fill="${C.blue}" ${S}/><path d="M10 -54 q-6 16 0 32" fill="none" ${S} stroke-width="2"/><path d="M10 -48 q-18 -4 -30 2 q-8 4 -4 8 q8 2 18 0 q-14 6 -12 12 q4 4 16 -2 q8 6 12 0z" fill="${C.skin}" ${S} stroke-width="2"/>`,
  redbean: () => {
    const beans = (x, y) => [[0, 0], [9, 5], [-8, 6], [2, 12], [12, 15], [-6, 17]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r="5.5" fill="#D9372E" ${S} stroke-width="1.6"/>`).join("");
    const leaf = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="18" ry="7" fill="${C.green}" ${S} stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`;
    return `<path d="M0 0 C-6 -50 10 -90 -4 -150 M-2 -70 q30 -14 46 -40 M-3 -110 q-28 -10 -44 -34" fill="none" stroke="#7A5A3A" stroke-width="5" stroke-linecap="round"/>${leaf(30, -96, -30)}${leaf(-30, -128, 30)}${leaf(12, -140, -50)}${leaf(-22, -80, 20)}${leaf(54, -120, -60)}${beans(40, -104)}${beans(-48, -140)}${beans(-14, -64)}`;
  },
  stove: () => `<path d="M-34 -10 h68 l-6 -56 h-56z" fill="#C0583C" ${S}/><rect x="-40" y="-12" width="80" height="12" rx="4" fill="#9C4430" ${S}/><path d="M-14 -22 q0 -18 14 -18 q14 0 14 18z" fill="#4A2E25" ${S} stroke-width="2"/><path d="M-6 -24 q-2 -10 6 -14 q6 6 4 14z" fill="#F8C95A"/><path d="M-38 -66 h76" ${S} stroke-width="5"/><path d="M-22 -68 q0 -26 22 -26 q22 0 22 26z" fill="#6F5F55" ${S}/><path d="M-10 -100 q-6 -10 2 -18 M8 -100 q-6 -10 2 -18" fill="none" stroke="#C9C2B8" stroke-width="3" stroke-linecap="round"/>`,
  winejar: () => SPRITES.jar() + `<ellipse cx="0" cy="-70" rx="20" ry="5" fill="#9CCB8A" ${S} stroke-width="2"/><g fill="#C7E4B0"><circle cx="-8" cy="-71" r="2"/><circle cx="3" cy="-69" r="2.4"/><circle cx="10" cy="-72" r="1.8"/></g>`,
  petals: () => [[-40, -4, 20], [-14, -10, -30], [10, -2, 50], [34, -8, 10], [52, -2, -40], [-58, -12, 70]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.6" fill="${C.pink}" stroke="#D88EA2" stroke-width="1.2" transform="rotate(${r} ${x} ${y})"/>`).join(""),
  talk: () => SPRITES.bubble() + `<g fill="${C.ink}"><circle cx="-18" cy="-42" r="4"/><circle cx="0" cy="-42" r="4"/><circle cx="18" cy="-42" r="4"/></g>`,
  pointer: () => `<path d="M0 0 q40 -70 110 -80" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-dasharray="6 7" stroke-linecap="round"/><path d="M110 -80 l-14 -6 4 14z" fill="${C.ink}"/>`,
  blossom: () => `<path d="M60 0 q-40 -10 -80 -40 M10 -18 q-6 -20 -24 -30" fill="none" stroke="#8C5E3C" stroke-width="5" stroke-linecap="round"/>` + [[-20, -42], [-12, -52], [4, -28], [24, -14], [40, -6], [-30, -36]].map(([x, y]) => `<g fill="#F7C6D3" ${S} stroke-width="1.6"><circle cx="${x}" cy="${y - 5}" r="5"/><circle cx="${x - 5}" cy="${y + 2}" r="5"/><circle cx="${x + 5}" cy="${y + 2}" r="5"/></g><circle cx="${x}" cy="${y}" r="2.4" fill="${C.gold}"/>`).join(""),
});

// ---------- 詩詞背景（色調：清晨、白天、黃昏、月夜、雪景） ----------
const PBG = {
  // 清晨室內，大窗外是粉色晨光與花枝
  dawn_room: () => grad("g1", "#FFD8C4", "#FFF4DC") + `<rect width="400" height="300" fill="#FBEBDC"/><rect y="232" width="400" height="68" fill="#E2C49C"/><path d="M0 232 H400" stroke="#B5835A" stroke-width="3"/><rect x="200" y="34" width="168" height="150" rx="6" fill="url(#g1)" stroke="${C.ink}" stroke-width="3"/><path d="M200 184 h168" stroke="#9C6B43" stroke-width="8" stroke-linecap="round"/>`,
  // 月夜室內，窗外有月，月光斜斜落在地上像霜
  moon_room: () => `<rect width="400" height="300" fill="#2E3A5A"/><rect y="232" width="400" height="68" fill="#3E4A68"/><rect x="250" y="34" width="116" height="100" rx="6" fill="#1F2944" stroke="#E8DDBE" stroke-width="3"/><path d="M308 34 v100 M250 84 h116" stroke="#E8DDBE" stroke-width="2"/><path d="M276 62 a20 20 0 1 0 16 30 a16 16 0 1 1 -16 -30z" fill="#FCE7A6"/><path d="M250 134 L366 134 L250 262 L90 262 Z" fill="#DDE6F6" opacity=".22"/><ellipse cx="190" cy="252" rx="110" ry="12" fill="#EEF3FB" opacity=".55"/><g fill="#FCE7A6"><circle cx="272" cy="112" r="1.5"/><circle cx="350" cy="52" r="1.5"/></g>`,
  // 黃昏高處：夕陽靠山、黃河向遠方
  dusk_river: () => grad("g2", "#F9A774", "#FFE6B8") + `<rect width="400" height="300" fill="url(#g2)"/><circle cx="104" cy="150" r="30" fill="#FFD36E"/><path d="M-10 170 L50 128 L96 150 L150 112 L220 160 L280 136 L410 174 V210 H-10Z" fill="#B8889A"/><path d="M-10 186 L70 156 L140 182 L230 150 L410 190 V230 H-10Z" fill="#9C7488"/><path d="M0 210 H400 V300 H0Z" fill="#D6B17E"/><path d="M200 300 C230 270 120 250 160 230 C190 216 120 210 30 206 L60 204 C150 208 230 214 196 232 C170 248 290 266 270 300Z" fill="#E7B95C" stroke="#C99A3E" stroke-width="2"/>`,
  // 雪景江面：遠山覆雪、灰藍江水、飄雪
  snow_river: () => `<rect width="400" height="300" fill="#E4E9EE"/><path d="M-10 170 L60 96 L110 140 L180 80 L250 150 L320 104 L410 170Z" fill="#FFFFFF" stroke="#C3CDD6" stroke-width="2.5"/><path d="M60 96 l-14 18 10 -4 6 8 6 -8z M180 80 l-16 22 12 -5 6 9 8 -10z M320 104 l-14 18 10 -4 6 8 6 -8z" fill="#D9E1E8"/><path d="M-10 178 Q200 160 410 178 V190 H-10Z" fill="#F4F7FA" stroke="#C3CDD6" stroke-width="2"/><rect y="188" width="400" height="112" fill="#B7C9D6"/><g fill="none" stroke="#E4ECF2" stroke-width="2.5" stroke-linecap="round"><path d="M40 222 q14 -6 28 0"/><path d="M300 270 q14 -6 28 0"/><path d="M90 276 q14 -6 28 0"/></g>${snowDots(46, 7)}`,
  // 白天淺綠庭園
  garden_soft: () => `<rect width="400" height="300" fill="#F2F6EA"/><circle cx="330" cy="58" r="22" fill="#FBE3A0"/><path d="M0 228 Q200 214 400 228 V300 H0Z" fill="#CFE3B4"/><path d="M0 262 Q200 250 400 262 V300 H0Z" fill="#BCD9A0"/>`,
  // 白天雲霧山
  misty_mountain: () => `<rect width="400" height="300" fill="#E9F2EF"/><path d="M150 230 L270 50 L320 110 L360 80 L430 230Z" fill="#A9C7B0" stroke="${C.ink}" stroke-width="2.5"/><path d="M270 50 l-14 22 10 -4 6 8 6 -8z" fill="#fff"/><g fill="#FFFFFF" opacity=".95"><ellipse cx="300" cy="120" rx="90" ry="18"/><ellipse cx="250" cy="110" rx="50" ry="14"/><ellipse cx="350" cy="100" rx="50" ry="14"/><ellipse cx="300" cy="160" rx="110" ry="14" opacity=".8"/></g><path d="M0 232 Q200 218 400 232 V300 H0Z" fill="#C5E0A8"/>`,
  // 黃昏古原：巨大夕陽、長安屋頂
  sunset_plateau: () => grad("g3", "#F58A63", "#FFD3A0") + `<rect width="400" height="300" fill="url(#g3)"/><circle cx="250" cy="196" r="74" fill="#FFC75A" opacity=".95"/><circle cx="250" cy="196" r="92" fill="#FFC75A" opacity=".25"/><rect y="196" width="400" height="104" fill="#B9705A"/><g fill="#8E4E40">${[20, 70, 120, 170, 220, 270, 320, 370].map((x, i) => `<path d="M${x - 24} ${222 + (i % 2) * 6} q24 -14 48 0 v10 h-48z"/>`).join("")}</g><path d="M0 244 Q200 232 400 244 V300 H0Z" fill="#D49270"/>`,
  // 雪夜室內：窗外下雪、屋內暖色
  snow_room: () => `<rect width="400" height="300" fill="#F5DFC4"/><rect y="232" width="400" height="68" fill="#D7B38A"/><path d="M0 232 H400" stroke="#B5835A" stroke-width="3"/><rect x="30" y="36" width="130" height="116" rx="6" fill="#5C6F95" stroke="${C.ink}" stroke-width="3"/><path d="M30 120 q65 -14 130 0 V152 H30Z" fill="#F4F7FA"/><path d="M95 36 v116 M30 94 h130" stroke="${C.ink}" stroke-width="2"/><g>${snowDots(18, 3, 40, 148).replace(/cx="(\d+)"/g, (m, x) => `cx="${34 + (+x / 400) * 122 | 0}"`)}</g><ellipse cx="230" cy="236" rx="120" ry="10" fill="#F8C95A" opacity=".25"/>`,
  // 傍晚深林：一道斜陽照在青苔上
  forest_beam: () => grad("g4", "#3D5A48", "#6C8C68") + `<rect width="400" height="300" fill="url(#g4)"/><g fill="#2B3F33">${[[30, 16], [96, 22], [176, 14], [250, 26], [330, 18], [378, 12]].map(([x, w]) => `<rect x="${x}" y="0" width="${w}" height="300"/>`).join("")}</g><g fill="#4F6E56" opacity=".9"><ellipse cx="60" cy="40" rx="80" ry="40"/><ellipse cx="220" cy="20" rx="110" ry="40"/><ellipse cx="370" cy="40" rx="70" ry="40"/></g><path d="M0 236 Q200 224 400 236 V300 H0Z" fill="#41583F"/><path d="M420 -10 L340 -10 L140 270 L250 270 Z" fill="#FFE29A" opacity=".38"/><ellipse cx="196" cy="262" rx="78" ry="16" fill="#A9CF6E"/><ellipse cx="196" cy="260" rx="50" ry="9" fill="#C9E58E"/><g fill="#7C8C7A" ${S} stroke-width="2"><ellipse cx="120" cy="266" rx="18" ry="9"/><ellipse cx="292" cy="268" rx="14" ry="7"/></g>`,
  // 月夜竹林
  bamboo_night: () => `<rect width="400" height="300" fill="#24314B"/><circle cx="214" cy="70" r="34" fill="#FCE7A6"/><circle cx="214" cy="70" r="50" fill="#FCE7A6" opacity=".15"/><g fill="#F8E7B0"><circle cx="40" cy="30" r="1.8"/><circle cx="340" cy="44" r="2"/><circle cx="300" cy="110" r="1.5"/><circle cx="90" cy="100" r="1.5"/></g><path d="M0 236 Q200 224 400 236 V300 H0Z" fill="#2E4A3C"/>`,
};

function renderPoemScene(spec) {
  const parts = spec.split("|").map((s) => s.trim()).filter(Boolean);
  if (!PBG[parts[0]]) return renderScene(spec);
  const bg = PBG[parts[0]]();
  const items = parts.slice(1).map((p) => {
    const [name, args = ""] = p.split("@");
    const [x = 200, y = 240, s = 1, opts = ""] = args.split(",");
    const fn = SPRITES[name.trim()];
    if (!fn) throw new Error("未知元件：" + name);
    const mood = (opts.match(/[nhsxzwa]/) || ["n"])[0];
    const flip = opts.includes("f") ? -1 : 1;
    const tilt = opts.includes("t") ? -18 : 0;
    const op = opts.includes("d") ? ' opacity=".75"' : "";
    return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s * flip} ${s})"${op}>${fn(mood)}</g>`;
  }).join("\n  ");
  return dedupe(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">\n  ${bg}\n  ${items}\n</svg>\n`);
}

// ---------- 第一批 10 首 ----------
export const SCENES = {
  // 春曉：清晨醒來，窗外鳥鳴、花落滿地
  "chun-xiao": "dawn_room | blossom@330,118,1.25 | bird@300,96,.55,f | note@258,74,.7 | petals@290,176,.7 | petals@200,256,1.1 | petals@330,262,.8 | scholar@110,262,.95,z",
  // 靜夜思：床前月光如霜，抬頭望月
  "jing-ye-si": "moon_room | bed@90,262,1 | scholar@205,262,.92,n",
  // 登鸛雀樓：黃昏高樓遠望，夕陽依山、黃河入海
  "deng-guan-que-lou": "dusk_river | tower@310,290,1.05 | scholar@310,170,.4,h",
  // 江雪：千山無人，孤舟老翁獨釣
  "jiang-xue": "snow_river | skiff@180,238,1 | fisher@164,226,.55,z",
  // 相思：一枝紅豆，一隻手伸過來輕輕摘
  "xiang-si": "garden_soft | redbean@170,262,1.35 | reach_hand@258,150,1.1 | heart@214,92,.6",
  // 尋隱者不遇：童子指向雲深處，訪客一臉茫然
  "xun-yin-zhe-bu-yu": "misty_mountain | pine@58,262,1.4 | child@150,262,.85,h | pointer@172,196,.8 | scholar@245,262,.8,x | q@280,158,.8 | basket@108,262,.55",
  // 登樂遊原：古原上夕陽無限好，下方是長安屋頂
  "deng-le-you-yuan": "sunset_plateau | cart@92,272,.8 | horse@190,272,.8 | scholar@318,272,.85,n",
  // 問劉十九：紅泥小火爐溫酒，窗外飄雪
  "wen-liu-shi-jiu": "snow_room | winejar@100,262,.9 | stove@236,262,1.15 | cup@324,262,.9 | q@344,186,.9",
  // 鹿柴：空山不見人，只有一道斜陽照在青苔上，林外傳來人語
  "lu-zhai": "forest_beam | talk@338,128,.9",
  // 竹裏館：月夜竹林裡彈琴長嘯
  "zhu-li-guan": "bamboo_night | bamboo@40,262,1.5,d | bamboo@96,262,1.2,d | bamboo@330,262,1.4,d | bamboo@378,262,1.6,d | scholar@206,258,.85,z | qin@206,262,.85 | note@270,150,.8 | note@140,166,.6",
};

const OUT = "assets/illustrations/poems";
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const [slug, spec] of Object.entries(SCENES)) {
  fs.writeFileSync(`${OUT}/${slug}.svg`, renderPoemScene(spec));
  const md = `_poems/${slug}.md`;
  if (!fs.existsSync(md)) { console.warn("找不到", md); continue; }
  let t = fs.readFileSync(md, "utf8");
  const line = `illustration: /${OUT}/${slug}.svg`;
  t = /^illustration:.*$/m.test(t) ? t.replace(/^illustration:.*$/m, line) : t.replace(/^form:.*$/m, (m) => m + "\n" + line);
  fs.writeFileSync(md, t);
  n++;
}
console.log("完成", n, "張");
