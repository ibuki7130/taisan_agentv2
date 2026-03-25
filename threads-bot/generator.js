/**
 * Threads 投稿コンテンツ生成
 * Claude AI で「時間もお金も自由になる方法」に関する投稿を生成
 */

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// 投稿テーマのバリエーション（毎回違う角度で発信）
const THEMES = [
  '副業・収入源の増やし方',
  '時間を作るための仕組み化・自動化',
  'フリーランス・独立の具体的な一歩',
  'お金の知識・投資・資産形成',
  'マインドセット・自由な生き方の考え方',
  '会社員でも実践できる自由を増やす方法',
  'スキルアップで収入を上げる方法',
  '生活コストを下げて自由度を上げる方法',
  'SNS・コンテンツで収益を作る方法',
  '時間とお金の両立に成功した人の共通点',
];

// 時間帯別のトーン
const TONE_BY_HOUR = {
  morning: '朝の前向きなエネルギーで、今日行動できる具体的なヒントを伝える',
  noon: '昼休みに読める、すぐ使える実践的なノウハウを伝える',
  night: '夜の振り返りに合う、深い気づきや長期視点の考え方を伝える',
};

function getTone() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return TONE_BY_HOUR.morning;
  if (hour >= 11 && hour < 17) return TONE_BY_HOUR.noon;
  return TONE_BY_HOUR.night;
}

function getRandomTheme() {
  return THEMES[Math.floor(Math.random() * THEMES.length)];
}

async function generatePost() {
  const theme = getRandomTheme();
  const tone = getTone();

  const prompt = `あなたは「時間もお金も自由になる方法」を発信しているThreadsアカウントです。
以下の条件で投稿文を1つ生成してください。

【テーマ】${theme}
【トーン】${tone}

【ルール】
- 文字数: 150〜400文字（Threadsの最適な長さ）
- 語尾: 読者に語りかける口語体（「〜です」「〜ます」「〜ですよね」など）
- 構成: 共感できる問いかけ or 驚きの事実 → 具体的な内容 → 読者への行動提案
- 絵文字: 2〜4個を効果的に使う
- ハッシュタグ: 末尾に3〜5個（日本語）
- 毎回違う切り口にする
- 宣伝・勧誘は禁止。純粋に価値ある情報を届ける

投稿文のみ出力してください（説明文は不要）。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  return {
    text: message.content[0].text,
    theme,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { generatePost };
