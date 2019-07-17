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

function buildItemArg(type, arg) {
  return [type, arg].join(',');
}

function buildDocItemArg(doc) {
  return {
    ...doc,
    arg: buildItemArg(env.actionType.open, doc.arg),
    mods: {
      cmd: {
        arg: buildItemArg(env.actionType.copy, doc.arg),
        subtitle: '复制文档链接',
      },
    },
  };
}

async function getStarList(keyword = '') {
  const { entities } = await fetchJson(env.api.star);
  const { nodes: docs, users } = entities;

  return Object.values(docs).map((doc) => buildDocItemArg({
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

const compareOpenTime = (doc1, doc2) => doc2.open_time - doc1.open_time;
const isMatched = (text) => /<em>.+<\/em>/i.test(text);
const compareSearchItem = (doc1, doc2) => {
  const isTitleMatched = isMatched(doc2.title);
  if (isTitleMatched !== isMatched(doc1.title)) {
    return isTitleMatched ? 1 : -1;
  }

  const isPreviewMatched = isMatched(doc2.preview);
  if (isPreviewMatched !== isMatched(doc1.preview)) {
    return isPreviewMatched ? 1 : -1;
  }

  return compareOpenTime(doc1, doc2);
};

async function search(query) {
  const api = getSearchApi(query);
  const { entities: { objs: docs } } = await fetchJson(api);

  return Object.values(docs).sort(compareSearchItem).map((doc) => buildDocItemArg({
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

  return Object.values(docs).sort(compareOpenTime).map((doc) => buildDocItemArg({
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
    arg: buildItemArg(env.actionType.setting, 'login'),
    icon: {
      path: iconPath,
    },
  };
}

function removeUserData() {
  return {
    title: '退出登录',
    subtitle: '清除个人登录信息',
    arg: buildItemArg(env.actionType.setting, 'logout'),
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
  const keyword = process.argv.slice(3).join(' ');

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
