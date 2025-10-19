// 引入 axios 库（用于发送 HTTP 请求）
const axios = require('axios');

// Vercel 函数入口
module.exports = async (req, res) => {
  // 1. 配置跨域（允许前端域名访问）
  res.setHeader('Access-Control-Allow-Origin', 'https://sky1145142024.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理跨域预检请求（浏览器自动发送的 OPTIONS 请求）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' });
  }

  // 3. 提取前端传递的 GitHub 临时 code
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: '缺少 GitHub 临时授权 code' });
  }


  try {
    // 替换为你的 GitHub OAuth 应用的 Client ID 和 Secret
    const GITHUB_CLIENT_ID = '"Ov23liUHw8DobU7utxCH';
    const GITHUB_CLIENT_SECRET = '0c6f30a374c03aa81efbea9994a090139c23d1be';
  }

     const response = await axios.post(
      'https://github.com/login/oauth/access_token', // 官方固定接口，必须用这个
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code // 前端传递的临时 code
      },
      {
        headers: {
          'Accept': 'application/json', // 要求 GitHub 返回 JSON 格式
          'Content-Type': 'application/json' // 声明请求体格式为 JSON
        }
      }
    );

    // 6. 检查 GitHub 返回的结果
    const { access_token, error } = response.data;
    if (error) {
      // GitHub 返回错误（如 client_id 无效）
      console.error('GitHub 授权错误：', error);
      return res.status(400).json({ error: `GitHub 授权失败：${error}` });
    }

    if (!access_token) {
      // 未返回 token（但无错误信息，罕见情况）
      return res.status(400).json({ error: 'GitHub 未返回有效的 access_token' });
    }

    // 7. 成功获取 token，返回给前端
    return res.status(200).json({ token: access_token });

  } catch (error) {
    // 8. 捕获请求过程中的错误（如网络问题、接口地址错误）
    console.error('Token 交换请求失败：', error.message);
    // 输出详细错误信息到 Vercel 日志（方便排查）
    if (error.response) {
      console.error('GitHub 响应状态：', error.response.status);
      console.error('GitHub 响应内容：', error.response.data);
    }
    return res.status(500).json({ error: '服务器交换 Token 失败，请重试' });
  }
};
