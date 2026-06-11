require('dotenv').config()
const { DataSource } = require('typeorm')

const CreditPackage = require('../entities/CreditPackage')
// ============================================================
// TODO（任務 1、2 完成後）：把你的 entity require 進來，
// 並加進下面的 entities 陣列——沒註冊的 entity，migration:generate 看不見
// ============================================================

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME || 'student',
  password: process.env.DB_PASSWORD || 'student666',
  database: process.env.DB_DATABASE || 'livefit',

  // ⚠️ 本專案的鐵律：結構一律走 Migration，synchronize 永遠是 false
  //（上週的事故就是 synchronize 幹的——詳見 README 的案發紀錄）
  synchronize: false,

  entities: [
    CreditPackage,
    // TODO: User, Skill, Course
  ],
  migrations: ['db/migrations/*.js'],
})

module.exports = { dataSource }
