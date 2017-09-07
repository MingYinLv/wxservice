/**
 * Created by MingYin Lv on 2017/9/6 上午11:38.
 */

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import mongoStore from 'connect-mongo';
import xmlparser from 'express-xml-bodyparser';
import path from 'path';
import routes from './routes';
import config from './utils/config';
import DBConnection from './db';

const app = express();
const MongoSession = mongoStore(session);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(xmlparser({
  explicitArray: true,
}));

routes(app);

app.use(session({
  sessionId: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  cookie: {
    maxAge: config.session.maxAge, // 过期时间
  },
  store: new MongoSession({ mongooseConnection: DBConnection }),
}));

app.listen(config.port, () => {
  console.log(`wxservice listening on port ${config.port}`);
});
