#!/usr/bin/env node
/**
 * TAISUN Layer 1: Session Start Injector
 * セッション開始時に重要コンテキストを注入
 */

const fs = require('fs');
const path = require('path');

const BASE = process.cwd();

function loadFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch {}
  return null;
}

// Load session handoff if exists
const handoffPath = path.join(BASE, 'SESSION_HANDOFF.md');
const handoff = loadFile(handoffPath);

// Load AUTO_LOG if exists
const autoLogPath = path.join(BASE, 'AUTO_LOG.md');
const autoLog = loadFile(autoLogPath);

// Output context injection
const context = {
  type: 'session_start',
  timestamp: new Date().toISOString(),
  hasHandoff: !!handoff,
  hasAutoLog: !!autoLog,
};

// Log to temp state
const tempDir = path.join(BASE, '.claude', 'temp');
try {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(tempDir, 'session-start.json'),
    JSON.stringify({ ...context, startedAt: new Date().toISOString() }, null, 2)
  );
} catch {}

process.exit(0);
