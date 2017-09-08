/**
 * Created by MingYin Lv on 2017/9/6 下午2:31.
 */

import crypto from 'crypto';
import url from 'url';
import qs from 'querystring';
import pug from 'pug';
import config from '../utils/config';
import { getAccessToken, getQrCode, createMenu, getWebAccessToken } from '../utils/request';
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
        const urlObj = url.parse(returnUrl);
        const code = qs.parse(urlObj.query).code;
        res.end(pug.compileFile('./views/login.pug')({ returnUrl, code }));
      });
      app.post('/login', (req, res) => {
        const { openid, returnUrl, name } = req.body;
        save({
          openid,
          name,
        }).then(({ result }) => {
          req.session.user = result;
          res.redirect(returnUrl);
        }).catch((err) => {
          console.error(err);
          res.redirect(returnUrl);
        });
      });
    },
    getWebAuth() {
      app.get('/getWebAuth/:code', (req, res) => {
        getWebAccessToken(req.params.code).then((data) => {
          console.log(data);
          res.json({
            openid: data.openid,
          });
        });
      });
    },
    getQrCode() {
      app.get('/getQrCode', (req, res) => {
        getQrCode({
          userid: req.session.user._id,
        }).then((data) => {
          console.log(data);
          res.json({ ticket: data.ticket });
        });
      });
    },
    followList() {
      app.get('/followList', checkLogin, (req, res) => {
        res.redirect('/followList.html');
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
  // app.get('*', (req, res) => {
  //   console.log(req.originalUrl, req.body);
  //   res.end('');
  // });
  // app.post('*', (req, res) => {
  //   console.log(req.originalUrl, req.body);
  //   res.end('');
  // });
  initWx();
  isInit = true;
};
