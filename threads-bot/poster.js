/**
 * Threads API 投稿クライアント
 * Meta Threads Graph API v1.0
 */

const https = require('https');

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

function httpsPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => (responseBody += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/**
 * Threads に投稿する（2ステップ）
 * Step 1: コンテナ作成
 * Step 2: 公開
 */
async function postToThreads(text) {
  const userId = process.env.THREADS_USER_ID;
  const token = process.env.THREADS_ACCESS_TOKEN;

  if (!userId || !token) {
    throw new Error('THREADS_USER_ID と THREADS_ACCESS_TOKEN を .env に設定してください');
  }

  // Step 1: メディアコンテナ作成
  const createUrl = `${THREADS_API_BASE}/${userId}/threads?access_token=${token}`;
  const createRes = await httpsPost(createUrl, {
    media_type: 'TEXT',
    text,
  });

  if (createRes.status !== 200 || !createRes.data.id) {
    throw new Error(`コンテナ作成失敗: ${JSON.stringify(createRes.data)}`);
  }

  const containerId = createRes.data.id;

  // Step 2: 公開（APIの反映を待つ）
  await new Promise((r) => setTimeout(r, 2000));

  const publishUrl = `${THREADS_API_BASE}/${userId}/threads_publish?access_token=${token}`;
  const publishRes = await httpsPost(publishUrl, {
    creation_id: containerId,
  });

  if (publishRes.status !== 200 || !publishRes.data.id) {
    throw new Error(`公開失敗: ${JSON.stringify(publishRes.data)}`);
  }

  return {
    postId: publishRes.data.id,
    containerId,
    publishedAt: new Date().toISOString(),
  };
}

module.exports = { postToThreads };
