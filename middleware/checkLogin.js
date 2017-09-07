/**
 * Created by MingYin Lv on 2017/9/6 下午4:37.
 */


export default (req, res, next) => {
  if (!req.session.user) {
    res.set('Content-Type', 'application/json; charset=utf-8');
    res.redirect(`/login/${encodeURIComponent(req.originalUrl)}`);
    return;
  }
  next();
};
