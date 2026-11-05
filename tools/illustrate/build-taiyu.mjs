// 台語俚諺插圖：依下面的場景描述產生 SVG，並把 illustration 欄位寫進 _taiyu/*.md
// 用法：node tools/illustrate/build-taiyu.mjs（在網站根目錄執行）
import fs from "fs";
import { renderScene } from "./scene.mjs";

export const SCENES = {
  "ho-tsiu-tim-ang-te": "room | jar@210,256,1.9 | oldman@90,250,.9,h | cup@320,252,1 | sparkle@210,96,1",
  "tsiah-kue-tsi-pai-tshiu-thau": "garden | tree@120,252,1.35 | child@255,252,.9,h | orange@315,252,.8 | heart@205,108,.9",
  "tsit-ki-tshau-tsit-tiam-loo": "grass | sprout@120,252,1.7 | dew@120,176,1 | sprout@280,252,1.3 | dew@280,196,.8 | sun@335,80,1",
  "ok-be-ok-lang-khia": "road | horse@200,252,1 | general@190,222,.7,w | ex@110,110,1",
  "gong-lang-u-gong-hok": "field | farmer@160,252,1,h | coins@270,252,1 | gold@315,248,.8 | sparkle@110,104,1 | star@300,90,.8",
  "khit-tsiah-kuann-bio-kong": "grass | temple@275,214,1 | beggar@195,252,1,a | oldman@70,252,.8,xf | motion@105,190,1",
  "bo-hi-he-ma-ho": "river | farmer@120,250,.95,h | basket@215,252,1 | shrimp@215,218,.8 | note@170,110,.9",
  "kiann-loo-u-hong": "road | merchant@190,252,1,w | wind@95,200,1.2 | wind@90,150,.9 | sparkle@260,104,1",
  "tsit-tai-tshin-nng-tai-piau-sann-tai-sia-liau-liau": "grass | oldman@80,252,.9,h | scholar@205,252,.85 | child@325,252,.8,x | heart@115,110,.8 | q@330,118,1",
  "ban-gu-tsiah-lo-tsui": "river | mud@105,262,1 | ox@105,202,.95,s | ox@290,202,.95,hf | sweat@150,120,1 | wave@300,262,.6",
  "khong-tsu-kong-puann-ke-tsin-si-su": "road | oldman@120,252,1,s | cart@265,252,1 | book@252,196,.9 | scroll@292,200,.8 | book@262,172,.7 | sweat@150,146,1",
  "sann-hun-lang-tshit-hun-pan": "room | lady@150,252,1,w | mirror@270,252,1 | sparkle@105,118,1 | sparkle@200,96,.7",
  "tsiah-kin-long-phua-uann": "room | child@150,252,1,x | bowl_broken@262,252,1.2 | sweat@185,140,1 | ex@110,118,1",
  "tsit-iunn-bi-tshi-pah-iunn-lang": "field | rice@200,254,1.3 | scholar@70,252,.75,h | farmer@135,258,.7,a | lady@270,258,.7,s | child@338,252,.7,w",
  "be-hiau-sai-tsun-hiam-khe-uan": "river | boat@200,244,1 | scholar@188,226,.6,a | q@268,116,1 | sweat@226,146,.8",
  "ku-tshio-pih-bo-bue": "grass | turtle@130,252,1.3,f | softshell@285,252,1.25 | note@120,160,.8 | q@300,170,.8",
  "phainn-tik-tshut-ho-sun": "garden | bamboo@105,252,1.2 | shoot@245,252,1.2 | sparkle@245,116,1 | farmer@340,252,.8,h",
};

const OUT = "assets/illustrations/taiyu";
fs.mkdirSync(OUT, { recursive: true });
let n = 0;
for (const [slug, spec] of Object.entries(SCENES)) {
  fs.writeFileSync(`${OUT}/${slug}.svg`, renderScene(spec));
  const md = `_taiyu/${slug}.md`;
  if (!fs.existsSync(md)) { console.warn("找不到", md); continue; }
  let t = fs.readFileSync(md, "utf8");
  const line = `illustration: /${OUT}/${slug}.svg`;
  t = /^illustration:.*$/m.test(t) ? t.replace(/^illustration:.*$/m, line) : t.replace(/^kind:.*$/m, (m) => m + "\n" + line);
  fs.writeFileSync(md, t);
  n++;
}
console.log("完成", n, "張");
