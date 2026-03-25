/**
 * 投稿スケジューラー
 * 1日3回（07:30 / 12:30 / 21:00 JST）自動投稿
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const cron = require('node-cron');
const { generatePost } = require('./generator');
const { postToThreads } = require('./poster');
const { logPost, logError, getStats } = require('./logger');

// JST = UTC+9 → cron は UTC で指定
// 07:30 JST = 22:30 UTC (前日)
// 12:30 JST = 03:30 UTC
// 21:00 JST = 12:00 UTC
const SCHEDULES = [
  { cron: '30 22 * * *', label: '朝 07:30 JST' },
  { cron: '30 3 * * *',  label: '昼 12:30 JST' },
  { cron: '0 12 * * *',  label: '夜 21:00 JST' },
];

async function runPost(label) {
  console.log(`\n[${new Date().toISOString()}] 投稿開始 (${label})`);

  try {
    // 1. コンテンツ生成
    console.log('  → Claude でコンテンツ生成中...');
    const generated = await generatePost();
    console.log(`  → テーマ: ${generated.theme}`);
    console.log(`  → 内容:\n${generated.text}\n`);

    // 2. Threads に投稿
    console.log('  → Threads に投稿中...');
    const result = await postToThreads(generated.text);
    console.log(`  ✅ 投稿成功! ID: ${result.postId}`);

    // 3. ログ記録
    logPost({
      label,
      postId: result.postId,
      theme: generated.theme,
      text: generated.text,
      publishedAt: result.publishedAt,
    });

    const stats = getStats();
    console.log(`  📊 本日: ${stats.today}投稿 / 累計: ${stats.total}投稿`);

  } catch (err) {
    logError(err, { label });
    console.error(`  ❌ 投稿失敗: ${err.message}`);
  }
}

function startScheduler() {
  console.log('='.repeat(50));
  console.log('  Threads 自動投稿システム 起動');
  console.log('  テーマ: 時間もお金も自由になる方法');
  console.log('='.repeat(50));
  console.log('スケジュール:');
  SCHEDULES.forEach((s) => console.log(`  - ${s.label} (${s.cron} UTC)`));
  console.log('');

  SCHEDULES.forEach(({ cron: cronExpr, label }) => {
    cron.schedule(cronExpr, () => runPost(label), {
      timezone: 'UTC',
    });
    console.log(`✅ スケジュール登録: ${label}`);
  });

  const stats = getStats();
  console.log(`\n📊 現在の実績: 累計 ${stats.total}投稿`);
  console.log('\n⏳ 次の投稿まで待機中...\n');
}

module.exports = { startScheduler, runPost };
