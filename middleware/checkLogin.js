/**
 * Created by MingYin Lv on 2017/9/6 下午4:37.
 */


export default (req, res, next) => {
  if (!req.session.user) {
    res.set('Content-Type', 'application/json; charset=utf-8');
    console.log(req.originalUrl);
    res.redirect(`/login/${encodeURIComponent(req.originalUrl)}`);
    return;
  } else {
    console.log(req.session.user);
  }
  next();
};
