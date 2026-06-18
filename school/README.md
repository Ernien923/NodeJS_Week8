# 🏫 第二關·考場：校園成績系統

> 練習場（`../livefit/`）你已經練過一輪建表了。這一關**換一個領域（學校成績）再做一次**——
> 一樣是「設計 entity → 用 migration 把表蓋出來 → 種一點資料」，驗收**只看資料庫的表對不對**，不寫任何 API。

## 🚀 快速開始

```bash
cp .env.example .env
npm install
npm start                 # 起一顆全新的空資料庫（5433）
```

## 🎯 要蓋出來的四張表（照規格做）

主鍵一律 `id`（uuid），表名用大寫（和練習場同慣例）。

| 表 | 欄位 | 關聯 |
|---|---|---|
| `CLASS`（班級） | `name` varchar(50) 必填 | — |
| `SUBJECT`（科目） | `name` varchar(50) 必填 | — |
| `STUDENT`（學生） | `name` varchar(50) 必填 | `class_id` → `CLASS`（一個學生屬於一個班級）|
| `GRADE`（成績） | `score` integer 必填 | `student_id` → `STUDENT`、`subject_id` → `SUBJECT` |

> 💡 `GRADE` 同時指向 `STUDENT` 和 `SUBJECT`，就是「一個學生每一科有一筆成績」的多對多接法——這正是這一關要你想清楚的地方。

## 🗺️ 步驟

1. **寫 entities**：`entities/Class.js`、`Subject.js`、`Student.js`、`Grade.js`（EntitySchema 格式照練習場的 `CreditPackage.js`）
2. **註冊**：把四個 entity 加進 `db/data-source.js` 的 `entities` 陣列
3. **建表**：`npm run migration:generate -- db/migrations/Init` → 打開生成的 SQL 確認有四個 `CREATE TABLE` → `npm run migration:run`
4. **種資料**：把 `db/seed.js` 補完（至少 2 班、2 科、幾個學生、幾筆成績），`npm run seed`

## 🧪 驗收與繳交

```bash
npm test     # 直接查資料庫：表在不在、欄位/型別對不對、FK 接對沒、種子有沒有資料
```

**繳交**：repo 網址（GitHub Actions 全綠）。

> 📏 考卷規則：`test/`、`scripts/`、`package.json`、`docker-compose.yml`、`.env.example` 不可修改——CI 第一步會查。你動的是：`entities/`、`db/`。

## ⭐ 加分挑戰（不評分，想練再做）

期中後新需求：成績要能記「補考分數」。**不准改任何舊 migration**，改 `Grade` entity 加一欄 `retake_score` integer（可為空）→ 產生**第二筆** migration → run。這就是真實世界「schema 演進」的做法。

## ❓ FAQ

**Q：`migration:generate` 說 No changes / 非零 exit？**
代表 entities 跟資料庫沒差異——你是不是還沒在 `data-source.js` 註冊新 entity？

**Q：`SELECT * FROM USER` 查到奇怪的東西？**（這關沒有 USER 表，但提醒一下）
`user` 是 PostgreSQL 保留字。本關表名 CLASS/SUBJECT/STUDENT/GRADE 都不是保留字，正常用即可。

**Q：分數欄該用什麼型別？**
用 `integer`。`numeric` 在 node-pg 會回字串，之後要算數會踩雷。

**Q：全部炸爛想重來？**
`npm run db:reset` 把資料庫整顆重開，再從步驟 3 走一次。資料庫是可拋棄的——這就是 Migration + Seeder 給你的底氣。
