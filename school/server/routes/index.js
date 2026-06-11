/** ⚠️ 考卷檔案，不可修改。 */
const router = require('express').Router()
const classCtrl = require('../controllers/classController')
const teacherCtrl = require('../controllers/teacherController')
const studentCtrl = require('../controllers/studentController')
const gradeCtrl = require('../controllers/gradeController')

// async 保險絲：controller 丟出的錯一律進 error middleware
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// ── 示範（老師寫好，搭配 entity-map.js 使用）──
router.get('/classes', wrap(classCtrl.listClasses))
router.get('/teachers', wrap(teacherCtrl.listTeachers))
router.get('/teachers/:id', wrap(teacherCtrl.getTeacherDetail))

// ── 你的六個 TODO ──
router.get('/classes/:id/students', wrap(classCtrl.listClassStudents))   // TODO 1
router.get('/students/:id', wrap(studentCtrl.getStudent))                // TODO 2
router.get('/students/:id/report', wrap(studentCtrl.getStudentReport))   // TODO 3
router.post('/grades', wrap(gradeCtrl.createGrade))                      // TODO 4
router.patch('/grades/:id/retake', wrap(gradeCtrl.setRetake))            // TODO 5
router.get('/classes/:id/summary', wrap(classCtrl.getClassSummary))      // TODO 6

module.exports = router
