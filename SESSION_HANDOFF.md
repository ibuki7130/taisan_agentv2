# SESSION HANDOFF DOCUMENT

> **CRITICAL**: 次のセッションは必ずこのファイルを読んでから作業を開始すること

**最終更新**: 2026-03-02（v2.30.0リリース）

## 直近の作業ログ（2026-03-02）

### v2.30.0 — agentシンボリックリンクバグ修正

#### 問題
- `cp -r ~/taisun_agent/.claude .claude` 実行時に `directory causes a cycle` エラー
- 他プロジェクトやユーザーがインストールしてもエージェント・スキルがClaude Code UIに表示されない
- `~/.claude/agents/` に15個しかリンクされていなかった（本来96個）

#### 根本原因
1. **循環シンボリックリンク**: `~/taisun_agent/.claude/.claude → ~/taisun_agent/.claude`（自己参照）
   - `ln -sf ~/taisun_agent/.claude .claude` をリポジトリ内から実行すると生成
   - `.gitignore` に `.claude/.claude` を追加して再発防止
2. **install.sh / update.sh のバグ**: `if [ ! -L "$target" ]` のみのチェック
   - 新規エージェントしかリンクされず、git pull後の追加エージェントが反映されなかった

#### 実施内容
1. **`~/taisun_agent/.claude/.claude` 循環シンボリックリンクを削除**
2. **`.gitignore` に `.claude/.claude` を追記**
3. **`scripts/install.sh`** — agentリンクロジック修正（既存symlink更新対応）
4. **`scripts/update.sh`** — 同上
5. **`README.md`** — アップデート手順を `git pull && ./scripts/update.sh` に統一
6. **`CHANGELOG.md`** — v2.30.0 エントリ追加
7. **`package.json`** — version `2.6.0` → `2.30.0`

#### 確認結果
- `./scripts/install.sh` 実行後: Agents available: 109 ✅

**作業ディレクトリ**: /Users/matsumototoshihiko/Desktop/開発2026/taisun_agentv2

## 既存スクリプト（MUST READ）

```
┌─────────────────────────────────────────────────────────┐
│  「同じワークフロー」指示がある場合、以下を必ず使用    │
└─────────────────────────────────────────────────────────┘
```

- `agent_os/runner 2.py` (7.0KB, 2026/2/8 22:17:24)
- `agent_os/runner 3.py` (7.0KB, 2026/2/8 22:17:24)
- `agent_os/runner 4.py` (7.0KB, 2026/2/8 22:17:24)
- `agent_os/runner 5.py` (7.0KB, 2026/2/8 22:17:24)
- `agent_os/runner 6.py` (7.0KB, 2026/2/8 22:17:24)
- `agent_os/runner.py` (7.0KB, 2026/2/8 22:17:24)
- `dist/scripts/run-benchmarks 2.js` (9.5KB, 2026/2/16 6:50:48)
- `dist/scripts/run-benchmarks 3.js` (9.5KB, 2026/2/16 6:50:48)
- `dist/scripts/run-benchmarks 4.js` (9.5KB, 2026/2/16 6:50:48)
- `dist/scripts/run-benchmarks 5.js` (9.5KB, 2026/2/16 6:50:48)

## ワークフロー定義

- `config/workflows/content_creation_v1 2.json`
- `config/workflows/content_creation_v1 3.json`
- `config/workflows/content_creation_v1 4.json`
- `config/workflows/content_creation_v1 5.json`
- `config/workflows/content_creation_v1.json`

## 次のセッションへの指示

### MUST DO（必須）

1. **このファイルを読む** - 作業開始前に必ず
2. **既存スクリプトを確認** - 新規作成前にReadツールで読む
3. **ユーザー指示を優先** - 推測で作業しない
4. **スキル指定を遵守** - 「〇〇スキルを使って」は必ずSkillツールで

### MUST NOT DO（禁止）

1. **既存ファイルを無視して新規作成** - 絶対禁止
2. **「シンプルにする」と称して異なる実装** - 絶対禁止
3. **指定比率を無視した要約** - 絶対禁止
4. **スキル指示を無視した手動実装** - 絶対禁止

---

*このファイルはセッション終了時に自動生成されます*