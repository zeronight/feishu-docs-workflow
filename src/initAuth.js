const getCookies = require('./lib/auth');
const db = require('./lib/db');

async function run() {
  let hasError;
  try {
    const cookies = await getCookies();
    await db.save(cookies);
  } catch(e) {
    hasError = true;
  }

  console.log(hasError ? '登录失败' : '登录成功');
}

run();
