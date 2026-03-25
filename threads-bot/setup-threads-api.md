# Threads API セットアップガイド（5分で完了）

## Step 1: Meta Developer アカウント作成

1. https://developers.facebook.com/ にアクセス
2. 右上「ログイン」→ Facebookアカウントでログイン
3. 「アプリを作成」をクリック

## Step 2: アプリ作成

1. アプリタイプ: **「その他」** を選択 → 次へ
2. アプリ名: 任意（例: `threads-auto-post`）
3. 「アプリを作成」をクリック

## Step 3: Threads API を追加

1. アプリダッシュボード →「製品を追加」
2. **「Threads API」** を探して「設定」をクリック

## Step 4: アクセストークン取得

1. Threads API → **「クイックスタート」**
2. 「Threads プロフィール」でThreadsアカウントを接続
3. 権限を確認:
   - `threads_basic` ✅
   - `threads_content_publish` ✅
4. **「トークンを生成」** をクリック
5. 表示されたトークンをコピー

## Step 5: User ID 確認

```
https://graph.threads.net/v1.0/me?fields=id,username&access_token=【トークン】
```
ブラウザで上記URLにアクセス → `"id": "123456789"` の数字をコピー

## Step 6: .env ファイルに設定

```bash
cp threads-bot/.env.example threads-bot/.env
```

`.env` を開いて入力:
```
ANTHROPIC_API_KEY=sk-ant-...（Claude APIキー）
THREADS_USER_ID=123456789（Step5で確認した数字）
THREADS_ACCESS_TOKEN=取得したトークン
```

## Step 7: 動作確認

```bash
# コンテンツ生成テスト（投稿なし）
node threads-bot/index.js --generate

# 実際に1投稿テスト
node threads-bot/index.js --test

# スケジューラー起動（毎日3回自動投稿）
node threads-bot/index.js
```

---

## トークンの有効期限について

- 短期トークン: 1時間
- 長期トークン: 60日（推奨）

長期トークンへの変換:
```
https://graph.threads.net/access_token?
  grant_type=th_exchange_token&
  client_id=【アプリID】&
  client_secret=【アプリシークレット】&
  access_token=【短期トークン】
```
