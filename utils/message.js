/**
 * Created by MingYin Lv on 2017/9/7 上午9:59.
 */

import { sendTemplate } from './request';
import { find } from '../service/UserService';

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
  SCAN: 'SCAN',
};

const eventHandler = {
  [EventType.SUBSCRIBE]: ({ body }, req, res) => {
    console.log('订阅推送');
    sendTemplate({
      touser: body.fromusername,
      template_id: 'uGBs1aTCRFwJwWUx3TN_sZWtxM3Ga3xLPmvLS40wcOA',
      data: {},
    });
    res.end('');
  },
  [EventType.SCAN]: ({ body }, req, res) => {
    const { eventkey } = body;
    console.log('扫描带参数的二维码', eventkey);
    find(eventkey).then((data) => {
      console.log(data);
      sendTemplate({
        touser: body.fromusername,
        template_id: 'yRsrZ7JhukYcFVng9Hs7IA4Ybx2PTl0zq94oeL09tHI',
        data: {
          name: {
            value: data.name,
          },
        },
      });
    });
    res.end('');
  },
};

export default function (req, res) {
  const body = convertXmlJson(req.body);
  console.log(body);
  if (body.msgtype === MessageType.EVENT) {
    if (typeof eventHandler[body.event] === 'function') {
      eventHandler[body.event]({ body }, req, res);
    } else {
      // 默认不处理
      res.end('');
    }
  } else {
    res.end(`<xml>
            <ToUserName><![CDATA[${body.fromusername}]]></ToUserName>
            <FromUserName><![CDATA[gh_aea95a658979]]></FromUserName>
            <CreateTime>${Date.now()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[自动回复]]></Content>
            </xml>
  `);
  }
}
