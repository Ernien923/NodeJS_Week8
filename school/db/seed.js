/**
 * 任務：Seeder —— 把 fixtures/seed-data.json 的資料映射進「你設計的」schema
 * 規則：可重複執行（先清空、再種入）
 *
 * 種子資料不要手抄！直接 require 唯一真相：
 */
const seedData = require('../fixtures/seed-data.json')
const { dataSource } = require('./data-source')

/** 清空鷹架（為什麼不用 clear()？它走 TRUNCATE 會被 FK 擋。
 *  為什麼不用 delete({})？TypeORM 拒絕空條件。
 *  正解：query builder + 順序——被 FK 指著的最後刪。 */
async function clearAll() {
  const ORDER = [
    // TODO: 按「你的」FK 依賴順序填 entity name（先刪指向別人的，再刪被指的）
    // 例：'Grade', 'Student', 'Subject', 'Teacher', 'Class'
  ]
  for (const name of ORDER) {
    if (dataSource.hasMetadata(name)) {
      await dataSource.createQueryBuilder().delete().from(name).execute()
    }
  }
}

async function main() {
  await dataSource.initialize()
  await clearAll()

  // ============================================================
  // TODO：照 seedData 種資料（classes → teachers/subjects → students → grades）
  //
  // 提示：
  // - relation 的種法：repo.save({ ..., 你的relation屬性: 已存在的物件 })
  // - grades 裡的 retake_score：你的演進 migration 還沒跑之前，這個欄位不存在
  //   ——先種 score，retake_score 的那筆用 try/catch 包住或判斷後再種
  //   （錯誤訊息 "column ... does not exist" = 先跑 npm run migration:run）
  // - 分數建議用 integer 欄位（numeric 在 node-pg 會回字串，算平均會踩雷）
  // ============================================================

  console.log('🌱 seed 完成')
  await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })
