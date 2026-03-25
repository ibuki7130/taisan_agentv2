#!/usr/bin/env node
/**
 * TAISUN Layer 11: Definition Lint Gate
 * エージェント・スキル定義ファイルの検証
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

// lint-all mode for npm run workflow:lint
if (args[0] === 'lint-all') {
  const agentsDir = path.join(process.cwd(), '.claude', 'agents');
  if (!fs.existsSync(agentsDir)) {
    console.log('[TAISUN] No agents directory found - skipping lint');
    process.exit(0);
  }

  const files = fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'));
  let errors = 0;

  files.forEach(file => {
    const content = fs.readFileSync(path.join(agentsDir, file), 'utf-8');
    if (!content.startsWith('---')) {
      console.error(`[LINT] ${file}: Missing frontmatter`);
      errors++;
    }
  });

  if (errors > 0) {
    console.error(`[TAISUN] Lint: ${errors} error(s) found`);
    process.exit(1);
  }

  console.log(`[TAISUN] Lint: ${files.length} agent definitions OK`);
  process.exit(0);
}

// PostToolUse mode - just log
process.exit(0);
