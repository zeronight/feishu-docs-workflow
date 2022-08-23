export default {
  browserPath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',

  authPage: 'https://bytedance.feishu.cn/drive/home/',

  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',

  database: './.DB',

  api: {
    star: 'https://bytedance.feishu.cn/space/api/explorer/v2/star/list/',
    search: 'https://bytedance.feishu.cn/space/api/search/refine_search/',
    recent: 'https://bytedance.feishu.cn/space/api/explorer/recent/list/',
  },

  actionType: {
    setting: 'setting',
    open: 'open',
    copy: 'copy',
  },
};
