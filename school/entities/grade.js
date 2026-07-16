const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Grade",
  tableName: "GRADE",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    score: {
      type: "int",
      nullable: false,
    },

    // 加上補考分數的新欄位
    retake_score: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    student: {
      type: "many-to-one",
      target: "STUDENT",
      joinColumn: { name: "student_id" },
      nullable: false,
    },
    subject: {
      type: "many-to-one",
      target: "SUBJECT",
      joinColumn: { name: "subject_id" },
      nullable: false,
    },
  },
});
