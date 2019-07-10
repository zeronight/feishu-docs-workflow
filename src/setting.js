const getCookies = require('./lib/auth');
const db = require('./lib/db');

const actions = {
  login: '--login',
  clear: '--clear',
};

async function login() {
  let hasError;
  try {
    const cookies = await getCookies();
    await db.save(cookies);
  } catch(e) {
    hasError = true;
  }

  return hasError ? '登录失败' : '登录成功';
}

async function clear() {
  let hasError;
  try {
    await db.delete();
  } catch (e) {
    hasError = true;
  }

  return hasError ? '清理失败' : '清理成功';
}

async function main() {
  const action = process.argv[2];
  let tip;
  switch (action) {
    case actions.login:
      tip = await login();
      break;
    case actions.clear:
      tip = await clear();
      break;
    default:
      tip = '未知操作';
  }

  console.log(tip);
}

main();
