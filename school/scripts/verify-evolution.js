/**
 * 演進探針（CI 最後一步，學生不用跑）—— 純 DB 層三快照 diff，不打 API、不重啟 server。
 * 驗證：revert 真的有動作、不傷建表與種子、down/up 對稱。
 * （為什麼不打 API？revert 後你的 entity 還掛著被砍的欄位，碰它的查詢一定 500——那不是你的錯）
 */
require('dotenv').config()
const { execSync } = require('child_process')
const { Client } = require('pg')

const cfg = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5433),
  user: process.env.DB_USERNAME || 'student',
  password: process.env.DB_PASSWORD || 'student666',
  database: process.env.DB_DATABASE || 'school',
}

async function snapshot() {
  const c = new Client(cfg); await c.connect()
  const cols = await c.query(`SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema='public' ORDER BY table_name, column_name`)
  const tables = [...new Set(cols.rows.map((r) => r.table_name))].filter((t) => t !== 'migrations')
  const counts = {}
  for (const t of tables) {
    const r = await c.query(`SELECT count(*)::int AS n FROM "${t}"`)
    counts[t] = r.rows[0].n
  }
  await c.end()
  return {
    columns: cols.rows.map((r) => `${r.table_name}.${r.column_name}`).filter((x) => !x.startsWith('migrations.')),
    tables, counts,
  }
}

const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b)

async function main() {
  const A = await snapshot()

  console.log('▸ migration:revert（吃後悔藥）')
  execSync('npx typeorm migration:revert -d ./db/data-source.js', { stdio: 'inherit' })
  const B = await snapshot()

  if (eq(A.columns, B.columns)) throw new Error('revert 前後 schema 一模一樣——你最後一筆 migration 的 down() 是空的？')
  const missingTables = A.tables.filter((t) => !B.tables.includes(t))
  if (missingTables.length > 0 && A.tables.length - missingTables.length < 4) {
    throw new Error(`revert 掉了核心資料表（${missingTables.join(', ')}）——演進必須是「獨立的最後一筆 migration」，不能跟建表混在一起`)
  }
  for (const t of B.tables) {
    if (B.counts[t] !== A.counts[t]) throw new Error(`revert 後資料表 ${t} 的資料量變了（${A.counts[t]} → ${B.counts[t]}）——演進 migration 不該動資料`)
  }

  console.log('▸ migration:run（補回來）')
  execSync('npx typeorm migration:run -d ./db/data-source.js', { stdio: 'inherit' })
  const C = await snapshot()
  if (!eq(A.columns, C.columns)) throw new Error('re-run 後 schema 跟原本不一致——up() 跟 down() 不對稱')

  console.log('✅ 演進探針通過：revert 乾淨、不傷種子、up/down 對稱')
}

main().catch((e) => { console.error('❌', e.message); process.exit(1) })
