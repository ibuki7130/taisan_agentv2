/**
 * Threads 投稿コンテンツ生成
 * ターゲット: 30代〜50代女性
 * テーマ: 時間もお金も自由になる方法
 *
 * ── リサーチ結果に基づく設計 ──
 * 【お金の悩み TOP】
 *   - 40代の89%が将来のお金に不安（オカネコ2024）
 *   - 女性74.6%が「老後が不安」
 *   - 86.4%が「年金だけでは不十分」
 *   - 30代女性の50%以上が「老後資金が貯まらない」
 *   - 教育費＋老後資金の二重苦（40代）
 *   - 物価・光熱費高騰が50代女性の悩み1位
 *
 * 【時間の悩み TOP】
 *   - 40代女性の83.4%が日常で悩みあり（ピーク）
 *   - 家事分担は母親9割、自分の時間がない
 *   - 仕事・家事・育児・介護が同時に押し寄せる
 *   - 「自由な時間」「心のリセット」を最も求めている
 *
 * 【共感ワード】
 *   老後不安 / 貯金できない / 時間がない / 一人で抱え込む
 *   副業したい / NISA始めたい / 働き方を変えたい / 自分の時間を取り戻したい
 */

const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ──────────────────────────────────────────
// ターゲット別ペルソナ定義
// ──────────────────────────────────────────
const PERSONAS = [
  {
    age: '30代',
    situation: 'ワーキングマザー。育児・仕事・家事をほぼ一人でこなしている。夫は協力的だが帰りが遅い。保育園・小学校の費用と老後資金を同時に貯めようとして手詰まり感がある',
    pain: '自分の時間がゼロ。貯金ペースが遅くて焦っている。副業をしたいが時間も体力もない',
    keywords: '時短・仕組み化・スキマ時間・副業デビュー・NISA始め方・子育てと両立',
  },
  {
    age: '40代',
    situation: '教育費のピークと老後資金の積み立てが重なる時期。更年期で体力も落ちてきた。昇給が止まりお金が増えない焦り。パート or 正社員で悩んでいる人も多い',
    pain: '教育費と老後資金の二重苦。貯蓄ができない。体力的に今の働き方を続けられるか不安。自分のやりたいことを諦めてきた感覚',
    keywords: '教育費と老後の両立・NISA・在宅ワーク・収入を増やす・自分への投資・更年期と働き方',
  },
  {
    age: '50代',
    situation: '子どもが独立し始め、自分の老後が急にリアルに迫ってくる。物価高騰で生活費が上がっている。年金だけでは足りないとわかっているが、どう動けばいいかわからない',
    pain: '老後資金が全然足りない予感。何から始めればいいかわからない。時間はできてきたが体力とやる気の波がある',
    keywords: '老後2000万問題・年金対策・50代から始めるNISA・ゆとり老後・再就職・資産形成',
  },
];

// ──────────────────────────────────────────
// テーマ × ペルソナ の組み合わせ
// ──────────────────────────────────────────
const THEMES = [
  { topic: 'NISA・積立投資の始め方', angle: '難しそうで手をつけていない人向けに、最初の一歩を具体的に' },
  { topic: '副業・在宅ワーク入門', angle: '子育て中・フルタイム勤務でもできるスキマ時間の使い方' },
  { topic: '時短・家事の仕組み化', angle: '毎日の消耗を減らして自分の時間を生み出す具体策' },
  { topic: '老後資金の現実と対策', angle: '怖くて直視できない老後のお金を冷静に整理する' },
  { topic: '固定費の見直し', angle: '頑張らなくても毎月1〜3万円を手元に残せる節約術' },
  { topic: '収入の柱を増やす考え方', angle: '一つの収入源に依存しないための最初の動き方' },
  { topic: '教育費と老後資金の両立法', angle: '40代が最も悩む「子どものお金」と「自分の老後」の仕分け方' },
  { topic: '物価高騰に負けない家計管理', angle: '値上がりが続く中でも家計を守る実践的な方法' },
  { topic: '働き方を変えて時間を取り戻す', angle: '体力・健康を守りながら収入を維持または増やす選択肢' },
  { topic: 'お金の不安と上手に付き合う', angle: '不安を漠然と抱えるのをやめて、数字で整理するだけで楽になる話' },
  { topic: 'スキマ時間をお金に変える方法', angle: '移動中・子どもの習い事待ちでできる収益化の入口' },
  { topic: '年金だけでは不足する現実と解決策', angle: '86%が「年金だけでは無理」と感じている。では何をすれば?' },
  { topic: '独学でできるお金の勉強法', angle: '難しい本を読まなくても、今日から使えるお金の知識の入り口' },
  { topic: '自分への投資でキャリアを変える', angle: '40〜50代でも遅くない、収入アップにつながるスキルの選び方' },
  { topic: '「お金がない」を卒業するマインドセット', angle: 'お金の悩みの根本にある思い込みを一つ外すだけで変わること' },
];

// ──────────────────────────────────────────
// 時間帯別トーン
// ──────────────────────────────────────────
const TONE_BY_HOUR = {
  morning: '朝の5分で読める。今日からすぐ動けるヒントを、背中を押す温かいトーンで',
  noon: '昼休みのスマホに刺さる。「これ知らなかった！」という発見と、午後の行動につながる内容を',
  night: '一日の終わりに「そうだよね」と共感できる。自分の現状を見つめ直すきっかけになる、少し深い内容を',
};

function getTone() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return TONE_BY_HOUR.morning;
  if (hour >= 11 && hour < 17) return TONE_BY_HOUR.noon;
  return TONE_BY_HOUR.night;
}

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 連続で同じペルソナ・テーマが出ないよう管理
let lastPersonaIndex = -1;
let lastThemeIndex = -1;

function getNextPersona() {
  let idx;
  do { idx = Math.floor(Math.random() * PERSONAS.length); }
  while (idx === lastPersonaIndex);
  lastPersonaIndex = idx;
  return PERSONAS[idx];
}

function getNextTheme() {
  let idx;
  do { idx = Math.floor(Math.random() * THEMES.length); }
  while (idx === lastThemeIndex);
  lastThemeIndex = idx;
  return THEMES[idx];
}

async function generatePost() {
  const persona = getNextPersona();
  const theme = getNextTheme();
  const tone = getTone();

  const prompt = `あなたは30代〜50代の女性に向けて「時間もお金も自由になる方法」を発信しているThreadsアカウントです。

## 今回のターゲット読者
年代: ${persona.age}
状況: ${persona.situation}
悩み: ${persona.pain}
刺さるキーワード: ${persona.keywords}

## 今回のテーマ
テーマ: ${theme.topic}
切り口: ${theme.angle}

## トーン指示
${tone}

## 投稿ルール
- 文字数: 180〜400文字（Threadsの読まれやすい長さ）
- 書き出し: 読者が「私のことだ」と感じる一文から始める（例: 「40代、教育費と老後資金で頭がいっぱいになっていませんか？」）
- 構成: ①共感/問いかけ → ②具体的な情報・数字 → ③今日からできる行動提案
- 語尾: 読者に語りかける口語体
- 絵文字: 2〜3個（押しつけがましくなく自然に）
- ハッシュタグ: 末尾に4〜6個（日本語・具体的なもの）
- データや数字を1つ以上入れる（「40代女性の89%が…」「老後資金は平均2500万円…」など）
- 宣伝・勧誘・誇大表現は一切禁止。リアルで誠実なトーンで

投稿文のみ出力してください。前置きや説明は不要です。`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 600,
    messages: [{ role: 'user', content: prompt }],
  });

  return {
    text: message.content[0].text,
    persona: persona.age,
    theme: theme.topic,
    generatedAt: new Date().toISOString(),
  };
}

module.exports = { generatePost };
