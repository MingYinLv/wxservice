/**
 * Created by MingYin Lv on 2017/9/12 下午5:55.
 */
/**
 * Created by MingYin Lv on 2017/9/6 下午4:24.
 */

import mongoose from 'mongoose';
import { FollowModel } from '../db';

/**
 * 查找
 * @param _id id
 * @param followId 关注的id
 * @returns {Promise}
 */
export const find = ({ openid, followOpenId }) => {
  return FollowModel
    .findOne({
      openid, followOpenId,
    })
    .exec();
};

export const save = (follow) => {
  // todo
  return new Promise((resolve) => {
    find(follow).then((data) => {
      if (data && data.openid) {
        return resolve({ result: data });
      }
      const articleEntity = new FollowModel(follow);
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