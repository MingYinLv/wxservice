/**
 * Created by MingYin Lv on 2017/9/6 下午2:31.
 */

import crypto from 'crypto';
import config from '../utils/config';
import { getAccessToken, createMenu } from '../utils/request';

let isInit = false;
let routes = null;


function initWx() {
  getAccessToken().then(() => {
    createMenu();
  });
}

function generator(app) {
  return {
    checkWx() {
      app.get('/checkWx', (req, res) => {
        const { signature, timestamp, nonce, echostr } = req.query;
        const str = [config.wxToken, timestamp, nonce].sort().join('');
        const hash = crypto.createHash('sha1');
        hash.update(str);
        const hex = hash.digest('hex');
        res.end(hex === signature ? echostr : '不是微信');
      });
    },
    followList() {
      app.get('/followList', (req, res) => {

      });
    },
  };
}


export default (app) => {
  if (isInit) return;
  routes = generator(app);
  const keys = Object.keys(routes);
  keys.forEach((n) => {
    typeof routes[n] === 'function' && routes[n]();
  });
  initWx();
  isInit = true;
};
