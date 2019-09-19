//verificar se o usuário está autenticado E é admin

module.exports = {
    eAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.eAdmin){
            return next();
        }

        req.flash("error_msg", "EPA, ALTO LÁ, INTRUSO! Você precisa ser um administrador para entrar aqui.");
        res.redirect('/');
    }
}