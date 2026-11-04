// ============================================================
// 場景產生器：背景 + 元件，組成一張 400×300 的插圖
//
// 場景描述格式（一行）：
//   背景 | 元件@x,y,大小,選項 | 元件@x,y,大小,選項 ...
// 例：grass | tiger@280,240,1 | fox@150,240,.9,fw | rabbit@50,250,.6,x
//   x,y   ：元件「底部中央」的位置
//   大小  ：1 = 原尺寸
//   選項  ：f 左右翻轉、t 傾斜；表情 n 一般 h 開心 s 難過 x 驚訝 z 閉眼 w 得意 a 生氣
// ============================================================
import { SPRITES, C, dedupe } from "./sprites.mjs";

const BG = {
  grass: () => `<rect width="400" height="300" fill="#EAF4F8"/><g fill="#fff"><ellipse cx="90" cy="56" rx="34" ry="12"/><ellipse cx="112" cy="46" rx="20" ry="12"/></g><path d="M0 200 Q100 186 200 196 T400 192 V300 H0Z" fill="#C5E0A8"/><path d="M0 250 Q120 238 230 246 T400 244 V300 H0Z" fill="#AED394"/>`,
  field: () => `<rect width="400" height="300" fill="#FFF4D9"/><circle cx="346" cy="54" r="24" fill="#F8C95A"/><path d="M0 196 Q200 182 400 196 V300 H0Z" fill="#C9A27C"/><g stroke="#B08A64" stroke-width="3" fill="none"><path d="M0 232 Q200 218 400 232"/><path d="M0 268 Q200 254 400 268"/></g>`,
  river: () => `<rect width="400" height="300" fill="#E5F1F7"/><g fill="#fff"><ellipse cx="300" cy="50" rx="34" ry="12"/><ellipse cx="322" cy="40" rx="20" ry="12"/></g><path d="M0 170 Q200 160 400 170 V200 H0Z" fill="#C5E0A8"/><rect y="196" width="400" height="104" fill="#9ACBE8"/><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"><path d="M30 230 q15 -8 30 0"/><path d="M180 262 q15 -8 30 0"/><path d="M320 236 q15 -8 30 0"/></g>`,
  room: () => `<rect width="400" height="300" fill="#F6E6CF"/><rect y="226" width="400" height="74" fill="#D9B98F"/><path d="M0 226 H400" stroke="#B5835A" stroke-width="3"/><rect x="40" y="50" width="90" height="80" rx="6" fill="#DCEFF3" stroke="${C.ink}" stroke-width="2.5"/><path d="M85 50 v80 M40 90 h90" stroke="${C.ink}" stroke-width="2"/><rect x="300" y="36" width="44" height="100" fill="#FFF6E5" stroke="${C.ink}" stroke-width="2.5"/><path d="M294 36 h56" stroke="#9C6B43" stroke-width="6" stroke-linecap="round"/><path d="M312 60 v56 M326 60 v40" stroke="#C9B48A" stroke-width="3"/>`,
  night: () => `<rect width="400" height="300" fill="#2F3A56"/><path d="M330 30 a30 30 0 1 0 24 48 a24 24 0 1 1 -24 -48z" fill="#FCE7A6"/><g fill="#F8C95A"><circle cx="40" cy="40" r="2.5"/><circle cx="120" cy="70" r="2"/><circle cx="220" cy="30" r="2.5"/><circle cx="270" cy="90" r="2"/><circle cx="60" cy="120" r="1.8"/></g><path d="M0 220 Q200 204 400 220 V300 H0Z" fill="#4A5B4F"/>`,
  mountain: () => `<rect width="400" height="300" fill="#E8F1F4"/><path d="M-20 200 L70 90 L130 150 L210 70 L300 160 L350 110 L420 200Z" fill="#C7DCCF"/><path d="M-20 220 L90 140 L170 200 L260 130 L420 220Z" fill="#A9C7B0"/><path d="M0 214 Q200 200 400 214 V300 H0Z" fill="#C5E0A8"/>`,
  palace: () => `<rect width="400" height="300" fill="#F7EBDD"/><rect y="0" width="400" height="26" fill="#C8553D"/><path d="M0 26 H400" stroke="${C.ink}" stroke-width="2.5"/><g fill="#C8553D" stroke="${C.ink}" stroke-width="2.5"><rect x="20" y="26" width="22" height="200"/><rect x="358" y="26" width="22" height="200"/></g><rect y="226" width="400" height="74" fill="#E8D3B8"/><path d="M0 226 H400" stroke="${C.ink}" stroke-width="2.5"/><path d="M40 262 h320" stroke="#D4BC9A" stroke-width="3"/>`,
  sea: () => `<rect width="400" height="300" fill="#DDEFF5"/><circle cx="70" cy="60" r="24" fill="#F8C95A"/><rect y="170" width="400" height="130" fill="#7FB7E0"/><g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M20 196 q20 -10 40 0 t40 0"/><path d="M240 214 q20 -10 40 0 t40 0"/><path d="M120 250 q20 -10 40 0 t40 0"/></g>`,
  battle: () => `<rect width="400" height="300" fill="#F3E3D3"/><path d="M0 150 L60 120 L120 150 L200 110 L280 150 L340 125 L400 150 V200 H0Z" fill="#E2CDB4"/><g stroke="${C.ink}" stroke-width="2"><path d="M60 150 v-46 M330 150 v-46" /></g><path d="M61 106 h24 l-6 8 6 8 h-24z M331 106 h24 l-6 8 6 8 h-24z" fill="#C8553D" stroke="${C.ink}" stroke-width="2"/><path d="M0 200 Q200 186 400 200 V300 H0Z" fill="#D8C3A5"/>`,
  snow: () => `<rect width="400" height="300" fill="#E9EEF3"/><path d="M0 210 Q200 196 400 210 V300 H0Z" fill="#FFFFFF" stroke="#D5DEE6" stroke-width="2"/><g fill="#fff" stroke="#C9D3DC" stroke-width="1.5"><circle cx="40" cy="50" r="5"/><circle cx="130" cy="90" r="4"/><circle cx="250" cy="40" r="5"/><circle cx="340" cy="100" r="4"/><circle cx="200" cy="140" r="3.5"/><circle cx="80" cy="160" r="3.5"/></g>`,
  garden: () => `<rect width="400" height="300" fill="#FBEFE3"/><path d="M0 206 Q200 192 400 206 V300 H0Z" fill="#C5E0A8"/><g fill="${C.pink}"><circle cx="40" cy="250" r="6"/><circle cx="360" cy="262" r="6"/><circle cx="330" cy="236" r="5"/></g><path d="M300 60 q40 -30 80 0" fill="none" stroke="#9C6B43" stroke-width="5" stroke-linecap="round"/><g fill="#F4C2CF"><circle cx="316" cy="54" r="6"/><circle cx="336" cy="44" r="6"/><circle cx="360" cy="50" r="6"/></g>`,
  road: () => `<rect width="400" height="300" fill="#EEF5E6"/><path d="M0 196 Q200 182 400 196 V300 H0Z" fill="#C5E0A8"/><path d="M150 300 Q190 240 230 196 L250 196 Q240 240 260 300Z" fill="#E8D3B8"/>`,
  sky: () => `<rect width="400" height="300" fill="#D7ECF7"/><g fill="#fff"><ellipse cx="70" cy="240" rx="60" ry="22"/><ellipse cx="110" cy="226" rx="40" ry="22"/><ellipse cx="330" cy="250" rx="70" ry="24"/><ellipse cx="300" cy="60" rx="34" ry="12"/></g>`,
  paper: () => `<rect width="400" height="300" fill="#FBF5EA"/><rect x="16" y="16" width="368" height="268" rx="18" fill="none" stroke="#E7D9C2" stroke-width="3" stroke-dasharray="8 8"/>`,
};

export function renderScene(spec) {
  const parts = spec.split("|").map((s) => s.trim()).filter(Boolean);
  const bg = BG[parts[0]] ? BG[parts[0]]() : BG.paper();
  const items = parts.slice(BG[parts[0]] ? 1 : 0).map((p) => {
    const [name, args = ""] = p.split("@");
    const [x = 200, y = 240, s = 1, opts = ""] = args.split(",");
    const fn = SPRITES[name.trim()];
    if (!fn) throw new Error("未知元件：" + name);
    const mood = (opts.match(/[nhsxzwa]/) || ["n"])[0];
    const flip = opts.includes("f") ? -1 : 1;
    const tilt = opts.includes("t") ? -18 : 0;
    return `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s * flip} ${s})">${fn(mood)}</g>`;
  }).join("\n  ");
  return dedupe(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">\n  ${bg}\n  ${items}\n</svg>\n`);
}

export const BACKGROUNDS = Object.keys(BG);
