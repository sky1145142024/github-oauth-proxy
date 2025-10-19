const axios = require('axios');

module.exports = async (req, res) => {
  // 允许跨域：必须改为你的前端域名（无 -web）
  res.setHeader('Access-Control-Allow-Origin', 'https://sky1145142024.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理跨域预检请求
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '只支持 POST 请求' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '缺少 GitHub 临时 code' });

  try {
    // 替换为你的 GitHub OAuth 应用的 Client ID 和 Secret
    const GITHUB_CLIENT_ID = '"Ov23liUHw8DobU7utxCH';
    const GITHUB_CLIENT_SECRET = '0c6f30a374c03aa81efbea9994a090139c23d1be';

    // 向 GitHub 交换 access_token
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: 'application/json' } }
    );

    return res.status(200).json({ token: response.data.access_token });
  } catch (error) {
    console.error('Token 交换失败：', error);
    return res.status(500).json({ error: '服务器交换 Token 失败' });
  }
};
