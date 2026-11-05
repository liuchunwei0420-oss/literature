# 古典小書房

用白話故事和可愛插圖認識成語典故的網站。用 Jekyll 製作，可以直接放上 GitHub Pages。
目前有「成語」「台語俚諺」「文章」「詩詞」四個分區。

## 資料夾怎麼看

```
_config.yml          網站設定（網站名稱、網址、內容集合）
_data/
  sections.yml       網站分區：成語、詩詞。控制選單、首頁入口、哪些內容可以被搜尋
  sources.yml        典籍書目：韓非子、戰國策……成語和詩詞共用
_idioms/             成語內容，一則一個檔案（檔名＝網址）
_templates/          新增內容用的範本（不會出現在網站上）
  idiom.md           成語範本
  poem.md            詩詞範本＋啟用詩詞分區的步驟
_layouts/            版型：default（外框）、idiom（成語內頁）
_includes/           小元件：頁首、頁尾、搜尋框、成語卡片
assets/
  css/main.css       樣式。顏色都在最上面的 :root，換風格改那裡
  js/search.js       站內搜尋
  js/filter.js       成語列表的分類篩選
  js/home.js         首頁「今日成語」
  illustrations/     插圖（SVG）
chengyu/index.html   成語列表頁
shici/index.html     詩詞列表（目前是《唐詩三百首》五言絕句）
search/index.html    搜尋結果頁
search.json          搜尋索引，建置時自動產生，不用手動改
tools/               產生成語檔案與插圖的小工具（不會出現在網站上）
  data/              194 則成語的文字稿
  illustrate/        插圖元件庫、場景產生器、拼音轉注音
```

## 目前收錄

200 則成語，出處涵蓋經、史、子部與唐宋筆記詩文，共 50 種典籍（見 `_data/sources.yml`）。

- 最早的 6 則（守株待兔、畫蛇添足、井底之蛙、狐假虎威、亡羊補牢、揠苗助長）是手繪插圖、手寫檔案
- 其餘 194 則由 `tools/data/` 的文字稿自動產生，插圖用 `tools/illustrate/` 的 Q 版元件庫組成

### 校對狀態

每則成語的檔案裡都有 `proofread: false`。原文是依通行本整理的，還沒有逐條對照版本。
校對完一則，就把它改成 `proofread: true`。想看還有哪些沒校：

```bash
grep -l "proofread: false" _idioms/*.md
```

`proofread` 不會顯示在網頁上，只是給自己追蹤用。

## 新增成語：兩種方法

### 方法一：直接寫一個檔案（適合少量、手繪插圖）

1. 複製 `_templates/idiom.md` 到 `_idioms/`，檔名用不帶聲調的拼音，例如 `ke-zhou-qiu-jian.md`
2. 填好欄位。出處的書如果 `_data/sources.yml` 裡還沒有，先去那裡加一筆
3. 插圖放到 `assets/illustrations/idioms/`，檔名跟成語檔名一樣
4. 存檔、推上 GitHub，網站會自動更新

插圖建議：橫式 4:3（例如 800×600），SVG 或 PNG／WebP 都可以。

### 方法二：寫文字稿，自動產生（適合大量）

在 `tools/data/` 任一個 `.txt` 檔裡加一段（格式說明在 `tools/illustrate/build-idioms.mjs` 最上面）：

```
=== 刻舟求劍 | ke4 zhou1 qiu2 jian4
意思: ……
分類: 寓言, 處世
出處: lvshi | 察今
原文: ……
難字: 涉=渡 ; 契=刻
例句: 例句一 / 例句二
近義: 守株待兔
場景: river | boat@200,250,1.1 | scholar@170,232,.7,w
故事:
第一段
第二段
```

然後在網站資料夾執行（需要 Node.js，不用裝任何套件）：

```bash
node tools/illustrate/build-idioms.mjs
```

拼音用數字標調（1～4，輕聲 5），程式會自動轉成標調拼音和注音，也會檢查字數、網址重複。

**場景**的寫法：`背景 | 元件@x,y,大小,選項 | …`

- 背景：grass 草地、field 田野、river 河邊、room 室內、night 夜晚、mountain 山、palace 宮殿、sea 海、battle 戰場、snow 雪地、garden 庭園、road 道路、sky 天空、paper 素色
- 元件：人物（scholar 書生、farmer 農夫、general 將軍、soldier 士兵、king 君王、lady 女子、child 小孩、oldman 老人、merchant 商人）、動物（tiger、fox、rabbit、horse、ox、sheep、dragon……）、道具（sword、bow、boat、book、jade、ding……），完整清單在 `tools/illustrate/sprites.mjs`
- 選項：f 翻轉、t 傾斜；表情 h 開心、s 難過、x 驚訝、z 閉眼、w 得意、a 生氣

想換成手繪插圖時，直接用新圖覆蓋 `assets/illustrations/idioms/` 裡同名的檔案，再把那一則從文字稿刪掉（不然下次執行會被覆蓋回來）。

列表頁、首頁、搜尋、近義／反義連結、上一則／下一則都會自動更新，不用另外改。

## 搜尋功能

不用任何外部服務。建置時 Jekyll 會把所有內容整理成 `search.json`，瀏覽器再用 `search.js` 搜尋。

支援：

- 中文：「兔」、「戰國策」、「寓言」
- 拼音，不用打聲調、空格可有可無：`hu jia`、`yamiao`
- 注音，聲調可打可不打：`ㄐㄧㄥˇ`、`ㄐㄧㄥ`
- 拼音首字母：`szdt` → 守株待兔
- 近義、反義詞：搜「拔苗助長」會找到「揠苗助長」

搜尋會比對標題、拼音、注音、分類、近義／反義詞、意思、出處和故事內文，並依符合程度排序。

## 部署到 GitHub Pages

1. 在 GitHub 開一個 repo，把整個資料夾推上去
2. 打開 `_config.yml`，改 `url` 和 `baseurl`：
   - repo 叫 `你的帳號.github.io` → `baseurl: ""`
   - 其他名稱，例如 `classics` → `baseurl: "/classics"`
3. repo 的 Settings → Pages → Source 選 **Deploy from a branch**，分支選 `main`、資料夾選 `/ (root)`
4. 等一兩分鐘，網站就上線了

本機預覽（需要先裝 Ruby）：

```bash
bundle install
bundle exec jekyll serve
```

然後打開 http://localhost:4000

## 詩詞（`_poems/`）

已啟用。目前收《唐詩三百首》五言絕句 29 首。

新增一首：複製 `_templates/poem.md` 到 `_poems/`，照欄位填。
`book` 和 `form` 相同的詩，會自動排成一組，頁面上有上一首／下一首。

原文來源：GitHub 開放資料庫 chinese-poetry（二手電子文本）。白話、注釋、賞析為本站整理。

## 台語俚語與俗諺（`_taiyu/`）

- 新增一則：複製 `_templates/taiyu.md` 到 `_taiyu/`，檔名用台羅去聲調、以 `-` 連接。
- `kind` 只能填：俗諺、俚語、歇後語。列表頁會自動長出篩選按鈕。
- 目前沒有插圖，列表用「第一個字」的色塊代替。之後要加插圖，在檔案加 `illustration:` 欄位即可，頁面和搜尋結果會自動使用。
- 搜尋可以直接打台羅，不用打聲調符號（例如 `tsiah`）。
- 查校對進度：`grep -L "proofread: true" _taiyu/*.md`
