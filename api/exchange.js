// 简化后的 exchange.js 核心代码（删除邮箱验证部分）
const axios = require('axios');

module.exports = async (req, res) => {
  // 1. 跨域配置（不变）
  res.setHeader('Access-Control-Allow-Origin', 'https://sky1145142024.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: '仅支持 POST 请求' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: '缺少 GitHub 临时授权 code' });

  try {
    // 2. 替换为你的 GitHub Client ID 和 Secret（不变）
    const GITHUB_CLIENT_ID = 'Ov23liUHw8DobU7utxCH';
    const GITHUB_CLIENT_SECRET = '你的最新 Client Secret';

    // 3. 交换 Token（不变）
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, code },
      { headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
    );

    const { access_token, error } = response.data;
    if (error) throw new Error(`GitHub 授权失败：${error}`);
    if (!access_token) throw new Error('未获取到 Token');

    // 4. 直接返回 Token（删除邮箱验证代码）
    return res.status(200).json({ token: access_token });

  } catch (error) {
    console.error('Token 交换失败：', error);
    return res.status(500).json({ error: '服务器交换 Token 失败，请重试' });
  }
};
