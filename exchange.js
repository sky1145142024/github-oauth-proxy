const axios = require('axios');

module.exports = async (req, res) => {
  // 允许跨域（替换为你的网站域名）
  res.setHeader('Access-Control-Allow-Origin', 'https://sky1145142024.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求（跨域时浏览器会先发 OPTIONS 请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只处理 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    // 替换为你的 GitHub OAuth 信息
    const clientId = 'YOUR_GITHUB_CLIENT_ID';
    const clientSecret = 'YOUR_GITHUB_CLIENT_SECRET';

    // 向 GitHub 交换 access_token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: clientId, client_secret: clientSecret, code },
      { headers: { Accept: 'application/json' } }
    );

    // 返回 token 给前端
    return res.status(200).json({ token: response.data.access_token });
  } catch (error) {
    console.error('Token exchange failed:', error);
    return res.status(500).json({ error: 'Failed to exchange token' });
  }
};
