import { promises as fsp } from 'fs';
import env from './env.mjs';

const encoding = 'utf-8';

const stringify = (auth) => Buffer.from(JSON.stringify(auth), encoding).toString('base64');
const parse = (base64) => JSON.parse(Buffer.from(base64, 'base64').toString(encoding));

export default {
  async save(auth) {
    const base64 = stringify(auth);
    await fsp.writeFile(env.database, base64, encoding);
  },

  async read() {
    const base64 = await fsp.readFile(env.database, encoding);
    return parse(base64);
  },

  async delete() {
    await fsp.unlink(env.database);
  },
};
