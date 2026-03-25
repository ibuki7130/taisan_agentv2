#!/usr/bin/env node
/**
 * Threads 自動投稿システム — エントリーポイント
 *
 * 使い方:
 *   node threads-bot/index.js          # スケジューラー起動（常駐）
 *   node threads-bot/index.js --test   # 今すぐ1投稿テスト
 *   node threads-bot/index.js --stats  # 投稿実績を確認
 */

require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const args = process.argv.slice(2);

async function main() {
  // 環境変数チェック
  const missing = [];
  if (!process.env.ANTHROPIC_API_KEY) missing.push('ANTHROPIC_API_KEY');
  if (!process.env.THREADS_USER_ID) missing.push('THREADS_USER_ID');
  if (!process.env.THREADS_ACCESS_TOKEN) missing.push('THREADS_ACCESS_TOKEN');

  if (missing.length > 0) {
    console.error('❌ .env ファイルに以下の設定が不足しています:');
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error('\n👉 threads-bot/.env.example を .env にコピーして設定してください');
    console.error('   cp threads-bot/.env.example threads-bot/.env');
    process.exit(1);
  }

  if (args.includes('--stats')) {
    const { getStats } = require('./logger');
    const fs = require('fs');
    const path = require('path');
    const stats = getStats();
    console.log('\n📊 投稿実績');
    console.log(`  累計投稿数: ${stats.total}`);
    console.log(`  本日投稿数: ${stats.today}`);

    const logFile = path.join(__dirname, 'logs', 'posts.jsonl');
    if (fs.existsSync(logFile)) {
      const lines = fs.readFileSync(logFile, 'utf-8').trim().split('\n').filter(Boolean);
      const last5 = lines.slice(-5).reverse();
      console.log('\n直近5件:');
      last5.forEach((line) => {
        const entry = JSON.parse(line);
        console.log(`  [${entry.publishedAt?.slice(0, 16)}] ${entry.theme} → ID: ${entry.postId}`);
      });
    }
    return;
  }

  if (args.includes('--test')) {
    console.log('🧪 テスト投稿を実行します...\n');
    const { runPost } = require('./scheduler');
    await runPost('テスト投稿');
    return;
  }

  if (args.includes('--generate')) {
    console.log('✏️  コンテンツ生成のみ（投稿なし）...\n');
    const { generatePost } = require('./generator');
    const result = await generatePost();
    console.log(`テーマ: ${result.theme}`);
    console.log(`\n${result.text}`);
    console.log(`\n文字数: ${result.text.length}文字`);
    return;
  }

  // デフォルト: スケジューラー起動
  const { startScheduler } = require('./scheduler');
  startScheduler();
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
