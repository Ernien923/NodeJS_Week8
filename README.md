# 🏗️ W8 基礎建設週 — LiveFit v2：Migration 上線

![驗收狀態](https://github.com/你的帳號/你的repo/actions/workflows/test.yml/badge.svg)

> **案發紀錄（上週四，v2 新服務的測試機）**
> 同事把 Course 的一個欄位改了名，server 一啟動——舊欄位連同幾百筆測試資料**整條蒸發**。
> 沒有任何人下過半行 SQL。兇手是 `synchronize: true`：你們影片裡學的那招，
> dev 很方便，但它「自動對齊」的方式就是 DROP 再 ADD。
>
> CTO 下令：**v2 新服務的資料庫，結構一律改用 Migration 管理、環境用 Seeder 一鍵重建。**
> （v2 起新庫、按公司新規範走：UUID 主鍵、大寫表名——跟你上週救的那顆 130 萬筆正式庫是不同服務）
>
> 上週你救效能（W7），這週你立規矩。前輩已經把第一張表搬好了，接力給你。

## 🚀 快速開始

1. Docker Desktop 啟動、Node.js >= 20
2. **Fork** 本專案 → clone → 進你 repo 的 Actions tab 按「enable workflows」

```bash
cp .env.example .env
npm install
npm start                # 起一顆全新的空資料庫
npm run migration:run    # 先把「前輩的示範 migration」套進去（⚠️ 這步是第 0 步，不能跳）
```

**成功長什麼樣**：終端機印出 `Migration ...Init... has been executed successfully`，資料庫裡出現 `CREDIT_PACKAGE` 表。

## 🎯 五個任務

| # | 任務 | 改哪裡 | ⭐ |
|---|---|---|---|
| 1 | 寫 **User** entity（照 `entities/CreditPackage.js` 的格式寫——對，就是照抄格式，這是合法的）| `entities/User.js` | ⭐ |
| 2 | 寫 **Skill** + **Course** entity（Course 要有**關聯**：FK 指向 USER 與 SKILL）| `entities/Skill.js`、`entities/Course.js` | ⭐⭐ |
| 3 | 註冊 entities → **產生並執行你的第一筆 migration** | `db/data-source.js`、`db/migrations/` | ⭐⭐ |
| 4 | **Seeder**：照規格種資料，可重複執行 | `db/seed.js` | ⭐⭐ |
| 5 | **演進題**：產品要加「線上會議連結」——`meeting_url varchar(2048) 可為空`。**不准改任何舊 migration**，改 entity → 產生**第二筆** migration → run | entity + 新 migration | ⭐⭐⭐ |
| 加分 | `npm run migration:revert` 吃一次後悔藥，觀察欄位消失再 run 回來（CI 的演進探針會驗你的 down()）| — | ⭐ |

### 欄位規格

**USER**：`id` uuid PK ｜ `name` varchar(50) 必填 ｜ `email` varchar(320) 必填+唯一 ｜ `role` varchar(20) 必填 ｜ `created_at` createDate ｜ `updated_at` updateDate
（密碼欄位等 auth 整合那一版再加——這裡刻意先不做）

**SKILL**：`id` uuid PK ｜ `name` varchar(50) 必填+唯一

**COURSE**：`id` uuid PK ｜ `user_id` FK→USER（開課教練）｜ `skill_id` FK→SKILL ｜ `name` varchar(100) 必填 ｜ `description` text 必填 ｜ `start_at`、`end_at` timestamp ｜ `max_participants` integer ｜ `created_at`、`updated_at`

關聯寫法（EntitySchema 的 `relations` 區塊 + `joinColumn: { name: 'user_id' }`）課堂教過，講義有完整範例。

### 任務 3 的正確順序（順序錯了會炸，原理見下）

```bash
npm run migration:run                                  # 第 0 步：先讓示範 migration 進資料庫
# （完成任務 1、2 並在 data-source.js 註冊 entities 之後）
npm run migration:generate -- db/migrations/AddCoreTables   # 參數是「路徑」，不是名字
# 打開生成的檔案，回答三個自檢問題（見下）
npm run migration:run                                  # 套用你的 migration
```

> **為什麼第 0 步不能跳**：`generate` 是拿「entities」跟「資料庫現況」做 diff——它不看還沒執行的 migration 檔。
> 跳過第 0 步，diff 會把 CREDIT_PACKAGE 也算進去，run 的時候就是 `relation already exists` 爆炸。
> 炸了想重來：`npm run db:reset` 後從第 0 步重新走。

**自檢三問**（打開你生成的 migration 檔）：
① 裡面有幾個 `CREATE TABLE`？應該是 **3 個**——如果出現 `CREDIT_PACKAGE`，代表你跳過了第 0 步
② FK 是用哪個語句建立的？
③ `down()` 在做什麼？為什麼順序跟 `up()` 相反？

### 種子資料規格（任務 4）

| 表 | 內容 |
|---|---|
| SKILL | 重訓、瑜珈、飛輪（3 筆）|
| USER | 海格教練 `coach1@livefit.tw`、小美教練 `coach2@livefit.tw`（role 都是 `COACH`）|
| COURSE | 肌力入門班、週末飛輪、晨間瑜珈、核心特訓（4 筆，每堂都要接上教練與技能）|

清空區塊前輩已經寫好（看 `db/seed.js` 的註解——`clear()` 跟 `delete({})` 為什麼都不能用，是真實世界的考古題）。

### 演進題的一個為什麼（任務 5）

為什麼 `meeting_url` 是**可為空**？因為表裡已經有課了——對有資料的表加 `NOT NULL` 欄位（沒有預設值）會直接失敗。
正式環境的欄位演進三步：**先加 nullable → 回填資料 → 再收緊 NOT NULL**。後兩步這次不考，先記得有這回事。

## 🧪 驗收與繳交

```bash
npm test     # 13 條驗收：表規格、FK、migration 歷史、種子、可重跑
```

push 後 Actions 會多跑一個你本機沒有的關卡：**演進探針**——把你最後一筆 migration revert 掉，驗證 `meeting_url` 消失、三張表跟種子資料還在、再 run 回得來。**所以演進必須是獨立的最後一筆 migration，down() 要寫對**（generate 會幫你寫好，別亂改）。

**繳交**：repo 網址（Actions 全綠）。

> 📏 考卷規則：`test/`、`scripts/`、`.github/`、`entities/CreditPackage.js`、前輩的示範 migration（檔名含 `Init`）不可修改——CI 第一步就是查這個。

## ❓ FAQ

**Q：`migration:generate` 跑完顯示非零 exit code / No changes？**
代表 entities 跟資料庫現況沒有差異——不是壞掉。想想：你是不是還沒在 `data-source.js` 註冊新 entity？或者要加的欄位早就進去了？

**Q：psql 裡 `SELECT * FROM USER` 查到奇怪的東西？**
`user` 是 PostgreSQL 保留字，不加引號它回的是「目前登入者」。要寫 `SELECT * FROM "USER"`。建議在程式裡全程用 repository，沒這個問題。

**Q：seed 報 FK 錯誤？**
種的順序：先 USER / SKILL，再 COURSE（被指著的要先存在）；清的順序剛好相反（看 `db/seed.js` 的清空區塊）。

**Q：全部炸爛想重來？**
`npm run db:reset` → 從「第 0 步 `npm run migration:run`」重新走一遍。資料庫是可拋棄的，這就是 Migration + Seeder 給你的底氣——**這正是這份作業要你體會的事**。
