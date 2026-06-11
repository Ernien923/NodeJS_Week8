# 🏫 考場：校園成績系統

> 教務處要一套成績系統，前人只蓋了 API 層（Express 都寫好了），**資料層整個是空的**。
> 你的任務：設計 schema、用 migration 蓋出來、種資料、補完六個 controller——讓這套系統活過來。
> **資料表長什麼樣，完全由你決定。** 驗收只看一件事：API 的行為對不對。

## 🚀 快速開始

```bash
cp .env.example .env
npm install
npm start            # 起資料庫（5433）+ Swagger 文件（http://localhost:8081）
npm run dev          # 起 server（一開始會看到自檢警告——正常，因為什麼都還沒有）
```

打開 **http://localhost:8081**——這是 API 合約（Swagger）。W10 最終作業你會再見到這個畫面，先學會讀它：每條 endpoint 的回應範例就是你要交出的形狀。

## 📋 需求（User Stories）

1. 學校有多個班級，每個學生屬於一個班級
2. 每位老師教一或多個科目
3. 每次考試，每個學生每科有一筆成績（0~100）
4. **期中後的新需求（演進題）**：成績要能記「補考分數」，沒補考的人留空

> 🗽 **設計自由的界線**：表名、欄位名、型別、關聯方向、要不要多拆表（例如要不要「考試」表）——全是你的自由，黑箱測試只打 API 不看表。唯二的約定：①每張表的主鍵叫 `id`（型別隨你）②API 回應的形狀照 Swagger。

## 🗺️ 施工動線（照這個順序，不會撞牆）

```
0. 畫 ERD（dbdiagram.io）─→ schema.dbml 放進 repo
1. 寫 entities + 註冊進 db/data-source.js
2. 任務 0：填 entity-map.js → npm run dev → 兩條示範 API 要通
3. npm run migration:generate -- db/migrations/Init → 讀生成的 SQL → npm run migration:run
4. 寫 db/seed.js（require fixtures/seed-data.json，先別管補考）→ npm run seed
5. TODO 1 → 2 → 4（先做這三題：名單、單筆、新增）
6. 演進題：entity 加補考欄位 → generate 第二筆 migration → run → seed 補上阿強的補考
7. TODO 5 → 3 → 6（補考登分 → 成績單大魔王 → 統計）
8. 回頭把 schema.dbml 更新成最終版 + 在下方寫 3 行設計反思
```

每一步的「完成證據」：`npm test` 會多綠幾條（測試按任務分組，可以切片跑：`npx jest -t "TODO 3"`）。

## ✏️ 任務清單

| # | 任務 | 在哪 | ⭐ |
|---|---|---|---|
| 0 | 對名字：把你的命名填進 `entity-map.js`，跑通示範 API | `entity-map.js` | ⭐ |
| ERD | dbdiagram 畫圖（**先畫再寫**；實作後改了設計，回頭更新圖——這是正常工程，不扣分）| `schema.dbml` | ⭐⭐ |
| 建置 | entities + ≥2 筆 migration + seeder | `entities/` `db/` | ⭐⭐ |
| 1 | 班級學生名單 | `controllers/classController.js` | ⭐⭐ |
| 2 | 學生基本資料 | `controllers/studentController.js` | ⭐ |
| 3 | **學生成績單（大魔王：三層關聯）** | `controllers/studentController.js` | ⭐⭐⭐ |
| 4 | 補登成績（阿強的英文缺考，靠你補）| `controllers/gradeController.js` | ⭐⭐ |
| 5 | 補考登分（用你演進出來的欄位）| `controllers/gradeController.js` | ⭐⭐ |
| 6 | 班級成績摘要（統計）| `controllers/classController.js` | ⭐⭐⭐ |

每個 TODO 的 Input/Output 與提示都寫在 controller 的註解裡。**⭐⭐⭐ 卡超過 30 分鐘就先跳下一題。**

## 🌱 種子資料

唯一真相在 **`fixtures/seed-data.json`**（考卷，不可改）——你的 `seed.js` 要 `require` 它做映射，**不要手抄**（中文打錯一個字，黑箱全紅）。人類可讀版：

| 班級 | 學生 | 數學（王老師）| 英文（林老師）|
|---|---|---|---|
| 忠班 | 小明 | 95 | 85 |
| 忠班 | 小華 | 75 | 93 |
| 孝班 | 小美 | 81 | 88 |
| 孝班 | 阿強 | 57 → 補考 71 | **缺考**（等 TODO 4 補登）|

分數設計過：每班每科平均都是整數（補考以補考分數計）。

## 🎨 ERD 自查清單（助教就看這五點）

1. 每張表都有主鍵
2. FK 方向正確（`Ref:` 的 `>` 尖端指向「一」的那邊）
3. 多對多有解法（你的「成績」怎麼接學生跟科目？）
4. 可為空的欄位說得出理由（為什麼 `retake_score` 可以空？）
5. 命名風格一致

DBML 語法字典：`../livefit/schema.dbml`。最小起手式：

```dbml
Table STUDENT {
  id uuid [pk]
  name varchar(50)
}
Ref: STUDENT.class_id > CLASS.id
```

畫完把 dbdiagram 的分享連結貼在下面、DBML 原始碼存進 `schema.dbml`：

> **我的 ERD 連結**：（貼這裡）
>
> **設計反思（3 行）**：實作後的 schema 跟最初的圖差在哪？為什麼？

## 🧪 驗收與繳交

```bash
npm test    # 28 條行為驗收 + 機制檢查
```

push 後 Actions 跑同一套，外加一個本機沒有的關卡：**演進探針**——把你最後一筆 migration revert 掉再 run 回來，驗證「演進是獨立的最後一筆、down() 寫得對、不傷資料」。

**繳交**：repo 網址（Actions 全綠）+ ERD 連結（寫在本檔上方）。

> 📏 考卷規則：`test/`、`scripts/`、`server/app.js`、`server/www.js`、`server/routes/`、`openapi.yaml`、`fixtures/`、`package.json`、`docker-compose.yml`、`.env.example` 不可修改。你動的是：`entities/`、`db/`、`entity-map.js`、`server/controllers/`、`schema.dbml`。

## ❓ FAQ

**Q：`npm run dev` 啟動就報 entity 相關的錯？**
A：看錯誤訊息——「指向還沒註冊的 entity」= data-source 的 entities 陣列要一次全加；示範 API 500 = 任務 0 的 entity-map 名字還沒對上。

**Q：seed 報 `column ... does not exist`？**
A：你的 entity 已經有補考欄位、但第二筆 migration 還沒跑。順序鐵律：**改 entity → generate → run → 再 seed**。

**Q：成績的分數欄該用什麼型別？**
A：建議 `integer`——`numeric` 在 node-pg 會回**字串**，TODO 6 算平均會變成字串串接，黑箱直接紅。

**Q：測試說「點名失敗」？**
A：第 0 條測試紅 = 根因在 seed 或 entity-map，後面全部會連動紅。先修它。

**Q：5433 被占住？**
A：改 `.env` 的 `DB_PORT`，`npm run db:reset`。注意 5432 是練習場的庫——`npm run dev` 連錯庫會有警告提示。

**Q：兩個資料夾的資料庫會打架嗎？**
A：不會，練習場 5432、考場 5433，可以同時開。
