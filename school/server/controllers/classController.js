const { dataSource } = require('../../db/data-source')
const map = require('../../entity-map')

/**
 * 示範 1（老師寫好）：列出所有班級 —— repository 的 find() 全撈
 * 注意它怎麼用 entity-map：你的 entity 叫什麼、欄位叫什麼，都從 map 來，
 * 最後回傳時「映射」成 API 合約的欄位名（id、name）。
 */
async function listClasses(req, res) {
  const repo = dataSource.getRepository(map.entities.class)
  const rows = await repo.find()
  res.json(rows.map((r) => ({ id: r.id, name: r[map.fields.className] })))
}

/**
 * TODO 1（⭐⭐）：列出某班的所有學生
 * Input : path 參數 id（班級 id，用「收割」到的值，不要假設是數字）
 * Output: 200 → [{ id, name }]；班級不存在 → 404 { message: '查無此班級' }
 * 提示：
 * - 兩條路都合法：find({ where: { 你的班級relation: { id } } }) 撈學生，
 *   或 findOne 班級 + relations 反向撈 students
 * - 班級存不存在要先確認（findOneBy），不然空陣列跟 404 分不清
 */
async function listClassStudents(req, res) {
  res.status(501).json({ message: 'TODO 1：這條等你實作——看 controllers/classController.js' })
}

/**
 * TODO 6（⭐⭐⭐）：班級成績摘要
 * Input : path 參數 id（班級 id）
 * Output: 200 → { class: 班名, averages: [{ subject, average }] }
 *         班級不存在 → 404 { message: '查無此班級' }
 * 規則（黑箱會驗，照 openapi.yaml）：
 * - 有補考的成績，以「補考分數」計入平均
 * - 平均一律是整數（種子資料設計好了，算對就是整數；回 JSON number）
 * 提示：
 * - 撈該班學生的全部成績（relations 可以多層）
 * - 用 JS 的 reduce / 分組來算，不需要 query builder
 */
async function getClassSummary(req, res) {
  res.status(501).json({ message: 'TODO 6：這條等你實作——看 controllers/classController.js' })
}

module.exports = { listClasses, listClassStudents, getClassSummary }
