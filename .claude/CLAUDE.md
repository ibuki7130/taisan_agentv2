# TAISUN Agent 2026 — 絶対遵守ルール (Layer 0)

## 🔴 絶対禁止事項

1. **ファイル読み前に書き込みしない** — Edit/Write前に必ずReadを実行
2. **スキル未使用でスキル機能を提供しない** — Skill tool を先に呼ぶ
3. **承認なしにワークフローを逸脱しない**
4. **コンテキストを無視したコード生成をしない**

## ✅ 必須手順

- Read-before-Write: 既存ファイルを編集する前に必ず読む
- Skill-first: スキルが定義されている機能はSkill toolで実行
- エラー時は原因を調査してから対処

## 📋 セッション開始時

1. AGENTS.md を確認して前回の教訓を把握
2. SESSION_HANDOFF.md で引き継ぎ事項を確認
3. memory_bank/ の関連情報を確認

## 🔗 参照

- 詳細ルール: `.claude/references/CLAUDE-L2.md`
- エージェント定義: `.claude/agents/`
- スキル一覧: `~/.claude/skills/`

---

*TAISUN v2 | Layer 0 Defense | Windows Edition*
