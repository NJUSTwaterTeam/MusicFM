var gravatar = require('gravatar');
var moment = require('moment');

// var User = require('../models/user');
// var Post = require('../models/post');
// var exception = require('../lib/exception');
// var md5 = require('../lib/md5');

var db = require('../models/db');


function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('success', '未登录!');
    return res.redirect('/login');
  }
  next();
}

function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('success', '已登录!');
    console.log("denglu");
    return res.redirect('back');
  }
  next();
}





module.exports = function(app) {
  app.get("/connect", db.connect);

  app.get('/', function(req, res, next) {
    res.render('index', {
      title: '主页',
      error: req.flash('error').toString(),
      success: req.flash('success').toString()
    });
  });
  app.get('/reg', checkNotLogin);
  app.get('/reg', function(req, res, next) {
    db.con();
    res.render('reg', {
      title: '注册',
      error: req.flash('error').toString(),
      success: req.flash('success').toString()
    });
  });
  app.post('/reg', function(req, res,next) {

    var name = req.body.name,
      password = req.body.password,
      password_re = req.body.passwords;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
      req.flash('error', '两次输入的密码不一致!');
      return res.redirect('/reg'); //返回注册页
    }
  });
   app.get('/login', checkNotLogin);
  app.get('/login', function(req, res,next) {
    res.render('login', {
      title: '登录',
      user: req.session.user,
      // flash: req.flash('info').toString()
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/login', function(req, res,next) {
    console.log("ssss" + req.session);
    db.userfind(req.body.name, function(err, user) {
      console.log("lish" + user + " " + err);
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('error', '用户不存在!');
        return res.redirect('/login'); //用户不存在则跳转到登录页
      }
      //检查密码是否一致
      if (req.body.password != user.password) {
        req.flash('error', '密码错误!');
        return res.redirect('/login'); //密码错误则跳转到登录页
      }
      //用户名密码都匹配后，将用户信息存入 session
      req.session.user = user;
      req.flash('success', '登陆成功!');
      res.redirect('/'); //登陆成功后跳转到主页
    });
    console.log("end of it");
    //生成密码的 md5 值
    // var md5 = crypto.createHash('md5'),
    // password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在

  });
  app.get('/post', function(req, res) {
    res.render('post', {
      title: '发表'
    });
  });
  app.post('/post', function(req, res) {});
  app.get('/logout', function(req, res) {});

  app.get('/logout', checkLogin);
  app.get('/logout', function (req, res, next) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
  });
};