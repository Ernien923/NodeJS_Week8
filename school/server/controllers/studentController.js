const { dataSource } = require('../../db/data-source')
const map = require('../../entity-map')

/**
 * TODO 2（⭐）：單一學生基本資料
 * Input : path 參數 id（學生 id）
 * Output: 200 → { id, name, className }；查無學生 → 404 { message: '查無此學生' }
 * 提示：
 * - findOne + relations（要帶到班級才有 className）
 * - 404 的寫法示範 3 做過一遍了
 */
async function getStudent(req, res) {
  res.status(501).json({ message: 'TODO 2：這條等你實作——看 controllers/studentController.js' })
}

/**
 * TODO 3（⭐⭐⭐）：學生成績單（這份作業的大魔王）
 * Input : path 參數 id（學生 id）
 * Output: 200 → { id, name, className, grades: [{ id, subject, score, retake_score }] }
 *         查無學生 → 404 { message: '查無此學生' }
 * 規則（黑箱會驗）：
 * - 每筆成績要帶自己的 id（之後補考登分要用）
 * - 沒補考的 retake_score 是 null（不是省略、不是 0）
 * 提示：
 * - relations 要走到第三層：學生 → 成績 → 科目（巢狀寫法示範 3 教過）
 * - 回傳前把你的欄位「映射」成上面合約的形狀
 * - ⭐⭐⭐ 卡超過 30 分鐘就先跳下一題，回頭再殺
 */
async function getStudentReport(req, res) {
  res.status(501).json({ message: 'TODO 3：這條等你實作——看 controllers/studentController.js' })
}

module.exports = { getStudent, getStudentReport }
