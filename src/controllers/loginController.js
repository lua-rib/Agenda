const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  if(req.session.user) return res.render('login-logado')
  return res.render("login");
};

exports.register = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      return req.session.save(function () {
        return res.redirect("/login/index");
      });
    }

    req.flash("success", 'Seu usuário foi criado com sucesso.');
    return req.session.save(function () {
        return res.redirect("/login/index");
    });
    
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.login = async function (req, res) {
  try {
    const login = new Login(req.body);
    await login.login();

    const backURL = req.get('Referer') || '/login/index';

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      return req.session.save(function () {
        return res.redirect(backURL);
      });
    }

    req.flash("success", 'Você entrou no sistema.');
    req.session.user = login.user;
    
    return req.session.save(function () {
        return res.redirect(backURL);
    });
    
  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.logout = function(req, res) {
  req.session.destroy()
  res.redirect('/')
}