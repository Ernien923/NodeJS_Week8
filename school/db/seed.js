/**
 * 任務 5：Seeder —— 種一點資料，證明你的表真的能用。
 * 規則：可重複執行（先清空、再種入），跑兩次資料不會翻倍。
 */
const { dataSource } = require('./data-source')

/** 清空：被 FK 指著的表最後刪（GRADE 先刪，CLASS / SUBJECT 最後刪）。
 *  不用 clear()（TRUNCATE 會被 FK 擋）、不用 delete({})（TypeORM 拒絕空條件）。 */
async function clearAll() {
  const ORDER = [
    // TODO: 按「你的」FK 依賴順序填 entity name（先刪 Grade，再 Student，最後 Class / Subject）
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
  // TODO：種資料（至少 2 班、2 科、幾個學生、幾筆成績）
  //   1. 先種 CLASS / SUBJECT
  //   2. 再種 STUDENT（接上 class）
  //   3. 最後種 GRADE（接上 student + subject）
  //   relation 種法：repo.save({ ..., 你的relation屬性: 已存在的物件 })
  // ============================================================

  console.log('🌱 seed 完成')
  await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })
