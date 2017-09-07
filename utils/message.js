/**
 * Created by MingYin Lv on 2017/9/7 上午9:59.
 */

import { sendTemplate } from './request';

function convertXmlJson(body) {
  const xml = body.xml;
  const result = {};
  Object.keys(xml).forEach((n) => {
    result[n] = xml[n].join(',');
  });
  return result;
}

export const MessageType = {
  TEXT: 'text',
  EVENT: 'event',
};

export const EventType = {
  SUBSCRIBE: 'subscribe',     // 订阅事件
  UNSUBSCRIBE: 'unsubscribe', // 取消订阅事件
};

const eventHandler = {
  [EventType.SUBSCRIBE]: ({ body }, req, res) => {
    sendTemplate({
      touser: body.fromusername,
      template_id: 'uGBs1aTCRFwJwWUx3TN_sZWtxM3Ga3xLPmvLS40wcOA',
      url: 'http://www.lvmingyin.com/welcome',
      data: {},
    });
    res.end('');
  },
};

export default function (req, res) {
  const body = convertXmlJson(req.body);
  if (body.msgtype === MessageType.event) {
    if (eventHandler[body.event] === 'function') {
      eventHandler[body.event]({ body }, req, res);
    } else {
      // 默认不处理
      res.end('');
    }
  } else {
    res.end(`<xml>
            <ToUserName><![CDATA[ovHJZ0VpazB47iXZossvjYLnBeVk]]></ToUserName>
            <FromUserName><![CDATA[gh_aea95a658979]]></FromUserName>
            <CreateTime>${Date.now()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[自动回复]]></Content>
            </xml>
  `);
  }
}
