/**
 * Created by MingYin Lv on 2017/9/6 上午11:38.
 */

const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const path = require('path');

const app = express();
const token = 'zhinanmao';
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/checkWx', (req, res) => {
  const { signature, timestamp, nonce, echostr } = req.query;
  const str = [token, timestamp, nonce].sort().join('');
  const hash = crypto.createHash('sha1');
  hash.update(str);
  const hex = hash.digest('hex');
  console.log(hex);
  res.end(hex === signature ? echostr : '不是微信');
});

app.listen(80, () => {
  console.log(`wxservice listening on port 80`);
});
