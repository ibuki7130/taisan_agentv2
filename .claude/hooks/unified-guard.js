#!/usr/bin/env node
/**
 * TAISUN Unified Guard
 * Layer 2-4 の統合実行 (高速化)
 */

const fs = require('fs');
const path = require('path');

const event = JSON.parse(process.env.CLAUDE_HOOK_INPUT || '{}');
const toolName = event.tool_name || '';
const toolInput = event.tool_input || {};
const BASE = process.cwd();

// Track file reads for Read-before-Write
if (toolName === 'Read') {
  const filePath = toolInput.file_path || '';
  if (filePath) {
    const statePath = path.join(BASE, '.claude', 'temp', 'read-state.json');
    let readState = {};
    try {
      const tempDir = path.dirname(statePath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      if (fs.existsSync(statePath)) {
        readState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      }
      readState[filePath] = new Date().toISOString();
      fs.writeFileSync(statePath, JSON.stringify(readState, null, 2));
    } catch {}
  }
}

// Input sanitizer check for Bash
if (toolName === 'Bash') {
  const command = toolInput.command || '';
  const dangerous = [
    /rm\s+-rf\s+\/[^/]/,
    />\s*\/dev\/sd/,
  ];
  for (const pattern of dangerous) {
    if (pattern.test(command)) {
      process.stderr.write(`[TAISUN] Warning: Potentially dangerous command\n`);
      break;
    }
  }
}

// Always allow
process.exit(0);
