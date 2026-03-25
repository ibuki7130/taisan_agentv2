/**
 * 投稿ログ管理
 * 全投稿をJSONLファイルに記録
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'posts.jsonl');

function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function logPost(entry) {
  ensureLogDir();
  const line = JSON.stringify({
    ...entry,
    loggedAt: new Date().toISOString(),
  });
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function logError(error, context = {}) {
  ensureLogDir();
  const errorLogFile = path.join(LOG_DIR, 'errors.jsonl');
  const line = JSON.stringify({
    error: error.message,
    stack: error.stack,
    context,
    loggedAt: new Date().toISOString(),
  });
  fs.appendFileSync(errorLogFile, line + '\n');
  console.error(`[ERROR] ${error.message}`);
}

function getStats() {
  ensureLogDir();
  if (!fs.existsSync(LOG_FILE)) return { total: 0, today: 0 };

  const lines = fs.readFileSync(LOG_FILE, 'utf-8').trim().split('\n').filter(Boolean);
  const today = new Date().toISOString().slice(0, 10);

  const todayPosts = lines.filter((line) => {
    try {
      const entry = JSON.parse(line);
      return entry.loggedAt?.startsWith(today);
    } catch {
      return false;
    }
  });

  return { total: lines.length, today: todayPosts.length };
}

module.exports = { logPost, logError, getStats };
