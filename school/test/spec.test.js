/**
 * W8 考場驗收 —— 行為黑箱：只打 API、只認 openapi.yaml 的合約。
 * 你的 schema 長什麼樣、表叫什麼名字，這份測試完全不知道也不在乎。
 * （id 一律從 API 回應「收割」，不假設型別）
 */
const request = require('supertest')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const app = require('../server/app')
const { dataSource } = require('../db/data-source')
const seedData = require('../fixtures/seed-data.json')

let zhong, xiao // 忠班 / 孝班（收割來的物件 {id, name}）

beforeAll(async () => {
  await dataSource.initialize()
  const res = await request(app).get('/api/classes')
  if (res.status === 200 && Array.isArray(res.body)) {
    zhong = res.body.find((c) => c.name === '忠班')
    xiao = res.body.find((c) => c.name === '孝班')
  }
})
afterAll(async () => { await dataSource.destroy() })

// 同型別的「不存在 id」：長得像 uuid 就回隨機 uuid，像數字就回超大數
const ghostId = (realId) =>
  /^[0-9]+$/.test(String(realId)) ? '999999999' : '00000000-0000-4000-8000-000000000000'

describe('任務 0｜點名（這條紅 = 先檢查 seed 跟 entity-map，後面全部會連動）', () => {
  test('GET /api/classes 回忠班、孝班', async () => {
    const res = await request(app).get('/api/classes')
    expect(res.status).toBe(200)
    const names = (res.body || []).map((c) => c.name).sort()
    try {
      expect(names).toEqual(['孝班', '忠班'].sort())
    } catch (e) {
      throw new Error(`點名失敗：期望 [忠班, 孝班]，實際拿到 ${JSON.stringify(names)}——先檢查 npm run seed 有沒有跑、entity-map.js 的名字對了沒`)
    }
  })
})

describe('示範端點（老師寫好——紅了代表任務 0 還沒完成）', () => {
  test('GET /api/teachers 回兩位老師與科目', async () => {
    const res = await request(app).get('/api/teachers')
    expect(res.status).toBe(200)
    const wang = res.body.find((t) => t.name === '王老師')
    expect(wang.subjects).toEqual(['數學'])
  })
  test('GET /api/teachers/:id 回科目明細（含 id 與 gradeCount）', async () => {
    const list = await request(app).get('/api/teachers')
    const wang = list.body.find((t) => t.name === '王老師')
    const res = await request(app).get(`/api/teachers/${wang.id}`)
    expect(res.status).toBe(200)
    expect(res.body.subjects[0]).toMatchObject({ name: '數學' })
    expect(res.body.subjects[0].id).toBeDefined()
    expect(res.body.subjects[0].gradeCount).toBeGreaterThanOrEqual(4)
  })
  test('GET /api/teachers/:id 查無此人回 404', async () => {
    const list = await request(app).get('/api/teachers')
    const res = await request(app).get(`/api/teachers/${ghostId(list.body[0].id)}`)
    expect(res.status).toBe(404)
  })
})

describe('TODO 1｜班級學生名單', () => {
  test('忠班名單：小明、小華', async () => {
    const res = await request(app).get(`/api/classes/${zhong.id}/students`)
    expect(res.status).toBe(200)
    expect(res.body.map((s) => s.name).sort()).toEqual(['小明', '小華'].sort())
  })
  test('孝班名單：小美、阿強（每人都帶 id）', async () => {
    const res = await request(app).get(`/api/classes/${xiao.id}/students`)
    expect(res.body.map((s) => s.name).sort()).toEqual(['小美', '阿強'].sort())
    expect(res.body.every((s) => s.id !== undefined)).toBe(true)
  })
  test('查無班級回 404', async () => {
    const res = await request(app).get(`/api/classes/${ghostId(zhong.id)}/students`)
    expect(res.status).toBe(404)
  })
})

const harvestStudent = async (name) => {
  for (const cls of [zhong, xiao]) {
    const res = await request(app).get(`/api/classes/${cls.id}/students`)
    const hit = (res.body || []).find?.((s) => s.name === name)
    if (hit) return hit
  }
  throw new Error(`收割不到學生「${name}」——TODO 1 要先綠，這條才測得動`)
}

describe('TODO 2｜學生基本資料', () => {
  test('小明：name + className', async () => {
    const ming = await harvestStudent('小明')
    const res = await request(app).get(`/api/students/${ming.id}`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ name: '小明', className: '忠班' })
  })
  test('查無學生回 404', async () => {
    const ming = await harvestStudent('小明')
    const res = await request(app).get(`/api/students/${ghostId(ming.id)}`)
    expect(res.status).toBe(404)
  })
})

describe('TODO 6｜班級摘要（在登分變動之前驗，數字照種子算）', () => {
  test('孝班：數學平均 76（阿強補考 71 取代 57）、英文平均 88', async () => {
    const res = await request(app).get(`/api/classes/${xiao.id}/summary`)
    expect(res.status).toBe(200)
    expect(res.body.class).toBe('孝班')
    const avg = Object.fromEntries(res.body.averages.map((a) => [a.subject, a.average]))
    expect(avg['數學']).toBe(76)
    expect(avg['英文']).toBe(88)
  })
  test('忠班：數學 85、英文 89，且平均是 number 不是字串', async () => {
    const res = await request(app).get(`/api/classes/${zhong.id}/summary`)
    const avg = Object.fromEntries(res.body.averages.map((a) => [a.subject, a.average]))
    expect(avg['數學']).toBe(85)
    expect(avg['英文']).toBe(89)
    expect(typeof avg['數學']).toBe('number')
  })
  test('查無班級回 404', async () => {
    const res = await request(app).get(`/api/classes/${ghostId(xiao.id)}/summary`)
    expect(res.status).toBe(404)
  })
})

describe('TODO 3｜學生成績單', () => {
  test('阿強：一筆數學 57、補考 71（成績帶 id）', async () => {
    const chiang = await harvestStudent('阿強')
    const res = await request(app).get(`/api/students/${chiang.id}/report`)
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ name: '阿強', className: '孝班' })
    expect(res.body.grades.length).toBe(1)
    expect(res.body.grades[0]).toMatchObject({ subject: '數學', score: 57, retake_score: 71 })
    expect(res.body.grades[0].id).toBeDefined()
  })
  test('小明：兩筆成績，沒補考的 retake_score 是 null', async () => {
    const ming = await harvestStudent('小明')
    const res = await request(app).get(`/api/students/${ming.id}/report`)
    expect(res.body.grades.length).toBe(2)
    const math = res.body.grades.find((g) => g.subject === '數學')
    expect(math.score).toBe(95)
    expect(math.retake_score).toBeNull()
  })
  test('查無學生回 404', async () => {
    const ming = await harvestStudent('小明')
    const res = await request(app).get(`/api/students/${ghostId(ming.id)}/report`)
    expect(res.status).toBe(404)
  })
})

describe('TODO 4 + 5｜補登成績與補考登分（阿強的英文補考記）', () => {
  let chiang, engSubjectId, newGradeId
  beforeAll(async () => {
    chiang = await harvestStudent('阿強')
    const teachers = await request(app).get('/api/teachers')
    const lin = teachers.body.find((t) => t.name === '林老師')
    const detail = await request(app).get(`/api/teachers/${lin.id}`)
    engSubjectId = detail.body.subjects.find((s) => s.name === '英文').id
  })
  test('POST /api/grades 補登阿強英文 65 → 201 帶 id', async () => {
    const res = await request(app).post('/api/grades').send({ studentId: chiang.id, subjectId: engSubjectId, score: 65 })
    expect(res.status).toBe(201)
    expect(res.body.score).toBe(65)
    expect(res.body.id).toBeDefined()
    newGradeId = res.body.id
  })
  test('分數 150 → 400', async () => {
    const res = await request(app).post('/api/grades').send({ studentId: chiang.id, subjectId: engSubjectId, score: 150 })
    expect(res.status).toBe(400)
  })
  test('查無學生 → 404', async () => {
    const res = await request(app).post('/api/grades').send({ studentId: ghostId(chiang.id), subjectId: engSubjectId, score: 60 })
    expect(res.status).toBe(404)
  })
  test('PATCH retake 78 → 200', async () => {
    const res = await request(app).patch(`/api/grades/${newGradeId}/retake`).send({ retake_score: 78 })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ score: 65, retake_score: 78 })
  })
  test('成績單同步看得到補考（65 / 78）', async () => {
    const res = await request(app).get(`/api/students/${chiang.id}/report`)
    const eng = res.body.grades.find((g) => g.subject === '英文')
    expect(eng).toMatchObject({ score: 65, retake_score: 78 })
  })
  test('PATCH 查無成績 → 404', async () => {
    const res = await request(app).patch(`/api/grades/${ghostId(newGradeId)}/retake`).send({ retake_score: 70 })
    expect(res.status).toBe(404)
  })
})

describe('機制驗收（schema 不限長相，但這些事實必須成立）', () => {
  test('migrations 歷史至少 2 筆（建表與演進要分開）', async () => {
    const r = await dataSource.query('SELECT count(*)::int AS n FROM migrations')
    expect(r[0].n).toBeGreaterThanOrEqual(2)
  })
  test('synchronize 不可以是 true', () => {
    expect(dataSource.options.synchronize).not.toBe(true)
  })
  test('至少 4 張資料表（寬表設計過不了這關——想想正規化）', async () => {
    const r = await dataSource.query(`SELECT count(*)::int AS n FROM information_schema.tables
      WHERE table_schema='public' AND table_type='BASE TABLE' AND table_name NOT IN ('migrations')`)
    expect(r[0].n).toBeGreaterThanOrEqual(4)
  })
  test('至少 3 條外鍵（關係要用 FK 立規矩）', async () => {
    const r = await dataSource.query(`SELECT count(*)::int AS n FROM pg_constraint WHERE contype='f'`)
    expect(r[0].n).toBeGreaterThanOrEqual(3)
  })
  test('schema.dbml 存在且至少畫了一條關聯（Ref:）', () => {
    const p = path.join(__dirname, '..', 'schema.dbml')
    expect(fs.existsSync(p)).toBe(true)
    expect(fs.readFileSync(p, 'utf-8')).toMatch(/Ref:?/i)
  })
  test('seed 可重跑：再執行一次，資料回到種子狀態不翻倍', async () => {
    execSync('node db/seed.js', { stdio: 'pipe', cwd: path.join(__dirname, '..') })
    // 重種後 id 全是新的——重新收割，不能用舊的
    const classes = await request(app).get('/api/classes')
    expect(classes.body.length).toBe(2)
    const freshXiao = classes.body.find((c) => c.name === '孝班')
    const students = await request(app).get(`/api/classes/${freshXiao.id}/students`)
    expect(students.body.length).toBe(2)
    const chiang = students.body.find((s) => s.name === '阿強')
    const report = await request(app).get(`/api/students/${chiang.id}/report`)
    expect(report.body.grades.length).toBe(1)
  })
})
