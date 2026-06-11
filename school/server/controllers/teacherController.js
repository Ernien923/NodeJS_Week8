const { dataSource } = require('../../db/data-source')
const map = require('../../entity-map')

/**
 * 示範 2（老師寫好）：列出所有老師（含教的科目）—— find 的 relations 寫法
 */
async function listTeachers(req, res) {
  const repo = dataSource.getRepository(map.entities.teacher)
  const rows = await repo.find({ relations: { [map.relations.teacherSubjects]: true } })
  res.json(rows.map((t) => ({
    id: t.id,
    name: t[map.fields.teacherName],
    subjects: (t[map.relations.teacherSubjects] || []).map((s) => s[map.fields.subjectName]),
  })))
}

/**
 * 示範 3（老師寫好）：單一老師的教學概況 —— findOne + 404 + 「巢狀」relations
 * 這條把 TODO 2、3 需要的招全部示範一遍：
 * - findOne({ where: { id } })：撈單筆
 * - 查無資料回 404（不是 500、不是空物件）
 * - relations 兩層巢狀：{ 科目: { 成績: true } } —— 老師 → 科目 → 每科收到幾筆成績
 */
async function getTeacherDetail(req, res) {
  const repo = dataSource.getRepository(map.entities.teacher)
  const teacher = await repo.findOne({
    where: { id: req.params.id },
    relations: { [map.relations.teacherSubjects]: { [map.relations.subjectGrades]: true } },
  })
  if (!teacher) {
    return res.status(404).json({ message: '查無此老師' })
  }
  res.json({
    id: teacher.id,
    name: teacher[map.fields.teacherName],
    subjects: (teacher[map.relations.teacherSubjects] || []).map((s) => ({
      id: s.id,
      name: s[map.fields.subjectName],
      gradeCount: (s[map.relations.subjectGrades] || []).length,
    })),
  })
}

module.exports = { listTeachers, getTeacherDetail }
