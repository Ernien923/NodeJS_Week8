# 🏫 W8 作業 — 用 Migration 建資料表

![驗收狀態](https://github.com/你的帳號/你的repo/actions/workflows/test.yml/badge.svg)

> 這週練一件事：**自己設計 entity → 用 TypeORM migration 把表蓋出來 → 種一點資料**。
> 驗收只看「資料庫實際長出來的表對不對」，不寫任何 API。

## 這份作業有兩關（兩關都要全綠才算過）

兩關做的是同一件事——建資料表——只是換不同領域各練一遍：

| 關卡 | 領域 | 要建的表 |
|---|---|---|
| [`livefit/`](livefit/) 🏋️ **第一關** | 健身房 | `USER`、`SKILL`、`COURSE`（3 張）|
| [`school/`](school/) 🏫 **第二關** | 學校成績 | `CLASS`、`SUBJECT`、`STUDENT`、`GRADE`（4 張）|

> 📌 兩關的 GitHub Actions 都要綠才算過。每一關的**規格、步驟、驗收**都寫在各自資料夾的 README。

## 配速建議

- **第一關 練習場：約 1.5~2 小時**
- **第二關 考場：約 2~2.5 小時**

先去 [`livefit/`](livefit/) 開始，做完進 [`school/`](school/)。
