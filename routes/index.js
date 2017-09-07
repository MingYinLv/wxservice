/**
 * Created by MingYin Lv on 2017/9/6 下午2:31.
 */

import crypto from 'crypto';
import url from 'url';
import qs from 'querystring';
import pug from 'pug';
import config from '../utils/config';
import { getAccessToken, createMenu, getWebAccessToken } from '../utils/request';
import { login, save } from '../service/UserService';
import checkLogin from '../middleware/checkLogin';
import message from '../utils/message';

let isInit = false;
let routes = null;


function initWx() {
  getAccessToken().then(() => {
    createMenu();
  });
}

function generator(app) {
  return {
    init() {
      app.get('/', (req, res) => {
        const { signature, timestamp, nonce, echostr } = req.query;
        const str = [config.wxToken, timestamp, nonce].sort().join('');
        const hash = crypto.createHash('sha1');
        hash.update(str);
        const hex = hash.digest('hex');
        res.end(hex === signature ? echostr : '不是微信');
      });
      app.post('/', (req, res) => {
        const { signature, timestamp, nonce } = req.query;
        const str = [config.wxToken, timestamp, nonce].sort().join('');
        const hash = crypto.createHash('sha1');
        hash.update(str);
        const hex = hash.digest('hex');
        if (hex === signature) {
          message(req, res);
        } else {
          res.end('');
        }
      });
    },
    login() {
      app.get('/login/:returnUrl', (req, res) => {
        const { returnUrl } = req.params;
        res.end(pug.compileFile('./views/login.pug')({ returnUrl }));
      });
      app.post('/login', (req, res) => {
        const { openid, returnUrl } = req.body;
        login({
          openid,
        }).then(({ result }) => {
          req.session.user = result;
          res.redirect(returnUrl);
        });
      });
    },
    toWxAuth() {
      app.get('/toWxAuth', (req, res) => {
        const { returnUrl } = req.query;
        res.redirect(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appid}&redirect_uri=${encodeURIComponent(returnUrl)}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`);
      });
    },
    followList() {
      app.get('/followList', checkLogin, (req, res) => {
        res.redirect('/followList.html');
      });
    },
    defaultRequest() {
      app.get('*', (req, res) => {
        console.log(req.originalUrl, req.body);
        res.end('');
      });
      app.post('*', (req, res) => {
        console.log(req.originalUrl, req.body);
        res.end('');
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
