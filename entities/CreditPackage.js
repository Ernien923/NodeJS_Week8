/**
 * 示範 entity（前輩搬遷時留下的第一張表，跟影片教的同一張）
 * 任務 1、2 請照這個格式寫你的 User / Skill / Course
 * ⚠️ 這個檔案是考卷的一部分，不可修改
 */
const { EntitySchema } = require('typeorm')

module.exports = new EntitySchema({
  name: 'CreditPackage',
  tableName: 'CREDIT_PACKAGE',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
      nullable: false
    },
    name: {
      type: 'varchar',
      length: 50,
      nullable: false,
      unique: true
    },
    credit_amount: {
      type: 'integer',
      nullable: false
    },
    price: {
      type: 'numeric',
      precision: 10,
      scale: 2,
      nullable: false
    },
    created_at: {
      type: 'timestamp',
      createDate: true,
      nullable: false
    }
  }
})
