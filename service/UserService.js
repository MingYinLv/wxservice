/**
 * Created by MingYin Lv on 2017/9/6 下午4:24.
 */

import mongoose from 'mongoose';
import { UserModel } from '../db';


/**
 * 用户登陆
 * @param openid 微信openid
 * @returns {Promise}
 */
export const login = ({ openid }) => {
  return UserModel.findOne({
    openid,
  }).exec();
};

export const find = (openid) => {
  return UserModel.findOne({ openid }).exec();
};

export const save = (user) => {
  // todo
  return new Promise((resolve) => {
    find(user.openid).then((data) => {
      if (data && data.openid) {
        return resolve({ result: data });
      }
      const articleEntity = new UserModel(user);
      return articleEntity.save((err, result, numberAffected) => {
        if (err) {
          resolve({
            result,
            line: 0,
          });
        }
        // 返回保存的内容和受影响的行数
        resolve({
          result,
          line: numberAffected,
        });
      });
    });
  });
};