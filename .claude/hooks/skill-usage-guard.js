#!/usr/bin/env node
/**
 * TAISUN Layer 5: Skill Usage Guard
 * スキル使用の監視・ログ
 */

const fs = require('fs');
const path = require('path');

const event = JSON.parse(process.env.CLAUDE_HOOK_INPUT || '{}');
const toolName = event.tool_name || '';
const toolInput = event.tool_input || {};

// Log skill usage
if (toolName === 'Skill') {
  const skillName = toolInput.skill_name || 'unknown';
  const logPath = path.join(process.cwd(), '.claude', 'temp', 'skill-usage.log');
  try {
    const logDir = path.dirname(logPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const entry = `${new Date().toISOString()} | ${skillName}\n`;
    fs.appendFileSync(logPath, entry);
  } catch {}
}

process.exit(0);
