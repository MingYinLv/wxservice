/**
 * Created by MingYin Lv on 2017/9/12 下午5:54.
 */

import { Schema } from 'mongoose';

export default new Schema({
  openid: String,
  followOpenId: String,
  followName: String,
});

