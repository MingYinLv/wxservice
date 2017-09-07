/**
 * Created by MingYin Lv on 2017/9/6 下午3:19.
 */

import fetch from './fetch';
import config from './config';

let tokenFetch = null;
let accessToken = '';
const defaultMenu = {
  button: [{
    type: 'view',
    name: '定制行程',
    url: `${config.web}/toWxAuth.html?returnUrl=${encodeURIComponent(`${config.web}/followList`)}`,
  }, {
    type: 'click',
    name: '个人中心',
    key: 'personCenter',
    sub_button: [
      {
        type: 'view',
        name: '我的二维码',
        url: `${config.web}/myQrCode`,
      },
      {
        type: 'view',
        name: '我的订单',
        url: `${config.web}/myOrderList`,
      }, {
        type: 'view',
        name: '我的路线',
        url: `${config.web}/myRouteList`,
      }],
  }],
};


export function getTokenByStr() {
  return accessToken;
}

function initAccessToken() {
  return fetch(`/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`)
    .then(({ access_token, expires_in }) => {
      setTimeout(initAccessToken, expires_in * 1000);
      accessToken = access_token;
      console.log('access_token:', access_token);
      return Promise.resolve(access_token);
    });
}

export function getAccessToken() {
  if (!tokenFetch) tokenFetch = initAccessToken();
  return tokenFetch;
}

export function createMenu(menu = defaultMenu) {
  return fetch('/cgi-bin/menu/create', {
    method: 'POST',
    body: menu,
  }).then(({ errcode }) => {
    if (errcode === 0) {
      console.info('微信菜单创建成功');
    }
  });
}

export function sendTemplate(body) {
  return fetch('/cgi-bin/message/template/send', {
    method: 'POST',
    body,
  });
}

export function getWebAccessToken(code) {
  return fetch(`/sns/oauth2/access_token?grant_type=authorization_code&appid=${config.appid}&secret=${config.secret}&code=${code}`);
}
