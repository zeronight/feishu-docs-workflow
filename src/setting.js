const getCookies = require('./lib/auth');
const db = require('./lib/db');

const actions = {
  login: '--login',
  logout: '--logout',
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

async function logout() {
  let hasError;
  try {
    await db.delete();
  } catch (e) {
    hasError = true;
  }

  return hasError ? '注销失败' : '注销成功';
}

async function main() {
  const action = process.argv[2];
  let tip;
  switch (action) {
    case actions.login:
      tip = await login();
      break;
    case actions.logout:
      tip = await logout();
      break;
    default:
      tip = '未知操作';
  }

  console.log(tip);
}

main();
