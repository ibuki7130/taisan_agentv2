#!/usr/bin/env node
/**
 * TAISUN Layer 2+3+4: Workflow Fidelity Guard (統合)
 * - Layer 3: Read-before-Write
 * - Layer 4: Baseline Lock
 */

const fs = require('fs');
const path = require('path');

const event = JSON.parse(process.env.CLAUDE_HOOK_INPUT || '{}');
const toolName = event.tool_name || '';
const toolInput = event.tool_input || {};

// Read-before-Write check for Edit/Write tools
if (toolName === 'Edit' || toolName === 'Write') {
  const filePath = toolInput.file_path || toolInput.path || '';
  if (filePath) {
    const statePath = path.join(process.cwd(), '.claude', 'temp', 'read-state.json');
    let readState = {};
    try {
      if (fs.existsSync(statePath)) {
        readState = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
      }
    } catch {}

    if (toolName === 'Edit' && !readState[filePath]) {
      // Advisory warning only - do not block
      process.stderr.write(`[TAISUN] Warning: Read-before-Write - ${path.basename(filePath)} has not been read in this session\n`);
    }
  }
}

// Always allow
process.exit(0);
