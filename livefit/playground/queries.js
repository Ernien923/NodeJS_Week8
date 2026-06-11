/**
 * 🏋️ Repository 查詢練功房（不評分，課堂 demo 同款）
 * 前提：練習場任務 1~5 完成（三表都建好、種子種好、演進跑過）
 * 跑法：node playground/queries.js
 *
 * 六小題對應考場六招——每題做完打開註解對答案。
 * （程式裡的 relation 名 User/Skill/Course 是練習場規格的命名——你取了不同名字就照你的改）
 */
const { dataSource } = require('../db/data-source')

async function main() {
  await dataSource.initialize()
  const courseRepo = dataSource.getRepository('Course')
  const userRepo = dataSource.getRepository('User')

  // 第 1 招｜find() 全撈
  const all = await courseRepo.find()
  console.log('1️⃣ 共幾堂課：', all.length) // 預期：4

  // 第 2 招｜find({ relations })：課程帶教練
  const withCoach = await courseRepo.find({ relations: { User: true } })
  console.log('2️⃣ 第一堂課的教練：', withCoach[0].User.name) // 預期：海格教練 或 小美教練

  // 第 3 招｜巢狀 relations：教練 → 課程 → 技能（兩層）
  const coaches = await userRepo.find({ relations: { Course: { Skill: true } } })
  // ⚠️ 這招要你的 User entity 有 inverse relation（relations 區塊的 Course）——沒有就加，這正是考場示範 3 的招
  console.log('3️⃣ 海格教的技能：', coaches.find(u => u.name === '海格教練')?.Course?.map(c => c.Skill.name)) // 預期：[重訓, 重訓]

  // 第 4 招｜findOne + 查無處理
  const ghost = await courseRepo.findOne({ where: { name: '不存在的課' } })
  console.log('4️⃣ 查無資料時 findOne 回：', ghost) // 預期：null（所以 controller 要自己回 404）

  // 第 5 招｜save()：新增一堂課（帶 FK relation）
  const skills = await dataSource.getRepository('Skill').find()
  const saved = await courseRepo.save({
    name: '深夜加練班', description: 'playground 試手感', max_participants: 5,
    start_at: '2026-08-10 21:00+08', end_at: '2026-08-10 22:00+08',
    User: coaches[0], Skill: skills[0],
  })
  console.log('5️⃣ 新課 id：', saved.id) // 預期：一個 uuid

  // 第 6 招｜update() + affected
  const r = await courseRepo.update(saved.id, { meeting_url: 'https://meet.livefit.tw/night' })
  console.log('6️⃣ update affected：', r.affected) // 預期：1（0 = 沒這筆 → controller 該回 404）

  await courseRepo.delete(saved.id) // 收工，把練習資料清掉
  await dataSource.destroy()
  console.log('✅ 六招打完，可以進考場了')
}

main().catch((e) => { console.error('💥', e.message); process.exit(1) })
