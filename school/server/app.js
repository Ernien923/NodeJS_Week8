/**
 * ⚠️ 考卷檔案，不可修改。
 * 你的戰場在 controllers/（六個 TODO）跟 entity-map.js（任務 0）。
 */
const express = require('express')
const routes = require('./routes')

const app = express()
app.use(express.json())

// async controller 的保險絲：你的 controller 丟錯，會變成該條請求 500，
// 不會把整個 server 炸死（錯誤處理 middleware 的細節 W4 教過）
app.use('/api', routes)

app.use((req, res) => {
  res.status(404).json({ message: `找不到路由 ${req.method} ${req.path}——對照 openapi.yaml（localhost:8081）` })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).json({ message: '伺服器錯誤', detail: err.message })
})

module.exports = app
