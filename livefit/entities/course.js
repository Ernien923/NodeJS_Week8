const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Course",
  tableName: "COURSE",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    name: {
      type: "varchar",
      length: 100,
      nullable: false,
    },
    description: {
      type: "text",
      nullable: false,
    },
    start_at: {
      type: "timestamp",
      nullable: false,
    },
    end_at: {
      type: "timestamp",
      nullable: false,
    },
    max_participants: {
      type: "int",
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      createDate: true,
    },

    // 加上會議連結新欄位
    meeting_url: {
      type: "varchar",
      length: 2048,
      nullable: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "USER",
      joinColumn: { name: "user_id" },
    },
    skill: {
      type: "many-to-one",
      target: "SKILL",
      joinColumn: { name: "skill_id" },
    },
  },
});
