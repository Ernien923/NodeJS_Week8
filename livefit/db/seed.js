/**
 * 任務 4：Seeder —— 一個指令把 dev 環境的資料種回來
 * 規則：可以重複執行（先清空、再種入），跑一百次結果都一樣
 *
 * 執行順序：一定要先 npm run migration:run（表都還沒有，種什麼）
 */
const { dataSource } = require('./data-source')

/** 清空區塊（前輩寫好的，不用改）
 *  ⚠️ 為什麼不用 repo.clear()？它走 TRUNCATE，會被 FK 擋下
 *  ⚠️ 為什麼不用 repo.delete({})？TypeORM 拒絕空條件的 delete
 *  正解：用 query builder，而且「順序」很重要——先刪 COURSE，
 *  再刪 USER / SKILL（想想 FK 指向誰，被指著的不能先死）
 */
async function clearAll() {
  for (const name of ['Course', 'User', 'Skill', 'CreditPackage']) {
    if (dataSource.hasMetadata(name)) {
      await dataSource.createQueryBuilder().delete().from(name).execute()
    }
  }
}

async function main() {
  await dataSource.initialize()
  await clearAll()

  // ── 示範：種購買方案（照這個 pattern 完成下面的 TODO）──
  const pkgRepo = dataSource.getRepository('CreditPackage')
  await pkgRepo.save({ name: '體驗包', credit_amount: 1, price: 300 })

  // ============================================================
  // TODO 任務 4：照規格種資料（規格見 README 的「種子資料規格」）
  //
  // 1. SKILL 三筆：重訓、瑜珈、飛輪
  // 2. USER 兩位教練（role 'COACH'）：
  //    海格教練 coach1@livefit.tw、小美教練 coach2@livefit.tw
  // 3. COURSE 四堂課：肌力入門班、週末飛輪、晨間瑜珈、核心特訓
  //    每堂課都要接上教練與技能 —— relation 的種法（一行範例）：
  //    courseRepo.save({ name: '...', ..., User: coachA, Skill: skills[0] })
  // ============================================================

  console.log('🌱 seed 完成')
  await dataSource.destroy()
}

main().catch((e) => { console.error('seed 失敗：', e.message); process.exit(1) })
