// ============================================================
// 插圖元件庫：Q 版人物、動物、道具
// 每個元件都以「底部中央」為原點 (0,0)，高度大約 100～130。
// 風格：深棕描邊、圓潤造型、腮紅。顏色集中在 C。
// ============================================================
export const C = {
  ink: "#3A2E28", skin: "#F6D7B8", blush: "#F4A9A0", white: "#FFFDF8",
  blue: "#7FA7C9", red: "#D8806A", green: "#8CC47A", yellow: "#F6C453", gold: "#E9B44C",
  brown: "#B5835A", wood: "#D8B48A", grey: "#9AA6AD", pink: "#F2B5C4", orange: "#F0A04B",
  water: "#7FB7E0", jade: "#8FC9B0", purple: "#B9A3D6", dark: "#4A5568",
};
const S = `stroke="${C.ink}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

// ---------- 表情 ----------
// mood: n 一般 / h 開心 / s 難過 / x 驚訝 / z 閉眼 / w 得意 / a 生氣
export function face(cx, cy, r = 26, mood = "n") {
  const ex = r * 0.38, ey = cy + r * 0.05, k = r / 26;
  let eyes = "", mouth = "";
  const dot = (x) => `<circle cx="${x}" cy="${ey}" r="${2.8 * k}" fill="${C.ink}"/>`;
  const arc = (x, up = true) => `<path d="M${x - 5 * k} ${ey + (up ? 1 : -1) * k} q${5 * k} ${(up ? -6 : 6) * k} ${10 * k} 0" fill="none" ${S} stroke-width="${2.2 * k}"/>`;
  if (mood === "h") { eyes = arc(cx - ex) + arc(cx + ex); mouth = `<path d="M${cx - 6 * k} ${cy + 12 * k} q${6 * k} ${7 * k} ${12 * k} 0" fill="${C.ink}" ${S} stroke-width="${1.6 * k}"/>`; }
  else if (mood === "z") { eyes = arc(cx - ex, false) + arc(cx + ex, false); mouth = `<path d="M${cx - 4 * k} ${cy + 13 * k} q${4 * k} ${3 * k} ${8 * k} 0" fill="none" ${S} stroke-width="${2 * k}"/>`; }
  else if (mood === "w") { eyes = arc(cx - ex, false) + arc(cx + ex, false); mouth = `<path d="M${cx - 7 * k} ${cy + 11 * k} q${8 * k} ${6 * k} ${14 * k} -3" fill="none" ${S} stroke-width="${2.2 * k}"/>`; }
  else if (mood === "x") { eyes = `<circle cx="${cx - ex}" cy="${ey}" r="${4 * k}" fill="${C.white}" ${S} stroke-width="${2 * k}"/><circle cx="${cx + ex}" cy="${ey}" r="${4 * k}" fill="${C.white}" ${S} stroke-width="${2 * k}"/>`; mouth = `<ellipse cx="${cx}" cy="${cy + 14 * k}" rx="${4 * k}" ry="${5 * k}" fill="${C.ink}"/>`; }
  else if (mood === "s") { eyes = dot(cx - ex) + dot(cx + ex) + `<path d="M${cx - ex - 6 * k} ${ey - 8 * k} l${8 * k} ${3 * k} M${cx + ex + 6 * k} ${ey - 8 * k} l${-8 * k} ${3 * k}" ${S} stroke-width="${2 * k}"/>`; mouth = `<path d="M${cx - 5 * k} ${cy + 15 * k} q${5 * k} ${-5 * k} ${10 * k} 0" fill="none" ${S} stroke-width="${2 * k}"/>`; }
  else if (mood === "a") { eyes = dot(cx - ex) + dot(cx + ex) + `<path d="M${cx - ex - 6 * k} ${ey - 9 * k} l${9 * k} ${4 * k} M${cx + ex + 6 * k} ${ey - 9 * k} l${-9 * k} ${4 * k}" ${S} stroke-width="${2.2 * k}"/>`; mouth = `<path d="M${cx - 6 * k} ${cy + 15 * k} h${12 * k}" ${S} stroke-width="${2.2 * k}"/>`; }
  else { eyes = dot(cx - ex) + dot(cx + ex); mouth = `<path d="M${cx - 4 * k} ${cy + 11 * k} q${4 * k} ${4 * k} ${8 * k} 0" fill="none" ${S} stroke-width="${2 * k}"/>`; }
  const blush = `<ellipse cx="${cx - r * 0.62}" cy="${cy + r * 0.38}" rx="${4.5 * k}" ry="${2.8 * k}" fill="${C.blush}"/><ellipse cx="${cx + r * 0.62}" cy="${cy + r * 0.38}" rx="${4.5 * k}" ry="${2.8 * k}" fill="${C.blush}"/>`;
  return eyes + blush + mouth;
}

// ---------- 人物 ----------
// 共用身體，hat 決定身分
function person({ robe, hat, mood, beard = false, small = false, hold = "" }) {
  const k = small ? 0.72 : 1;
  const hy = -86 * k, r = 26 * k;
  let h = "";
  const hats = {
    scholar: `<path d="M${-24 * k} ${hy - 12 * k} q${24 * k} ${-30 * k} ${48 * k} 0 z" fill="${C.ink}" ${S}/><rect x="${-6 * k}" y="${hy - 34 * k}" width="${12 * k}" height="${10 * k}" rx="3" fill="${C.ink}"/>`,
    farmer: `<path d="M${-38 * k} ${hy - 8 * k} L0 ${hy - 40 * k} L${38 * k} ${hy - 8 * k} Q0 ${hy} ${-38 * k} ${hy - 8 * k}Z" fill="${C.gold}" ${S}/>`,
    general: `<path d="M${-27 * k} ${hy - 4 * k} q${27 * k} ${-44 * k} ${54 * k} 0 z" fill="${C.grey}" ${S}/><path d="M0 ${hy - 26 * k} q${-4 * k} ${-18 * k} ${10 * k} ${-22 * k}" fill="none" stroke="#C8553D" stroke-width="${6 * k}" stroke-linecap="round"/>`,
    king: `<rect x="${-30 * k}" y="${hy - 36 * k}" width="${60 * k}" height="${8 * k}" rx="2" fill="${C.ink}" ${S}/><rect x="${-14 * k}" y="${hy - 30 * k}" width="${28 * k}" height="${10 * k}" fill="${C.gold}" ${S}/><path d="M${-24 * k} ${hy - 28 * k} v${10 * k} M${-18 * k} ${hy - 28 * k} v${12 * k} M${18 * k} ${hy - 28 * k} v${12 * k} M${24 * k} ${hy - 28 * k} v${10 * k}" ${S} stroke-width="1.6"/>`,
    lady: `<circle cx="0" cy="${hy - 28 * k}" r="${12 * k}" fill="${C.ink}"/><path d="M${-26 * k} ${hy + 2 * k} q0 ${-32 * k} ${26 * k} ${-30 * k} q${26 * k} ${-2 * k} ${26 * k} ${30 * k} q${-10 * k} ${-18 * k} ${-26 * k} ${-18 * k} q${-16 * k} 0 ${-26 * k} ${18 * k}z" fill="${C.ink}"/><circle cx="${12 * k}" cy="${hy - 34 * k}" r="${4 * k}" fill="#C8553D"/>`,
    child: `<circle cx="${-18 * k}" cy="${hy - 22 * k}" r="${9 * k}" fill="${C.ink}"/><circle cx="${18 * k}" cy="${hy - 22 * k}" r="${9 * k}" fill="${C.ink}"/><path d="M${-22 * k} ${hy - 6 * k} q${22 * k} ${-22 * k} ${44 * k} 0 q${-22 * k} ${-8 * k} ${-44 * k} 0z" fill="${C.ink}"/>`,
    old: `<path d="M${-22 * k} ${hy - 10 * k} q${22 * k} ${-26 * k} ${44 * k} 0 q${-22 * k} ${-10 * k} ${-44 * k} 0z" fill="#E8E4DC" ${S}/><circle cx="0" cy="${hy - 26 * k}" r="${7 * k}" fill="#E8E4DC" ${S}/>`,
    soldier: `<path d="M${-27 * k} ${hy - 4 * k} q${27 * k} ${-40 * k} ${54 * k} 0 z" fill="#8C7A6B" ${S}/>`,
    monk: ``,
  };
  h += `<path d="M${-36 * k} 0 Q${-38 * k} ${-58 * k} 0 ${-64 * k} Q${38 * k} ${-58 * k} ${36 * k} 0 Z" fill="${robe}" ${S}/>`;
  h += `<path d="M${-8 * k} ${-62 * k} L0 ${-44 * k} L${8 * k} ${-62 * k}" fill="none" ${S} stroke-width="2"/>`;
  h += `<circle cx="0" cy="${hy}" r="${r}" fill="${C.skin}" ${S}/>`;
  h += face(0, hy, r, mood);
  if (beard) h += `<path d="M${-12 * k} ${hy + 18 * k} q${12 * k} ${30 * k} ${24 * k} 0 q${-12 * k} ${6 * k} ${-24 * k} 0z" fill="#E8E4DC" ${S} stroke-width="2"/>`;
  h += hats[hat] || "";
  if (hold) h += `<g transform="translate(${30 * k} ${-40 * k}) scale(${0.5 * k})">${(SPRITES[hold] || (() => ""))("n")}</g><circle cx="${28 * k}" cy="${-36 * k}" r="${8 * k}" fill="${C.skin}" ${S}/>`;
  return h;
}

// ---------- 元件表 ----------
// 每個元件是 (mood) => SVG 字串
export const SPRITES = {
  // 人物
  scholar: (m) => person({ robe: C.blue, hat: "scholar", mood: m }),
  farmer: (m) => person({ robe: "#9DBF7E", hat: "farmer", mood: m }),
  general: (m) => person({ robe: C.red, hat: "general", mood: m }),
  soldier: (m) => person({ robe: "#B8A58F", hat: "soldier", mood: m }),
  king: (m) => person({ robe: C.yellow, hat: "king", mood: m }),
  lady: (m) => person({ robe: C.pink, hat: "lady", mood: m }),
  child: (m) => person({ robe: C.orange, hat: "child", mood: m, small: true }),
  oldman: (m) => person({ robe: "#C9C2B8", hat: "old", mood: m, beard: true }),
  monk: (m) => person({ robe: "#E2A55B", hat: "monk", mood: m }),
  merchant: (m) => person({ robe: C.purple, hat: "scholar", mood: m }),

  // 動物
  rabbit: (m) => `<ellipse cx="0" cy="-22" rx="28" ry="22" fill="${C.white}" ${S}/><ellipse cx="-12" cy="-86" rx="7" ry="20" fill="${C.white}" ${S}/><ellipse cx="12" cy="-86" rx="7" ry="20" fill="${C.white}" ${S}/><ellipse cx="-12" cy="-86" rx="3" ry="12" fill="${C.pink}"/><ellipse cx="12" cy="-86" rx="3" ry="12" fill="${C.pink}"/><circle cx="0" cy="-54" r="22" fill="${C.white}" ${S}/>${face(0, -54, 22, m)}`,
  tiger: (m) => `<ellipse cx="0" cy="-30" rx="44" ry="30" fill="${C.yellow}" ${S}/><circle cx="-26" cy="-98" r="11" fill="${C.yellow}" ${S}/><circle cx="26" cy="-98" r="11" fill="${C.yellow}" ${S}/><circle cx="0" cy="-74" r="34" fill="${C.yellow}" ${S}/><ellipse cx="0" cy="-60" rx="17" ry="11" fill="#FFF3DA"/><path d="M-6 -106 l6 12 6 -12z M-34 -78 l12 3 -12 3z M34 -78 l-12 3 12 3z M20 -30 q8 10 0 22 q-4 -10 0 -22z M36 -34 q6 8 0 16 q-3 -8 0 -16z" fill="${C.ink}"/>${face(0, -74, 34, m)}<ellipse cx="0" cy="-64" rx="5" ry="3.5" fill="${C.ink}"/>`,
  fox: (m) => `<path d="M30 -16 q40 -10 34 -50 q-18 20 -34 24z" fill="${C.orange}" ${S}/><ellipse cx="0" cy="-22" rx="30" ry="22" fill="${C.orange}" ${S}/><ellipse cx="-8" cy="-26" rx="12" ry="10" fill="${C.white}"/><path d="M-26 -84 l6 -30 18 20z M26 -84 l-6 -30 -18 20z" fill="${C.orange}" ${S}/><circle cx="0" cy="-66" r="28" fill="${C.orange}" ${S}/><path d="M-16 -56 q16 14 32 0 q-6 14 -16 14 q-10 0 -16 -14z" fill="${C.white}"/>${face(0, -68, 28, m)}`,
  frog: (m) => `<ellipse cx="0" cy="-22" rx="34" ry="22" fill="${C.green}" ${S}/><circle cx="-16" cy="-46" r="12" fill="${C.green}" ${S}/><circle cx="16" cy="-46" r="12" fill="${C.green}" ${S}/><circle cx="-16" cy="-48" r="6" fill="${C.white}"/><circle cx="16" cy="-48" r="6" fill="${C.white}"/><circle cx="-16" cy="-48" r="3" fill="${C.ink}"/><circle cx="16" cy="-48" r="3" fill="${C.ink}"/><path d="M-10 -20 q10 7 20 0" fill="none" ${S} stroke-width="2"/><ellipse cx="-20" cy="-24" rx="5" ry="3" fill="${C.blush}"/><ellipse cx="20" cy="-24" rx="5" ry="3" fill="${C.blush}"/>`,
  snake: (m) => `<path d="M-50 -10 C-30 -40 -10 10 10 -14 S40 -30 50 -8" fill="none" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/><path d="M-50 -10 C-30 -40 -10 10 10 -14 S40 -30 50 -8" fill="none" stroke="${C.green}" stroke-width="16" stroke-linecap="round"/><ellipse cx="-56" cy="-30" rx="22" ry="18" fill="${C.green}" ${S}/>${face(-56, -32, 18, m)}`,
  sheep: (m) => `<path d="M-34 -20 a14 14 0 0 1 14 -24 a16 16 0 0 1 28 -6 a14 14 0 0 1 24 14 a12 12 0 0 1 -2 24 h-56 a12 12 0 0 1 -8 -8z" fill="${C.white}" ${S}/><path d="M-20 0 v-10 M20 0 v-10" ${S} stroke-width="5"/><ellipse cx="-34" cy="-36" rx="16" ry="18" fill="#6F5F55" ${S}/><circle cx="-39" cy="-38" r="2.4" fill="#fff"/><circle cx="-29" cy="-38" r="2.4" fill="#fff"/>`,
  horse: (m) => `<path d="M-40 -40 q-18 4 -16 24" fill="none" stroke="#6F4A2E" stroke-width="7" stroke-linecap="round"/><path d="M-26 -24 v24 M-10 -24 v24 M12 -24 v24 M26 -24 v24" ${S} stroke-width="8"/><ellipse cx="0" cy="-40" rx="42" ry="22" fill="#C99A6B" ${S}/><path d="M24 -50 q6 -24 18 -38" ${S} stroke="#C99A6B" stroke-width="20"/><ellipse cx="46" cy="-86" rx="18" ry="22" fill="#C99A6B" ${S}/><path d="M36 -104 l-2 -12 8 6 M52 -104 l4 -12 4 10" fill="#C99A6B" ${S} stroke-width="2"/><path d="M32 -100 q-12 20 -14 44" fill="none" stroke="#6F4A2E" stroke-width="7" stroke-linecap="round"/><ellipse cx="50" cy="-74" rx="10" ry="7" fill="#E8C8A8" ${S} stroke-width="2"/>${face(46, -90, 16, m)}`,
  ox: (m) => `<path d="M-46 -48 h76 a16 16 0 0 1 16 16 v10 h-108 v-10 a16 16 0 0 1 16 -16z" fill="#A98467" ${S}/><path d="M-38 -22 v22 M-20 -22 v22 M18 -22 v22 M34 -22 v22" ${S} stroke-width="8"/><ellipse cx="44" cy="-58" rx="22" ry="20" fill="#A98467" ${S}/><path d="M28 -74 q-10 -10 -4 -20 M60 -74 q10 -10 4 -20" fill="none" stroke="#EFE3CC" stroke-width="6" stroke-linecap="round"/><ellipse cx="48" cy="-48" rx="12" ry="7" fill="#E8C8B0" ${S} stroke-width="2"/>${face(44, -62, 18, m)}`,
  dog: (m) => `<ellipse cx="0" cy="-22" rx="32" ry="20" fill="#E3C49A" ${S}/><path d="M-20 0 v-8 M18 0 v-8" ${S} stroke-width="6"/><circle cx="-26" cy="-56" r="22" fill="#E3C49A" ${S}/><ellipse cx="-44" cy="-56" rx="8" ry="14" fill="#B5835A" ${S}/><ellipse cx="-8" cy="-56" rx="8" ry="14" fill="#B5835A" ${S}/>${face(-26, -56, 22, m)}<path d="M30 -28 q14 -14 8 -26" fill="none" ${S} stroke-width="5"/>`,
  chicken: (m) => `<ellipse cx="0" cy="-30" rx="28" ry="26" fill="${C.white}" ${S}/><path d="M18 -40 q22 -20 18 -40 q-10 6 -14 20 q-8 -16 -16 -14 q4 16 12 34z" fill="#E2A55B" ${S}/><circle cx="-14" cy="-62" r="16" fill="${C.white}" ${S}/><path d="M-22 -78 q4 -10 8 -2 q4 -10 8 0 q4 -8 6 4" fill="#E0624A" ${S} stroke-width="2"/><path d="M-30 -62 l-10 4 10 3z" fill="${C.gold}" ${S} stroke-width="2"/><circle cx="-16" cy="-64" r="2.6" fill="${C.ink}"/><path d="M-8 0 v-6 M8 0 v-6" ${S} stroke="${C.gold}" stroke-width="4"/>`,
  bird: (m) => `<ellipse cx="0" cy="-20" rx="22" ry="18" fill="${C.water}" ${S}/><path d="M-4 -24 q14 -6 22 6 q-12 2 -22 -6z" fill="#5B9BD0" ${S} stroke-width="2"/><circle cx="-14" cy="-36" r="12" fill="${C.water}" ${S}/><path d="M-26 -36 l-10 3 10 3z" fill="${C.gold}" ${S} stroke-width="2"/><circle cx="-16" cy="-38" r="2.4" fill="${C.ink}"/><ellipse cx="-10" cy="-32" rx="3" ry="2" fill="${C.blush}"/>`,
  crane: (m) => `<path d="M-6 0 v-40 M6 0 v-40" ${S} stroke-width="3"/><ellipse cx="0" cy="-56" rx="30" ry="20" fill="${C.white}" ${S}/><path d="M14 -60 q18 -4 22 10 q-12 0 -22 -10z" fill="${C.ink}"/><path d="M-20 -62 q-10 -30 0 -50" fill="none" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/><path d="M-20 -62 q-10 -30 0 -50" fill="none" stroke="${C.white}" stroke-width="5" stroke-linecap="round"/><circle cx="-2" cy="-114" r="10" fill="${C.white}" ${S}/><circle cx="-2" cy="-122" r="5" fill="#E0624A"/><path d="M-12 -114 l-18 4 18 3z" fill="${C.gold}" ${S} stroke-width="2"/><circle cx="-4" cy="-116" r="2" fill="${C.ink}"/>`,
  fish: (m) => `<path d="M30 -24 l22 -14 v28z" fill="${C.orange}" ${S}/><ellipse cx="0" cy="-24" rx="34" ry="20" fill="${C.orange}" ${S}/><path d="M8 -40 q6 16 0 32" fill="none" ${S} stroke-width="2"/><circle cx="-18" cy="-28" r="3" fill="${C.ink}"/><ellipse cx="-16" cy="-18" rx="4" ry="2.4" fill="${C.blush}"/>`,
  dragon: (m) => `<path d="M-70 -20 C-40 -70 0 10 30 -40 S70 -60 80 -20" fill="none" stroke="${C.ink}" stroke-width="26" stroke-linecap="round"/><path d="M-70 -20 C-40 -70 0 10 30 -40 S70 -60 80 -20" fill="none" stroke="${C.jade}" stroke-width="20" stroke-linecap="round"/><path d="M-50 -50 l6 -12 6 10 M-10 -24 l6 -12 6 10 M30 -56 l6 -12 6 10" fill="${C.gold}" ${S} stroke-width="2"/><ellipse cx="-80" cy="-44" rx="26" ry="22" fill="${C.jade}" ${S}/><path d="M-92 -64 q-6 -16 4 -24 M-70 -64 q2 -16 14 -20" fill="none" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/><path d="M-104 -36 q-20 -6 -26 4 M-104 -32 q-18 6 -20 18" fill="none" ${S} stroke-width="2"/>${face(-80, -46, 22, m)}`,
  monkey: (m) => `<path d="M24 -10 q30 -10 20 -40" fill="none" ${S} stroke="#8C6A4A" stroke-width="6"/><ellipse cx="0" cy="-24" rx="24" ry="24" fill="#B08A64" ${S}/><circle cx="-26" cy="-70" r="9" fill="#E8C8A8" ${S}/><circle cx="26" cy="-70" r="9" fill="#E8C8A8" ${S}/><circle cx="0" cy="-68" r="26" fill="#B08A64" ${S}/><ellipse cx="0" cy="-62" rx="18" ry="16" fill="#E8C8A8"/>${face(0, -64, 22, m)}`,
  deer: (m) => `<path d="M-34 -36 h56 a12 12 0 0 1 12 12 v4 h-80 v-4 a12 12 0 0 1 12 -12z" fill="#D29B66" ${S}/><path d="M-26 -20 v20 M-10 -20 v20 M12 -20 v20 M26 -20 v20" ${S} stroke-width="6"/><path d="M22 -32 l8 -34" ${S} stroke="#D29B66" stroke-width="12"/><circle cx="34" cy="-74" r="18" fill="#D29B66" ${S}/><path d="M26 -90 l-8 -18 m4 8 l-10 -2 M42 -90 l8 -18 m-4 8 l10 -2" fill="none" stroke="#8C6A4A" stroke-width="4" stroke-linecap="round"/><g fill="#FFF3DA"><circle cx="-18" cy="-30" r="3"/><circle cx="0" cy="-30" r="3"/><circle cx="-8" cy="-24" r="2.5"/></g>${face(34, -74, 18, m)}`,
  donkey: (m) => `<path d="M-26 -24 v24 M-10 -24 v24 M12 -24 v24 M26 -24 v24" ${S} stroke-width="8"/><ellipse cx="0" cy="-40" rx="40" ry="22" fill="#9AA6AD" ${S}/><path d="M22 -50 q6 -20 18 -32" ${S} stroke="#9AA6AD" stroke-width="18"/><ellipse cx="34" cy="-112" rx="5" ry="18" fill="#9AA6AD" ${S}/><ellipse cx="52" cy="-112" rx="5" ry="18" fill="#9AA6AD" ${S}/><ellipse cx="44" cy="-84" rx="18" ry="20" fill="#9AA6AD" ${S}/><ellipse cx="48" cy="-72" rx="10" ry="7" fill="#D5DADD" ${S} stroke-width="2"/>${face(44, -88, 15, m)}`,
  clam: (m) => `<path d="M-30 -8 q30 -40 60 0 z" fill="#E8D3B8" ${S}/><path d="M-30 -8 q30 20 60 0" fill="#F3E6D3" ${S}/><path d="M-14 -20 l4 -8 M0 -24 v-8 M14 -20 l-4 -8" ${S} stroke-width="2"/>`,
  turtle: (m) => `<circle cx="-40" cy="-22" r="12" fill="#9BBF8A" ${S}/><path d="M-30 -10 Q0 -60 34 -10 Z" fill="#6E9E73" ${S}/><path d="M-20 -18 Q0 -44 24 -18" fill="none" stroke="#4F7A55" stroke-width="2"/><circle cx="-43" cy="-24" r="2.4" fill="${C.ink}"/>`,
  mouse: (m) => `<path d="M24 -8 q20 0 22 -14" fill="none" ${S} stroke-width="2"/><ellipse cx="0" cy="-14" rx="24" ry="14" fill="#B8B2AA" ${S}/><circle cx="-20" cy="-30" r="9" fill="#B8B2AA" ${S}/><circle cx="-8" cy="-30" r="9" fill="#B8B2AA" ${S}/><circle cx="-20" cy="-30" r="4" fill="${C.pink}"/><circle cx="-8" cy="-30" r="4" fill="${C.pink}"/><circle cx="-22" cy="-16" r="2.4" fill="${C.ink}"/>`,
  butterfly: (m) => `<ellipse cx="-14" cy="-30" rx="14" ry="12" fill="${C.pink}" ${S}/><ellipse cx="14" cy="-30" rx="14" ry="12" fill="${C.pink}" ${S}/><ellipse cx="-10" cy="-12" rx="9" ry="8" fill="${C.purple}" ${S}/><ellipse cx="10" cy="-12" rx="9" ry="8" fill="${C.purple}" ${S}/><rect x="-3" y="-36" width="6" height="32" rx="3" fill="${C.ink}"/><path d="M-2 -36 q-6 -10 -10 -10 M2 -36 q6 -10 10 -10" fill="none" ${S} stroke-width="1.8"/>`,
  mantis: (m) => `<path d="M-20 0 l10 -20 M10 0 l-4 -20" ${S} stroke="${C.green}" stroke-width="4"/><ellipse cx="0" cy="-24" rx="26" ry="8" fill="${C.green}" ${S}/><path d="M18 -28 l10 -26" ${S} stroke="${C.green}" stroke-width="7"/><path d="M26 -46 l14 -10 m-14 10 l12 8" ${S} stroke="#5E9A4E" stroke-width="5"/><path d="M24 -58 l10 -6 6 8 -10 6z" fill="${C.green}" ${S}/><circle cx="34" cy="-62" r="2.4" fill="${C.ink}"/>`,
  cicada: (m) => `<ellipse cx="0" cy="-20" rx="10" ry="18" fill="#7D6B4E" ${S}/><path d="M-4 -30 q-26 6 -18 34 q12 -16 18 -34z M4 -30 q26 6 18 34 q-12 -16 -18 -34z" fill="#DCEFF3" ${S} opacity=".9"/>`,
  elephant: (m) => `<ellipse cx="0" cy="-40" rx="46" ry="32" fill="${C.grey}" ${S}/><path d="M-30 -14 v14 M-10 -14 v14 M12 -14 v14 M30 -14 v14" ${S} stroke-width="10"/><circle cx="-40" cy="-60" r="22" fill="${C.grey}" ${S}/><path d="M-56 -50 q-10 20 -2 40" fill="none" stroke="${C.ink}" stroke-width="12" stroke-linecap="round"/><path d="M-56 -50 q-10 20 -2 40" fill="none" stroke="${C.grey}" stroke-width="7" stroke-linecap="round"/><ellipse cx="-24" cy="-62" rx="12" ry="16" fill="#C2CBD0" ${S}/>${face(-40, -64, 18, m)}`,

  // 道具
  sword: () => `<path d="M-3 -10 l0 -80 3 -10 3 10 0 80z" fill="#D9E2E6" ${S}/><rect x="-14" y="-12" width="28" height="6" rx="3" fill="${C.gold}" ${S}/><rect x="-4" y="-6" width="8" height="16" rx="3" fill="#6F4A2E" ${S}/>`,
  spear: () => `<path d="M0 0 v-110" ${S} stroke="#9C6B43" stroke-width="5"/><path d="M0 -110 l-7 -10 7 -18 7 18z" fill="#D9E2E6" ${S}/><path d="M-6 -104 q6 8 12 0" fill="#C8553D"/>`,
  bow: () => `<path d="M-10 -100 q40 50 0 100" fill="none" stroke="#9C6B43" stroke-width="6" stroke-linecap="round"/><path d="M-10 -100 v100" stroke="${C.ink}" stroke-width="1.6"/><path d="M-30 -50 h50" ${S} stroke-width="3"/><path d="M20 -50 l-8 -5 v10z" fill="${C.grey}" ${S} stroke-width="1.6"/>`,
  arrow: () => `<path d="M-40 0 h70" ${S} stroke-width="3"/><path d="M30 0 l-10 -6 v12z" fill="${C.grey}" ${S} stroke-width="2"/><path d="M-40 0 l-8 -6 M-40 0 l-8 6 M-34 0 l-8 -6 M-34 0 l-8 6" ${S} stroke="#C8553D" stroke-width="2"/>`,
  drum: () => `<ellipse cx="0" cy="-60" rx="30" ry="10" fill="#F3E2C2" ${S}/><path d="M-30 -60 v40 q30 16 60 0 v-40" fill="#C8553D" ${S}/><path d="M-30 -20 l-6 20 M30 -20 l6 20" ${S} stroke-width="4"/><circle cx="-14" cy="-36" r="2.4" fill="${C.gold}"/><circle cx="0" cy="-32" r="2.4" fill="${C.gold}"/><circle cx="14" cy="-36" r="2.4" fill="${C.gold}"/>`,
  scroll: () => `<rect x="-30" y="-50" width="60" height="44" rx="3" fill="#FFF6E5" ${S}/><rect x="-36" y="-56" width="8" height="56" rx="4" fill="#C8553D" ${S}/><rect x="28" y="-56" width="8" height="56" rx="4" fill="#C8553D" ${S}/><path d="M-20 -40 h40 M-20 -30 h32 M-20 -20 h36" stroke="#C9B48A" stroke-width="2"/>`,
  book: () => `<path d="M-34 -6 v-40 q17 -8 34 0 q17 -8 34 0 v40 q-17 -8 -34 0 q-17 -8 -34 0z" fill="#FFF6E5" ${S}/><path d="M0 -46 v40" ${S} stroke-width="2"/><path d="M-26 -36 h18 M-26 -28 h18 M8 -36 h18 M8 -28 h18" stroke="#C9B48A" stroke-width="2"/>`,
  brush: () => `<g transform="rotate(25)"><rect x="-5" y="-90" width="10" height="70" rx="4" fill="#B5835A" ${S}/><path d="M-7 -22 h14 l-3 20 q-4 6 -8 0z" fill="${C.ink}"/></g>`,
  cup: () => `<path d="M-20 -40 h40 l-4 34 q-16 8 -32 0z" fill="#D9A55B" ${S}/><ellipse cx="0" cy="-40" rx="20" ry="5" fill="#F3D9A8" ${S}/><path d="M20 -32 q12 4 4 16" fill="none" ${S}/>`,
  jar: () => `<path d="M-20 -70 h40 v8 q20 10 20 34 q0 28 -40 28 q-40 0 -40 -28 q0 -24 20 -34z" fill="#C9A27C" ${S}/><rect x="-14" y="-46" width="28" height="22" rx="3" fill="#E9D9B8" ${S} stroke-width="2"/>`,
  jade: () => `<circle cx="0" cy="-34" r="30" fill="${C.jade}" ${S}/><circle cx="0" cy="-34" r="10" fill="#FDF1DC" ${S}/><path d="M-18 -50 q6 -6 12 -2" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  boat: () => `<path d="M-70 -20 h140 q-10 22 -40 22 h-60 q-30 0 -40 -22z" fill="#B5835A" ${S}/><path d="M0 -20 v-80" ${S} stroke-width="4"/><path d="M4 -96 q36 30 4 66z" fill="#FFF6E5" ${S}/>`,
  cart: () => `<rect x="-50" y="-56" width="90" height="26" rx="4" fill="#C99A6B" ${S}/><circle cx="-28" cy="-22" r="22" fill="none" ${S} stroke-width="4"/><circle cx="20" cy="-22" r="22" fill="none" ${S} stroke-width="4"/><path d="M-28 -44 v44 M-50 -22 h44 M20 -44 v44 M-2 -22 h44" ${S} stroke-width="2"/><path d="M40 -44 h40" ${S} stroke-width="5"/>`,
  tree: () => `<rect x="-8" y="-60" width="16" height="60" rx="4" fill="#9C6B43" ${S}/><circle cx="-24" cy="-80" r="28" fill="#9CCB8A" ${S}/><circle cx="22" cy="-84" r="30" fill="#9CCB8A" ${S}/><circle cx="0" cy="-110" r="30" fill="#AED394" ${S}/>`,
  pine: () => `<rect x="-6" y="-30" width="12" height="30" fill="#9C6B43" ${S}/><path d="M0 -130 l-34 50 h18 l-26 36 h84 l-26 -36 h18z" fill="#6E9E73" ${S}/>`,
  bamboo: () => `<g fill="#9CCB8A" ${S}><rect x="-22" y="-130" width="12" height="130" rx="5"/><rect x="4" y="-110" width="12" height="110" rx="5"/></g><path d="M-22 -90 h12 M-22 -50 h12 M4 -70 h12 M4 -34 h12" ${S} stroke-width="2"/><path d="M-10 -100 q20 -10 30 -4 q-18 10 -30 4z M16 -80 q18 -8 26 0 q-16 8 -26 0z" fill="#AED394" ${S} stroke-width="2"/>`,
  flower: () => `<path d="M0 0 v-40" ${S} stroke="#5E9A4E" stroke-width="4"/><path d="M0 -20 q-16 -8 -18 2 q10 6 18 -2z" fill="${C.green}" ${S} stroke-width="2"/><g fill="${C.pink}" ${S} stroke-width="2"><circle cx="0" cy="-58" r="9"/><circle cx="-12" cy="-48" r="9"/><circle cx="12" cy="-48" r="9"/><circle cx="-7" cy="-36" r="9"/><circle cx="7" cy="-36" r="9"/></g><circle cx="0" cy="-46" r="6" fill="${C.gold}"/>`,
  peach: () => `<path d="M0 -8 q-30 -2 -26 -30 q4 -18 26 -12 q22 -6 26 12 q4 28 -26 30z" fill="#F7B6A6" ${S}/><path d="M0 -50 q-4 18 0 40" fill="none" ${S} stroke-width="2"/><path d="M0 -50 q14 -14 26 -6 q-12 10 -26 6z" fill="${C.green}" ${S} stroke-width="2"/>`,
  plum: () => `<g fill="#9C6BB8" ${S}><circle cx="-12" cy="-16" r="14"/><circle cx="12" cy="-18" r="14"/></g><path d="M0 -30 q-2 -14 8 -20" fill="none" ${S} stroke-width="2"/><path d="M8 -46 q14 -6 20 2 q-12 6 -20 -2z" fill="${C.green}" ${S} stroke-width="2"/>`,
  orange: () => `<circle cx="0" cy="-26" r="24" fill="${C.orange}" ${S}/><path d="M0 -50 q10 -12 22 -6 q-10 10 -22 6z" fill="${C.green}" ${S} stroke-width="2"/><circle cx="-8" cy="-34" r="3" fill="#FFD29A"/>`,
  mountain: () => `<path d="M-120 0 L-40 -120 L0 -70 L40 -140 L130 0 Z" fill="#A9C7B0" ${S}/><path d="M-40 -120 l-16 24 16 -6 10 10z M40 -140 l-20 30 20 -8 14 12z" fill="#FFFDF8" ${S} stroke-width="2"/>`,
  rock: () => `<path d="M-40 0 q-6 -30 16 -40 q20 -14 40 0 q24 8 24 40z" fill="#B8B2AA" ${S}/><path d="M-14 -28 q10 -6 18 2" fill="none" stroke="#8F8A84" stroke-width="2"/>`,
  house: () => `<rect x="-50" y="-60" width="100" height="60" fill="#F3E2C2" ${S}/><path d="M-66 -58 L0 -100 L66 -58 Z" fill="#8C6A4A" ${S}/><rect x="-14" y="-38" width="28" height="38" fill="#B5835A" ${S}/><rect x="-42" y="-46" width="20" height="18" fill="#DCEFF3" ${S} stroke-width="2"/>`,
  palace: () => `<rect x="-80" y="-70" width="160" height="70" fill="#E8C8A8" ${S}/><path d="M-100 -68 q100 -50 200 0 z" fill="#C8553D" ${S}/><path d="M-90 -100 q90 -40 180 0 l-16 8 h-148z" fill="#C8553D" ${S}/><g fill="#C8553D" ${S}><rect x="-66" y="-66" width="12" height="66"/><rect x="54" y="-66" width="12" height="66"/><rect x="-28" y="-66" width="12" height="66"/><rect x="16" y="-66" width="12" height="66"/></g>`,
  wall: () => `<rect x="-90" y="-80" width="180" height="80" fill="#C9A27C" ${S}/><path d="M-90 -80 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14 h20 v-14 h20 v14" fill="#C9A27C" ${S}/><path d="M-24 0 v-34 q24 -24 48 0 v34z" fill="#6F5F55" ${S}/><path d="M-90 -50 h180 M-90 -24 h66 M24 -24 h66" stroke="#A97F58" stroke-width="2"/>`,
  well: () => `<rect x="-36" y="-40" width="72" height="40" fill="#C9A27C" ${S}/><ellipse cx="0" cy="-40" rx="36" ry="9" fill="#5B7F8F" ${S}/><path d="M-30 -40 v-50 M30 -40 v-50 M-36 -90 h72" ${S} stroke-width="5" stroke="#9C6B43"/><path d="M0 -90 v30" ${S} stroke-width="2"/><rect x="-8" y="-62" width="16" height="12" fill="#B5835A" ${S} stroke-width="2"/>`,
  pot: () => `<path d="M-40 -46 h80 q4 40 -40 44 q-44 -4 -40 -44z" fill="#6F5F55" ${S}/><path d="M-46 -46 h92" ${S} stroke-width="5"/><path d="M-40 -46 l-10 -8 M40 -46 l10 -8" ${S} stroke-width="5"/>`,
  ding: () => `<path d="M-40 -60 h80 q0 40 -40 40 q-40 0 -40 -40z" fill="#B08A3E" ${S}/><path d="M-30 -60 v-14 h10 v14 M20 -60 v-14 h10 v14" fill="none" ${S} stroke-width="4"/><path d="M-26 -26 l-6 26 M26 -26 l6 26 M0 -20 v20" ${S} stroke-width="6"/><path d="M-26 -46 q26 10 52 0" fill="none" stroke="#7E6128" stroke-width="2"/>`,
  qin: () => `<rect x="-70" y="-24" width="140" height="18" rx="9" fill="#8C6A4A" ${S}/><path d="M-60 -18 h120 M-60 -14 h120 M-60 -10 h120" stroke="#F3E2C2" stroke-width="1.2"/><circle cx="-50" cy="-15" r="2" fill="${C.gold}"/><path d="M-50 -6 v6 M50 -6 v6" ${S} stroke-width="4"/>`,
  gold: () => `<path d="M-30 -6 q-6 -20 10 -22 q20 -14 40 0 q16 2 10 22z" fill="${C.gold}" ${S}/><path d="M-12 -24 q12 -12 24 0" fill="none" stroke="#FFF3C4" stroke-width="3" stroke-linecap="round"/>`,
  coins: () => `<g fill="${C.gold}" ${S}><ellipse cx="-14" cy="-8" rx="16" ry="6"/><ellipse cx="-14" cy="-16" rx="16" ry="6"/><ellipse cx="12" cy="-10" rx="16" ry="6"/><ellipse cx="0" cy="-24" rx="16" ry="6"/></g><rect x="-3" y="-27" width="6" height="6" fill="#B4823C"/>`,
  flag: () => `<path d="M0 0 v-120" ${S} stroke="#9C6B43" stroke-width="5"/><path d="M2 -118 h50 l-10 18 10 18 h-50z" fill="#C8553D" ${S}/>`,
  fence: () => `<g fill="${C.wood}" ${S}><path d="M-60 0 v-54 l8 -8 8 8 v54z"/><path d="M-20 0 v-54 l8 -8 8 8 v54z"/><path d="M20 0 v-54 l8 -8 8 8 v54z"/><rect x="-66" y="-42" width="112" height="10" rx="3"/><rect x="-66" y="-20" width="112" height="10" rx="3"/></g>`,
  letter: () => `<rect x="-26" y="-40" width="52" height="36" rx="3" fill="#FFF6E5" ${S}/><path d="M-26 -40 l26 20 26 -20" fill="none" ${S} stroke-width="2"/><circle cx="0" cy="-20" r="5" fill="#C8553D"/>`,
  pestle: () => `<rect x="-8" y="-110" width="16" height="110" rx="6" fill="#9AA6AD" ${S}/><path d="M-4 -100 v80" stroke="#fff" stroke-width="2" opacity=".6"/>`,
  needle: () => `<path d="M0 0 l-2 -60 2 -6 2 6z" fill="#D9E2E6" ${S} stroke-width="1.6"/><ellipse cx="0" cy="-58" rx="1.2" ry="3" fill="#FDF1DC"/>`,
  lamp: () => `<path d="M-16 0 h32 l-6 -10 h-20z" fill="#B5835A" ${S}/><path d="M0 -10 v-30" ${S} stroke-width="4"/><path d="M-18 -40 h36 l-6 8 h-24z" fill="#B5835A" ${S}/><path d="M0 -44 q-10 -14 0 -30 q10 16 0 30z" fill="#F8C95A" ${S} stroke-width="2"/>`,
  candle: () => `<rect x="-10" y="-50" width="20" height="50" rx="3" fill="#FFF6E5" ${S}/><path d="M0 -54 q-8 -12 0 -24 q8 12 0 24z" fill="#F8C95A" ${S} stroke-width="2"/>`,
  weiqi: () => `<rect x="-40" y="-30" width="80" height="24" rx="3" fill="#E3C08A" ${S}/><path d="M-30 -30 h60" stroke="#9C6B43" stroke-width="1"/><g ${S} stroke-width="1.5"><circle cx="-18" cy="-36" r="6" fill="${C.ink}"/><circle cx="2" cy="-36" r="6" fill="#fff"/><circle cx="18" cy="-38" r="6" fill="${C.ink}"/></g>`,
  bell: () => `<path d="M-26 0 q0 -50 26 -56 q26 6 26 56z" fill="#B08A3E" ${S}/><rect x="-6" y="-66" width="12" height="12" fill="#B08A3E" ${S}/><path d="M-20 -16 h40" stroke="#7E6128" stroke-width="2"/>`,
  mirror: () => `<circle cx="0" cy="-40" r="30" fill="#E8D3B8" ${S}/><circle cx="0" cy="-40" r="22" fill="#DCEFF3" ${S} stroke-width="2"/><path d="M-10 -54 q8 -4 14 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`,
  mirror_half: () => `<path d="M0 -70 a30 30 0 0 0 0 60 l6 -14 -8 -10 6 -12 -6 -10z" fill="#E8D3B8" ${S}/><path d="M-2 -62 a22 22 0 0 0 0 44" fill="#DCEFF3"/>`,
  axe: () => `<path d="M0 0 v-90" ${S} stroke="#9C6B43" stroke-width="6"/><path d="M0 -90 q22 -6 28 14 q-14 0 -28 6z" fill="${C.grey}" ${S}/>`,
  hoe: () => `<path d="M-40 0 l60 -80" ${S} stroke="#9C6B43" stroke-width="6"/><path d="M14 -86 l20 -2 -2 24z" fill="${C.grey}" ${S}/>`,
  basket: () => `<path d="M-30 -36 h60 l-8 36 h-44z" fill="#E3B860" ${S}/><path d="M-26 -24 h52 M-24 -12 h48" stroke="#B4823C" stroke-width="2"/><path d="M-20 -36 q20 -30 40 0" fill="none" ${S} stroke-width="3"/>`,
  sprout: () => `<path d="M0 0 v-30" ${S} stroke="#5E9A4E" stroke-width="4"/><path d="M0 -26 q-20 -16 -26 -2 q10 8 26 2z M0 -26 q20 -16 26 -2 q-10 8 -26 2z" fill="${C.green}" ${S} stroke-width="2"/>`,
  fire: () => `<path d="M0 0 q-30 0 -26 -30 q4 -16 14 -24 q-2 14 8 18 q-4 -24 14 -40 q2 22 16 32 q12 12 2 30 q-8 14 -28 14z" fill="#F08A4B" ${S}/><path d="M0 -6 q-12 -2 -10 -16 q4 -10 10 -14 q2 12 10 16 q2 12 -10 14z" fill="#F8C95A"/>`,
  firewood: () => `<g fill="#B5835A" ${S}><rect x="-40" y="-16" width="80" height="12" rx="6" transform="rotate(-8)"/><rect x="-36" y="-28" width="76" height="12" rx="6" transform="rotate(6)"/><rect x="-30" y="-40" width="64" height="12" rx="6"/></g>`,
  wave: () => `<path d="M-80 0 q20 -24 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#5B9BD0" stroke-width="6" stroke-linecap="round"/><path d="M-60 -20 q20 -20 40 0 t40 0 t40 0" fill="none" stroke="#7FB7E0" stroke-width="5" stroke-linecap="round"/>`,
  cloud: () => `<g fill="#fff" ${S} stroke-width="2"><path d="M-40 0 a18 18 0 0 1 6 -34 a24 24 0 0 1 44 -8 a20 20 0 0 1 32 22 a14 14 0 0 1 -4 20z"/></g>`,
  sun: () => `<circle cx="0" cy="-40" r="28" fill="#F8C95A"/><g stroke="#F8C95A" stroke-width="5" stroke-linecap="round"><path d="M0 -80 v-10 M0 0 v10 M-40 -40 h-10 M40 -40 h10 M-28 -68 l-7 -7 M28 -68 l7 -7 M-28 -12 l-7 7 M28 -12 l7 7"/></g>`,
  moon: () => `<path d="M10 -70 a34 34 0 1 0 26 54 a28 28 0 1 1 -26 -54z" fill="#FCE7A6" ${S}/>`,
  star: () => `<path d="M0 -20 l5 10 11 2 -8 8 2 11 -10 -5 -10 5 2 -11 -8 -8 11 -2z" fill="#F8C95A" ${S} stroke-width="1.6"/>`,
  heart: () => `<path d="M0 -6 q-26 -16 -22 -32 q6 -14 22 -4 q16 -10 22 4 q4 16 -22 32z" fill="#F4A9A0" ${S} stroke-width="2"/>`,
  sweat: () => `<path d="M0 -24 q-10 14 0 20 q10 -6 0 -20z" fill="${C.water}" ${S} stroke-width="1.6"/>`,
  note: () => `<path d="M0 0 a7 6 0 1 1 6 -6 v-34 l18 -6 v8 l-14 4 v28" fill="${C.ink}"/>`,
  zzz: () => `<text x="0" y="0" font-family="sans-serif" font-size="22" font-weight="700" fill="${C.ink}">z<tspan font-size="16" dy="-10">z</tspan><tspan font-size="12" dy="-8">z</tspan></text>`,
  q: () => `<text x="0" y="0" font-family="sans-serif" font-size="30" font-weight="700" fill="#C8553D">?</text>`,
  ex: () => `<text x="0" y="0" font-family="sans-serif" font-size="30" font-weight="700" fill="#C8553D">!</text>`,
  sparkle: () => `<path d="M0 -24 q3 18 18 21 q-15 3 -18 21 q-3 -18 -18 -21 q15 -3 18 -21z" fill="#F8C95A" ${S} stroke-width="1.6"/>`,
  bubble: () => `<path d="M-40 -60 h80 a12 12 0 0 1 12 12 v18 a12 12 0 0 1 -12 12 h-50 l-14 12 2 -12 h-18 a12 12 0 0 1 -12 -12 v-18 a12 12 0 0 1 12 -12z" fill="#fff" ${S} stroke-width="2"/>`,
  motion: () => `<path d="M0 -30 h-30 M4 -14 h-40 M0 2 h-24" ${S} stroke-width="3"/>`,
  rope: () => `<path d="M0 0 q-10 -30 0 -60 q10 -30 0 -60" fill="none" stroke="#C9A27C" stroke-width="5" stroke-linecap="round"/>`,
  net: () => `<path d="M-50 -60 q50 -20 100 0 l-10 60 h-80z" fill="none" ${S} stroke-width="2"/><path d="M-40 -40 h80 M-34 -20 h68 M-20 -66 l-6 66 M0 -70 v70 M20 -66 l6 66" stroke="${C.ink}" stroke-width="1.4"/>`,
  stump: () => `<path d="M-34 0 Q-28 -24 -24 -48 H24 Q28 -24 34 0 Q16 -6 0 0 Q-16 -6 -34 0Z" fill="#B5835A" ${S}/><ellipse cx="0" cy="-48" rx="24" ry="7" fill="#E4C08F" ${S}/>`,
  stone_tablet: () => `<path d="M-30 0 v-80 q30 -20 60 0 v80z" fill="#C2CBD0" ${S}/><path d="M-16 -64 h32 M-16 -50 h32 M-16 -36 h32 M-16 -22 h32" stroke="#8F9AA0" stroke-width="2"/>`,
  sugarcane: () => `<rect x="-6" y="-100" width="12" height="100" rx="5" fill="#9C6BB8" ${S}/><path d="M-6 -70 h12 M-6 -40 h12" ${S} stroke-width="2"/>`,
  window: () => `<rect x="-40" y="-60" width="80" height="60" rx="4" fill="#DCEFF3" ${S}/><path d="M0 -60 v60 M-40 -30 h80" ${S} stroke-width="2"/>`,
  lotus: () => `<ellipse cx="0" cy="-4" rx="40" ry="8" fill="${C.green}" ${S}/><g fill="${C.pink}" ${S} stroke-width="2"><path d="M0 -10 q-20 -10 -16 -34 q12 8 16 34z"/><path d="M0 -10 q20 -10 16 -34 q-12 8 -16 34z"/><path d="M0 -10 q-8 -20 0 -44 q8 24 0 44z"/></g>`,
  shield: () => `<path d="M-26 -90 h52 v40 q0 34 -26 50 q-26 -16 -26 -50z" fill="#C8553D" ${S}/><path d="M-14 -76 h28 v22 q0 20 -14 30 q-14 -10 -14 -30z" fill="${C.gold}" ${S} stroke-width="2"/>`,
  shoe: () => `<path d="M-30 0 v-18 q0 -10 12 -10 h10 q10 0 16 10 l20 4 q6 2 6 14z" fill="#8C6A4A" ${S}/><path d="M-30 -10 h64" stroke="#6F4A2E" stroke-width="2"/>`,
  pear: () => `<path d="M0 -6 q-24 0 -22 -22 q2 -12 12 -18 q2 -16 10 -16 q8 0 10 16 q10 6 12 18 q2 22 -22 22z" fill="#E9D46A" ${S}/><path d="M0 -62 q2 -8 8 -10" fill="none" ${S} stroke-width="2"/>`,
  knife: () => `<path d="M-30 -10 h40 q16 -2 22 -14 h-62z" fill="#D9E2E6" ${S}/><rect x="-46" y="-16" width="18" height="10" rx="3" fill="#6F4A2E" ${S}/>`,
  sail_bird: () => `<path d="M-70 -30 q40 -40 70 -4 q30 -36 70 4 q-40 -10 -70 16 q-30 -26 -70 -16z" fill="#7FB7E0" ${S}/><circle cx="0" cy="-20" r="10" fill="#7FB7E0" ${S}/><path d="M8 -22 l12 4 -12 3z" fill="${C.gold}" ${S} stroke-width="2"/>`,
  tablet_gate: () => `<rect x="-60" y="-110" width="120" height="16" rx="4" fill="#C8553D" ${S}/><rect x="-50" y="-94" width="12" height="94" fill="#C8553D" ${S}/><rect x="38" y="-94" width="12" height="94" fill="#C8553D" ${S}/><rect x="-24" y="-90" width="48" height="20" fill="#FFF6E5" ${S} stroke-width="2"/>`,
};

// 同一個標籤裡重複的屬性只保留最後一個（讓元件可以覆寫預設描邊）
export function dedupe(svg) {
  return svg.replace(/<([a-zA-Z]+)((?:\s+[a-zA-Z:-]+="[^"]*")+)\s*(\/?)>/g, (m, tag, attrs, close) => {
    const map = new Map();
    for (const a of attrs.matchAll(/([a-zA-Z:-]+)="([^"]*)"/g)) { map.delete(a[1]); map.set(a[1], a[2]); }
    return `<${tag}${[...map].map(([k, v]) => ` ${k}="${v}"`).join("")}${close ? "/" : ""}>`;
  });
}
