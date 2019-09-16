const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require("../models/Categoria");
const Categoria = mongoose.model('categorias')

router.get('/', (req, res) => {
    res.render("admin/index");
})
router.get('/posts', (req, res) => {
    res.send("Página de posts");
})
router.get('/categorias', (req, res) => {
    Categoria.find().sort({date: 'desc'}).then((categorias) => {
        res.render("admin/categorias", {categorias: categorias});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias: "+err.toString());
        res.redirect("/admin");
    })
})
router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias");
})
router.post("/categorias/nova", (req, res) => {
    var erros = [];
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({
            texto: "Nome inválido ou inexistente"
        })
    }else if(req.body.nome.length < 2){
        erros.push({texto: "Nome muito pequenino"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
        erros.push({
            texto: "Slug inválido ou inexistente"
        })
    }else if(req.body.slug.length < 2){
        erros.push({
            texto: "Slug muito pequeno"
        })
    }
    //Verifica ocorrência de erros
    if(erros.length > 0) {
        res.render("admin/addcategorias", {erros: erros} )
    }

    const novaCategoria = {
      nome:  req.body.nome,
      slug: req.body.slug
    }
    new Categoria(novaCategoria).save().then(() => {
        console.log("Categoria "+ novaCategoria.nome + " salva com sucesso!");
        req.flash("success_msg", "Categoria criada com sucesso!");
        res.redirect("/admin/categorias");
    }
    ).catch((err) => {
        console.error('Deu defeito: ' +err);
        req.flash("error_msg", "Houve um erro ao salvar a categoria. Tente novamente");
    })
})
router.post("/categorias/edit",(req,res)=> {
    //falta validação
    Categoria.findOne({_id:req.body.id}).then(categoria => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(()=> {
            req.flash("success_msg", "Categoria editada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria.")
            res.redirect("/admin/categorias");
        })
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro ao editar a categoria: " +err)
    })
})
router.get("/categorias/edit/:id", (req,res) => {
Categoria.findOne({_id: req.params.id}).then((categoria)=> {
    res.render("admin/editcategorias", {categoria: categoria})

}).catch((err)=> {
    req.flash("error_msg", "Houve um erro ao tentar editar esta categoria");
    res.redirect("/admin/categorias");
})
})

router.post("/categorias/deletar", (req,res) => {
    Categoria.remove({_id: req.body.id}).then(()=> {
        req.flash("success_msg", "Categoria removida com sucesso!");
        res.redirect("/admin/categorias");
    }).catch((err)=> {
        req.flash("error_msg", "Houve um erro na remoção desta categoria.")
    })
})

router.get("/postagens", (req,res) => {
    res.render("admin/postagens");
})

router.get("/postagens/add", (req,res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagens", {categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

module.exports = router;