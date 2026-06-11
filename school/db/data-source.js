require('dotenv').config()
const { DataSource } = require('typeorm')

// ============================================================
// TODO：把你設計的 entity require 進來、加進 entities 陣列
// ============================================================

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5433),
  username: process.env.DB_USERNAME || 'student',
  password: process.env.DB_PASSWORD || 'student666',
  database: process.env.DB_DATABASE || 'school',

  // ⚠️ 鐵律：結構一律走 Migration，synchronize 永遠是 false（事故案例見練習場 README）
  synchronize: false,

  entities: [
    // TODO: 你的 entities
  ],
  migrations: ['db/migrations/*.js'],
})

module.exports = { dataSource }
