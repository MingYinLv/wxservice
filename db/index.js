/**
 * Created by MingYin Lv on 2017/9/6 下午4:16.
 */


import mongoose from 'mongoose';
import UserSchema from './User';
import FollowSchema from './Follow';

mongoose.Promise = Promise;
const db = mongoose.createConnection('localhost', 'wxservice');

export default db;

export const UserModel = db.model('user', UserSchema, 'users');
export const FollowModel = db.model('follow', FollowSchema, 'follows');

