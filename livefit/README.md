# 🏋️ 第一關·練習場：LiveFit 健身房

> 第一關先在健身房領域練一遍：**設計 entity → 用 migration 把表蓋出來 → 種一點資料**。
> 驗收只看「資料庫實際長出來的表對不對」，不寫任何 API。
> 弄壞了不用怕：`npm run db:reset` 把資料庫整顆重開。

![驗收狀態](https://github.com/你的帳號/你的repo/actions/workflows/test.yml/badge.svg)

## 🚀 快速開始

```bash
cp .env.example .env
npm install
npm start                 # 起一顆全新的空資料庫（5432）
```

## 🎯 要蓋出來的三張表（照規格做）

主鍵一律 `id`（uuid），表名用大寫。

| 表 | 欄位 | 關聯 |
|---|---|---|
| `USER`（教練） | `name` varchar(50) 必填、`email` varchar(320) 必填+唯一、`role` varchar(20) 必填、`created_at`、`updated_at` | — |
| `SKILL`（技能） | `name` varchar(50) 必填+唯一 | — |
| `COURSE`（課程） | `name` varchar(100) 必填、`description` text 必填、`start_at`、`end_at`、`max_participants` integer | `user_id` → `USER`（開課教練）、`skill_id` → `SKILL` |

> 💡 `COURSE` 同時指向 `USER` 和 `SKILL`，就是「一堂課由一位教練開、屬於一種技能」。

## 🗺️ 步驟

1. **寫 entities**：`entities/User.js`、`Skill.js`、`Course.js`（EntitySchema 格式，講義有範例）
2. **註冊**：把三個 entity 加進 `db/data-source.js` 的 `entities` 陣列
3. **建表**：`npm run migration:generate -- db/migrations/Init` → 打開生成的 SQL 確認有三個 `CREATE TABLE` → `npm run migration:run`
4. **種資料**：把 `db/seed.js` 補完，`npm run seed`

### 種子資料規格（任務 4）

| 表 | 內容 |
|---|---|
| SKILL | 重訓、瑜珈、飛輪（3 筆）|
| USER | 海格教練 `coach1@livefit.tw`、小美教練 `coach2@livefit.tw`（role 都是 `COACH`）|
| COURSE | 肌力入門班、週末飛輪、晨間瑜珈、核心特訓（4 筆，每堂都要接上教練與技能）|

## 🧪 驗收與繳交

```bash
npm test     # 直接查資料庫：表在不在、欄位/型別對不對、FK 接對沒、種子有沒有資料
```

**繳交**：repo 網址（GitHub Actions 全綠）。

> 📏 考卷規則：`test/`、`scripts/`、`package.json`、`docker-compose.yml`、`.env.example` 不可修改——CI 第一步會查。你動的是：`entities/`、`db/`。

## ⭐ 加分挑戰（不評分，想練再做）

產品要加「線上會議連結」：改 `Course` entity 加一欄 `meeting_url` varchar(2048)（可為空），**不准改舊 migration** → 產生**第二筆** migration → run。這就是真實世界「schema 演進」的做法（為什麼要可為空？因為表裡已經有課了，加 NOT NULL 欄位會失敗）。

## ❓ FAQ

**Q：`migration:generate` 說 No changes / 非零 exit？**
代表 entities 跟資料庫沒差異——你是不是還沒在 `data-source.js` 註冊新 entity？

**Q：`SELECT * FROM USER` 查到奇怪的東西？**
`user` 是 PostgreSQL 保留字，不加引號它回的是「目前登入者」。在程式裡全程用 repository 就沒這問題。

**Q：seed 報 FK 錯誤？**
種的順序：先 USER / SKILL，再 COURSE（被指著的要先存在）；清的順序剛好相反。

**Q：全部炸爛想重來？**
`npm run db:reset` 把資料庫整顆重開，再從步驟 3 走一次。資料庫是可拋棄的——這就是 Migration + Seeder 給你的底氣。
