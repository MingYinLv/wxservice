/**
 * Created by MingYin Lv on 2017/9/6 上午11:38.
 */

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import routes from './routes';
import config from './utils/config';

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

app.listen(config.port, () => {
  console.log(`wxservice listening on port ${config.port}`);
});
