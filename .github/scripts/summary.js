/**
 * 把 jest 的 JSON 結果轉成 GitHub Actions Job Summary 表格
 * 用法：node .github/scripts/summary.js "標題" jest-result.json
 */
const fs = require('fs');

const title = process.argv[2] || '驗收';
const file = process.argv[3] || 'jest-result.json';
const out = process.env.GITHUB_STEP_SUMMARY;

const stripAnsi = (s) => String(s).replace(/\[[0-9;]*m/g, '');

let md = '';

if (!fs.existsSync(file)) {
  md = [
    `## 🛑 ${title}：測試沒有執行`,
    '',
    '通常是資料庫沒起來、migration 沒跑、或 seed 失敗。',
    '往上看「起資料庫」「執行你的 migrations」「執行你的 seeder」step 的錯誤訊息。',
    '',
  ].join('\n');
} else {
  const r = JSON.parse(fs.readFileSync(file, 'utf8'));
  const rows = [];
  const fails = [];
  for (const suite of r.testResults || []) {
    for (const t of suite.assertionResults || suite.testResults || []) {
      const ok = t.status === 'passed';
      const name = t.fullName || t.title;
      rows.push(`| ${ok ? '✅' : '❌'} | ${name} |`);
      if (t.status === 'failed') fails.push(t);
    }
  }
  const icon = r.numFailedTests === 0 && r.numTotalTests > 0 ? '✅' : '❌';
  md = [
    `## ${icon} ${title}：${r.numPassedTests}/${r.numTotalTests} 通過`,
    '',
    '| 結果 | 行為合約 |',
    '|---|---|',
    ...rows,
    '',
  ].join('\n');

  if (fails.length) {
    md += `\n### 沒過的 ${fails.length} 條，失敗原因在這\n`;
    for (const t of fails) {
      const msg = stripAnsi((t.failureMessages || []).join('\n'))
        .split('\n')
        .slice(0, 25)
        .join('\n');
      md += `\n<details><summary>❌ ${t.fullName || t.title}</summary>\n\n\`\`\`\n${msg}\n\`\`\`\n\n</details>\n`;
    }
    md += '\n> 三步自救：讀上面的失敗原因 → 本機 `npm test` 重現 → 對照 openapi.yaml（localhost:8081）檢查回應形狀。\n';
  }
}

fs.appendFileSync(out, md + '\n');
console.log('summary written');
