const fetchModule = require('node-fetch');
const util = require('./lib/util');
const db = require('./lib/db');
const env = require('./lib/env')

const fetch = fetchModule.default || fetchModule;

const count = 20;
const iconPath = './icon.png';

const editInfo = (name, time) => `${name}在 ${util.formatTime(time)} 更新过`;

async function getCookie() {
  const cookies = await db.read();
  return cookies.map(c => `${c.name}=${c.value};`).join(' ');
}

async function fetchJson(api) {
  const cookie = await getCookie();
  const res = await fetch(api, {
    headers: { cookie },
  });
  const data = await res.json();

  if (data.code !== 0) {
    throw new Error('There is some error!');
  }

  return data.data;
}

async function getStarList(keyword = '') {
  const { entities } = await fetchJson(env.api.star);
  const { nodes: docs, users } = entities;

  return Object.values(docs).map((doc) => ({
    title: util.removeHtmlTag(doc.name),
    subtitle: editInfo(users[doc.edit_uid].cn_name, doc.edit_time),
    arg: doc.url,
    icon: {
      path: iconPath,
    },
  })).filter(doc => doc.title.includes(keyword));
}

function getSearchApi(query) {
  const uri = new URL(env.api.search);
  uri.searchParams.append('query', query);
  uri.searchParams.append('offset', 0);
  uri.searchParams.append('count', count);
  uri.searchParams.append('candidates_type', 2);
  return uri.toString();
}

async function search(query) {
  const api = getSearchApi(query);
  const { entities: { objs: docs } } = await fetchJson(api);

  return Object.values(docs).map((doc) => ({
    title: util.removeHtmlTag(doc.title),
    subtitle: editInfo(doc.edit_name, doc.edit_time),
    arg: doc.url,
    icon: {
      path: iconPath,
    },
  }));
}

async function getRecentList() {
  const uri = new URL(env.api.recent);
  uri.searchParams.append('length', count);
  const { entities } = await fetchJson(uri.toString());
  const { nodes: docs, users } = entities;

  return Object.values(docs).sort((d1, d2) => d2.open_time - d1.open_time).map((doc) => ({
    title: util.removeHtmlTag(doc.name),
    subtitle: editInfo(users[doc.edit_uid].cn_name, doc.edit_time),
    arg: doc.url,
    icon: {
      path: iconPath,
    },
  }));
}

function getLoginItem() {
  return {
    title: '登录授权',
    subtitle: '打开浏览器去登录',
    arg: env.customAction.login,
    icon: {
      path: iconPath,
    },
  };
}

function removeUserData() {
  return {
    title: '清除个人信息',
    subtitle: '清除个人登录信息',
    arg: env.customAction.clear,
    icon: {
      path: iconPath,
    },
  };
}

function getSettingItems() {
  return [getLoginItem(), removeUserData()];
}

function outputAlfredItems(items) {
  console.log(JSON.stringify({ items }));
}

async function main() {
  const type = process.argv[2];
  const keyword = process.argv[3];

  let generateItems;
  switch (type) {
    case '--favorite':
      generateItems = getStarList;
      break;
    case '--setting':
      generateItems = getSettingItems;
      break;
    default:
      generateItems = keyword ? search : getRecentList;
  }

  let items;
  try {
    items = await generateItems(keyword);
  } catch (e) {
    items = [getLoginItem()];
  }
  outputAlfredItems(items);
}

main();
