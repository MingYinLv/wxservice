/**
 * Created by MingYin Lv on 2017/9/6 下午2:39.
 */

export default {
  port: 80,
  wxUrl: 'https://api.weixin.qq.com',
  wxToken: 'zhinanmao',
  appid: 'wx1a0f08a0de75c35a',
  secret: 'e34d971b691165e94f6c6c8a717561ec',
  session: {
    secret: 'wxservice',
    key: 'wxservice',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 保存一个月
  },
};

