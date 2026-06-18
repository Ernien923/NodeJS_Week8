/**
 * 任務 4：Seeder —— 種一點資料，證明你的表真的能用。
 * 規則：可重複執行（先清空、再種入），跑兩次資料不會翻倍。
 * 執行順序：一定要先 npm run migration:run（表都還沒有，種什麼）
 */
const { dataSource } = require('./data-source')

/** 清空：被 FK 指著的表最後刪（先刪 COURSE，再 USER / SKILL）。
 *  不用 clear()（TRUNCATE 會被 FK 擋）、不用 delete({})（TypeORM 拒絕空條件）。 */
async function clearAll() {
  for (const name of ['Course', 'User', 'Skill']) {
    if (dataSource.hasMetadata(name)) {
      await dataSource.createQueryBuilder().delete().from(name).execute()
    }
  }
}

async function main() {
  await dataSource.initialize()
  await clearAll()

  // ============================================================
  // TODO：照規格種資料（規格見 README）
  //   1. SKILL 三筆：重訓、瑜珈、飛輪
  //   2. USER 兩位教練（role 'COACH'）：coach1@livefit.tw、coach2@livefit.tw
  //   3. COURSE 四堂課，每堂接上教練與技能
  //   relation 種法：courseRepo.save({ name: '...', User: 教練, Skill: 技能 })
  // ============================================================

  console.log('🌱 seed 完成')
  await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })
