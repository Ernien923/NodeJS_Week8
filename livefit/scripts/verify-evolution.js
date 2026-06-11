/**
 * 演進探針（CI 用，學生不用跑）——驗證「演進是真的演進」：
 * revert 掉最後一筆 migration 之後，meeting_url 要消失、三張表跟種子資料要還在；
 * 再 run 回來，meeting_url 要回來。
 * 這同時驗證了：演進是獨立的最後一筆 migration、它的 down() 寫得正確。
 */
require('dotenv').config()
const { execSync } = require('child_process')
const { Client } = require('pg')

const cfg = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USERNAME || 'student',
  password: process.env.DB_PASSWORD || 'student666',
  database: process.env.DB_DATABASE || 'livefit',
}

async function q(sql) {
  const c = new Client(cfg); await c.connect()
  const r = await c.query(sql); await c.end(); return r.rows
}
const hasMeetingUrl = async () =>
  (await q(`SELECT 1 FROM information_schema.columns WHERE table_name='COURSE' AND column_name='meeting_url'`)).length > 0

async function main() {
  if (!(await hasMeetingUrl())) throw new Error('探針前置失敗：meeting_url 不存在')

  console.log('▸ migration:revert（吃後悔藥）')
  execSync('npx typeorm migration:revert -d ./db/data-source.js', { stdio: 'inherit' })

  if (await hasMeetingUrl()) throw new Error('revert 後 meeting_url 還在——演進不是獨立的最後一筆 migration，或 down() 沒有把它移除')
  const tables = await q(`SELECT table_name FROM information_schema.tables WHERE table_name IN ('USER','SKILL','COURSE')`)
  if (tables.length !== 3) throw new Error('revert 後核心表消失了——你的演進 migration 不該動到建表')
  const skills = await q(`SELECT count(*)::int AS n FROM "SKILL"`)
  if (skills[0].n < 3) throw new Error('revert 後種子資料消失了')

  console.log('▸ migration:run（補回來）')
  execSync('npx typeorm migration:run -d ./db/data-source.js', { stdio: 'inherit' })
  if (!(await hasMeetingUrl())) throw new Error('re-run 後 meeting_url 沒有回來')

  const m = await q(`SELECT count(*)::int AS n FROM migrations`)
  if (m[0].n < 3) throw new Error(`migrations 歷史只有 ${m[0].n} 筆（示範 1 + 你的至少 2）`)

  console.log('✅ 演進探針通過：revert 乾淨、re-run 回得來、歷史完整')
}

main().catch((e) => { console.error('❌', e.message); process.exit(1) })
