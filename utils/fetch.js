/**
 * Created by MingYin Lv on 2017/9/6 下午2:38.
 */

import fetch from 'node-fetch';
import config from './config';
import { getTokenByStr } from './request';

export default (url, options) => {
  const opts = {
    method: 'GET',
  };

  Object.assign(opts, options);
  opts.body = opts.body ? JSON.stringify(opts.body) : undefined;

  let suffix = `access_token=${getTokenByStr()}`;
  if (url.includes('?')) {
    suffix = `&${suffix}`;
  } else {
    suffix = `?${suffix}`;
  }

  const requestUrl = `${config.wxUrl}${url}${suffix}`;
  console.log('请求接口:', requestUrl);

  return fetch(requestUrl, opts).then((response) => {
    if (response.ok) {
      return response.json();
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }).catch((err) => {
    console.error(err);
  });
};
