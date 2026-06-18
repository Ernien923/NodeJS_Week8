# 🏫 W8 基礎建設週 — 你的第一張自己設計的 schema

![考場驗收](https://github.com/你的帳號/你的repo/actions/workflows/test.yml/badge.svg)

> 上週你在 LiveFit 救效能（W7），這週母公司把你外借到新案子：**學校成績系統**。
> 不一樣的是——這次**資料表長什麼樣，由你決定**。
> W10 的最終作業 schema 也要你自己設計，**這週是最後一次有人陪你設計**。

## 這份作業有兩關（同一份作業，兩關都要全綠才算過）

| 關卡 | 是什麼 | 評分 |
|---|---|---|
| [`livefit/`](livefit/) 🏋️ **第一關·練習場** | **照規格跟做**：entity、migration、seeder、演進題，最後用 `playground/queries.js` 把六招查詢練過一輪。格式可以照抄示範——這關練的是手感 | ✅ GitHub Actions |
| [`school/`](school/) 🏫 **第二關·考場** | **只給需求跟 API 文件**：schema 自己設計、ERD 自己畫、六個 controller 自己寫 | ✅ GitHub Actions + 助教看 ERD |

> 📌 **這是同一份作業**：兩關的 GitHub Actions 都要綠才算過。第一關是有人陪你練的引導關（照抄格式合法），第二關才是真正考設計的硬關——先把第一關練熟，第二關會輕鬆很多。

## 配速建議（誠實版）

- **第一關 練習場：一個晚上（2~3 小時）**——跟著課堂錄影做完五任務 + 練功房六招
- **第二關 考場：兩個晚上（7~9 小時）**——設計 1.5h、建置 2h、六個 controller 3~4h、演進 0.5h

## 考場關卡 ↔ 練習場對應表（卡住就回來查）

| 考場卡住的地方 | 回練習場看 |
|---|---|
| EntitySchema 怎麼寫 | `livefit/entities/CreditPackage.js` + 任務 1~2 |
| migration generate/run 順序 | 練習場任務 3（第 0 步鐵律）|
| seeder 清空與 FK 順序 | `livefit/db/seed.js` 的清空區塊註解 |
| find / relations / findOne / save / update | `livefit/playground/queries.js` 六招 |
| DBML / ERD 語法 | `livefit/schema.dbml`（語法字典）|

先去 [`livefit/`](livefit/) 開始，練完進 [`school/`](school/)。
