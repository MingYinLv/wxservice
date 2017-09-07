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
    url: encodeURIComponent(`https://open.weixin.qq.com/connect/oauth2/authorize?
    appid=${config.appid}&redirect_uri=http://www.lvmingyin.com/followList
    &response_type=code&scope=snsapi_base#wechat_redirect`),
  }, {
    type: 'click',
    name: '个人中心',
    key: 'personCenter',
    sub_button: [
      {
        type: 'view',
        name: '我的二维码',
        url: 'http://www.lvmingyin.com/myQrCode',
      },
      {
        type: 'view',
        name: '我的订单',
        url: 'http://www.lvmingyin.com/myOrderList',
      }, {
        type: 'view',
        name: '我的路线',
        url: 'http://www.lvmingyin.com/myRouteList',
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
  }).then(({ errcode, errmsg }) => {
    if (errcode === 0) {
      console.info('微信菜单创建成功');
    } else {
      console.log(errcode, errmsg);
    }
  });
}

export function sendTemplate(body) {
  return fetch('/cgi-bin/message/template/send', {
    method: 'POST',
    body,
  });
}
