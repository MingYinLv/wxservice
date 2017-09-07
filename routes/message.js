/**
 * Created by MingYin Lv on 2017/9/7 上午9:59.
 */

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

  },
};

export default function (req, res) {
  const body = req.body;
  console.log(body);
  // const body = convertXmlJson(req.body);
  if (body.msgtype === MessageType.event) {
    typeof eventHandler[body.event] === 'function' && eventHandler[body.event]({ body }, req, res);
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
