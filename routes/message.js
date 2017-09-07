/**
 * Created by MingYin Lv on 2017/9/7 上午9:59.
 */


export default function (req, res) {
  res.end(`<xml>
            <ToUserName><![CDATA[ovHJZ0VpazB47iXZossvjYLnBeVk]]></ToUserName>
            <FromUserName><![CDATA[gh_aea95a658979]]></FromUserName>
            <CreateTime>${Date.now()}</CreateTime>
            <MsgType><![CDATA[text]]></MsgType>
            <Content><![CDATA[自动回复]]></Content>
            </xml>
  `);
}
