//Carregando módulos
    const express = require('express');
    const handlebars = require('express-handlebars');
    const bodyParser = require('body-parser');
    const app = express();
    const admin = require("./routes/admin");
    const path = require('path');
    const mongoose = require('mongoose');
    const session = require('express-session');
    const flash = require('connect-flash');
    require("./models/Postagem");
    const Postagem = mongoose.model("postagens");

//Configurações
    //Sessões
    app.use(session({
        secret:'umnomeharoldao',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash());
    //Middleware
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        //console.log('Oi, eu sou um middleware!');
        next();
    })
    //Body Parser
        app.use(bodyParser.urlencoded({extended:true}));
        app.use(bodyParser.json());
    //Handlebars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.set('view engine', 'handlebars');
    //Mongoose
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://localhost/blogapp").then(() => {
        console.log("Conectado ao mongoose");

    }).catch((err) => {
        console.error("Deu defeito..." + err);
    })
        //Soon....Foda....
    //Public
        app.use(express.static(path.join(__dirname, "public")))
//Rotas
    app.use('/admin', admin);
    app.get('/', (req,res) => {
        Postagem.find().populate("categoria").sort({data:'desc'}).then((postagens) => {
            res.render('index', {postagens: postagens});
        }).catch((err) => {
            req.flash("error_msg", "Erro ao carregar as postagens");
            res.redirect("/404");
        })
    })

    app.get("/404", (req,res) => {
        res.send("Erro 404.");
    })
    app.get('/posts', (req,res) => {
        res.send('Página de posts');
    })
    app.get("/postagem/:slug", (req,res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem) => {
            if(postagem){
                res.render("postagem/index", {postagem: postagem})
            }else{
                req.flash("error_msg", "Esta postagem não existe");
                res.redirect("/");
            }
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/");
        });
    })
//Outros
const PORT = 1488
app.listen(PORT, () => {
    console.log('Servidor rodando');
});