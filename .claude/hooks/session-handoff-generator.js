#!/usr/bin/env node
/**
 * TAISUN Session Handoff Generator
 * セッション終了時にハンドオフ情報を生成
 */

const fs = require('fs');
const path = require('path');

const BASE = process.cwd();
const handoffPath = path.join(BASE, 'SESSION_HANDOFF.md');

try {
  const timestamp = new Date().toISOString();
  const content = `# SESSION HANDOFF\n\n_Generated: ${timestamp}_\n\n## セッション終了\n\n前のセッションは正常に終了しました。\n\n---\n*TAISUN v2 Auto-generated*\n`;

  if (!fs.existsSync(handoffPath)) {
    fs.writeFileSync(handoffPath, content);
  }
} catch {}

process.exit(0);
