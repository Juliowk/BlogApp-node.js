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
               res.redirect('/adm/')
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

module.exports = router;