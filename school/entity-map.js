/**
 * 任務 0：對名字 —— 你的 schema 是自由設計的，但老師寫好的示範 controller
 * 需要知道「你把東西叫什麼」。把右邊的值改成你自己的命名。
 *
 * 改完跑 npm run dev，兩條示範 API（GET /api/classes、GET /api/teachers）
 * 通了，才開始寫 TODO。
 *
 * ⚠️ 唯一的命名保留字：每張表的主鍵一律叫 id（uuid 或 serial 都隨你）
 */
module.exports = {
  // entity 的 name（EntitySchema 的 name 欄位，不是 tableName）
  entities: {
    class: 'Class',      // 你的「班級」entity 叫什麼？
    teacher: 'Teacher',  // 你的「老師」entity
    student: 'Student',  // 你的「學生」entity
    subject: 'Subject',  // 你的「科目」entity
    grade: 'Grade',      // 你的「成績」entity
  },
  // 欄位名（示範 controller 回傳 JSON 時要把你的欄位映射成 API 合約的欄位）
  fields: {
    className: 'name',   // 班級名稱存在哪個欄位？
    teacherName: 'name',
    studentName: 'name',
    subjectName: 'name',
  },
  // relation 屬性名（EntitySchema 的 relations 區塊裡，你取的 key）
  relations: {
    teacherSubjects: 'subjects', // 從老師撈他教的科目，relation 叫什麼？
    subjectGrades: 'grades',     // 從科目撈成績（示範 3 會用到）
  },
}
