/**
 * Created by MingYin Lv on 2017/9/6 下午2:31.
 */

import crypto from 'crypto';
import config from '../utils/config';
import { getAccessToken, createMenu } from '../utils/request';
import { login, save } from '../service/UserService';
import checkLogin from '../middleware/checkLogin';

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
      app.get('/', (req, res) => {
        console.log(req.body);
        const { signature, timestamp, nonce, echostr } = req.query;
        const str = [config.wxToken, timestamp, nonce].sort().join('');
        const hash = crypto.createHash('sha1');
        hash.update(str);
        const hex = hash.digest('hex');
        res.end(hex === signature ? echostr : '不是微信');
      });
    },
    login() {
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
    followList() {
      app.get('/followList', checkLogin, (req, res) => {
        res.redirect('/followList.html');
      });
    },
    defaultRequest() {
      app.get('*', (req, res) => {
        console.log(req.originalUrl);
        res.header({
          'Content-Type': 'text/html; charset=UTF-8',
        });
        res.end('自动回复');
      });
      app.post('*', (req, res) => {
        console.log(req.originalUrl);
        res.header({
          'Content-Type': 'text/html; charset=UTF-8',
        });
        res.end('自动回复');
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
