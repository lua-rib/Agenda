const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
  res.render("contato", {
    contato: {}
  });
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    const backURL = req.get('Referer') || '/contato/index';

    if (contato.errors.length > 0) {
      req.flash("errors", contato.errors);
      req.session.save(() => res.redirect(backURL));
      return;
    }

    req.flash("success", "Contato registrado com sucesso.")
    return req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`))

  } catch (e) {
    console.log(e);
    return res.render("404");
  }
};

exports.editIndex = async function(req, res) {
    if(!req.parms.id) return res.render('404')

    const contato = await Contato.buscaPorId(req.params.id)
    if(!contato) return res.render('404')
    
    res.render('contato', { contato })
}