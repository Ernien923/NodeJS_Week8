const { dataSource } = require('../../db/data-source')
const map = require('../../entity-map')

/**
 * TODO 4（⭐⭐）：補登成績（阿強的英文缺考，就等這條來補）
 * Input : body { studentId, subjectId, score }
 * Output: 201 → { id, score }（id 是新成績的 id）
 *         studentId 或 subjectId 不存在 → 404 { message: '查無學生或科目' }
 *         score 不是 0~100 的數字 → 400 { message: '分數格式錯誤' }
 * 提示：
 * - 先確認學生、科目存在（findOneBy）再 save——FK 預檢的 pattern 影片教過
 * - save({ score, 你的學生relation: student, 你的科目relation: subject })
 */
async function createGrade(req, res) {
  res.status(501).json({ message: 'TODO 4：這條等你實作——看 controllers/gradeController.js' })
}

/**
 * TODO 5（⭐⭐）：補考登分（你的演進 migration 加的欄位，在這裡派上用場）
 * Input : path 參數 id（成績 id，從成績單的 grades[].id 來）+ body { retake_score }
 * Output: 200 → { id, score, retake_score }
 *         成績不存在 → 404 { message: '查無此成績' }
 * 提示：
 * - update() + 檢查 affected，或 findOneBy + 改值 + save，都合法
 * - 這條會在你跑完「第二筆 migration」之後才動得起來——這就是演進的感覺
 */
async function setRetake(req, res) {
  res.status(501).json({ message: 'TODO 5：這條等你實作——看 controllers/gradeController.js' })
}

module.exports = { createGrade, setRetake }
