const express = require('express');
const router = express.Router();

// DEFINIÇÃO DA COLLECTION 'CATEGORIAS':
const mongoose = require('mongoose');
const Categoria = require('../models/Categoria');

// ROTAS:
router.get("/", (req, res) => {
     res.render("admin/index");
});

router.get("/posts", (req, res) => {
     res.send('Página de posts');
});

router.get("/categorias", (req, res) => {
     Categoria.find()
          .sort({ date: 'desc' })
          .then((categorias) => {
               res.render("admin/categorias", { categorias });
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro ao listar as categorias");
               res.redirect('/adm/');
          })
});

router.get("/categorias/add", (req, res) => {
     res.render('admin/addcategorias');
});

router.post('/categorias/nova', (req, res) => {

     var erros = [];
     if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
          erros.push({ texto: "Nome inválido" });
     }
     if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
          erros.push({ texto: "Slug inválido" });
     }
     if (req.body.nome.length < 2) {
          erros.push({ texto: "Nome da categoria muito pequeno" });
     }
     if (erros.length > 0) {
          res.render("admin/addcategorias", { erros });
     } else {

          const novaCategoria = {
               nome: req.body.nome,
               slug: req.body.slug
          }
          new Categoria(novaCategoria).save()
               .then(() => {
                    console.log("Categoria Salva Com Sucesso!");
                    req.flash("success_msg", "Categoria criada com sucesso!");
                    res.redirect('/adm/categorias');
               })
               .catch((error) => {
                    req.flash("error_msg", "Erro ao salvar categoria!");
                    console.log("Erro Ao Salvar Categoria!");
               });

     }
});

router.get("/categorias/edit/:id", (req, res) => {
     Categoria.findOne({ _id: req.params.id })
          .then((categoria) => {
               res.render("admin/editcategorias", { categoria: categoria });
          })
          .catch((error) => {
               req.flash("error_msg", "Está categoria não existe");
               res.redirect("/adm/categorias");
          })
});

router.post("/categorias/edit", (req, res) => {

     var erros = [];
     if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
          erros.push({ texto: "Nome inválido" });
     }
     if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
          erros.push({ texto: "Slug inválido" });
     }
     if (!req.body.id || typeof req.body.id == undefined || req.body.id == null) {
          erros.push({ texto: "Id inválido" });
     }
     if (req.body.nome.length < 2) {
          erros.push({ texto: "Nome da categoria muito pequeno" });
     }
     if (erros.length > 0) {
          res.render("admin/addcategorias", { erros });
     } else {

          Categoria.findOne({ _id: req.body.id })
               .then((categoria) => {
                    categoria.nome = req.body.nome;
                    categoria.slug = req.body.slug;
                    categoria.save()
                         .then(() => {
                              req.flash("success_msg", "Categoria editada com sucesso!");
                              res.redirect("/adm/categorias");
                         })
                         .catch((error) => {
                              req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria");
                              res.redirect("/adm/categorias");
                         })
               })
               .catch((error) => {
                    req.flash("error_msg", "Houve um erro ao editar a categoria");
                    res.redirect("/adm/categorias")
               });
     }

});

module.exports = router;