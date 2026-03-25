#!/usr/bin/env node
/**
 * TAISUN Layer 9: Input Sanitizer Guard
 * 入力の安全性チェック・サニタイズ
 */

const event = JSON.parse(process.env.CLAUDE_HOOK_INPUT || '{}');
const toolName = event.tool_name || '';
const toolInput = event.tool_input || {};

// Check for dangerous patterns in Bash commands
if (toolName === 'Bash') {
  const command = toolInput.command || '';
  const dangerous = [
    /rm\s+-rf\s+\/[^/]/,
    />\s*\/dev\/sd/,
    /mkfs\./,
    /dd\s+if=.*of=\/dev\/[a-z]+\b/,
  ];

  for (const pattern of dangerous) {
    if (pattern.test(command)) {
      process.stderr.write(`[TAISUN] Warning: Potentially dangerous command detected\n`);
      // Advisory only - do not block
      break;
    }
  }
}

process.exit(0);
