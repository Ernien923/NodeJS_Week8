/** ⚠️ 考卷檔案，不可修改。啟動 + 開機自檢（boot checker）。 */
require('dotenv').config()
const app = require('./app')
const { dataSource } = require('../db/data-source')

const PORT = Number(process.env.SERVER_PORT || 3000)

async function main() {
  try {
    await dataSource.initialize()
  } catch (e) {
    if (String(e.message).includes('Entity metadata for')) {
      console.error('⛔ 你的 entity 有 relation 指向「還沒註冊」的 entity——db/data-source.js 的 entities 陣列要把全部 entity 一次加進去')
    } else {
      console.error('⛔ 資料庫連不上——npm start 跑過了嗎？.env 的 DB_PORT 對嗎？')
    }
    console.error('   原始錯誤：' + e.message)
    process.exit(1)
  }

  // 自檢 1：連對資料庫了嗎（5432 是練習場的庫！）
  const [{ db }] = await dataSource.query('SELECT current_database() AS db')
  if (db !== (process.env.DB_DATABASE || 'school')) {
    console.warn(`⚠️ 你連到的資料庫是「${db}」不是 school——檢查 .env 的 DB_PORT 是不是 5433（5432 是練習場）`)
  }

  // 自檢 2：entities 註冊了嗎
  const n = dataSource.entityMetadatas.length
  if (n < 4) {
    console.warn(`⚠️ 目前只註冊了 ${n} 個 entity（這份系統至少需要 4 個）——示範 API 會 500，先完成 entity 設計與 data-source 註冊`)
  }

  app.listen(PORT, async () => {
    console.log(`🏫 校園成績系統 server 啟動：http://localhost:${PORT}/api/classes`)
    // 自檢 3：有資料嗎
    if (n >= 4) {
      try {
        const res = await fetch(`http://localhost:${PORT}/api/classes`)
        const body = await res.json()
        if (res.ok && Array.isArray(body) && body.length === 0) {
          console.warn('⚠️ 班級是空的——先跑 npm run seed？')
        } else if (!res.ok) {
          console.warn('⚠️ GET /api/classes 回 ' + res.status + '——entity-map.js 的名字對好了嗎（任務 0）？migration 跑了嗎？')
        }
      } catch { /* 自檢失敗不擋啟動 */ }
    }
  })
}

main()
