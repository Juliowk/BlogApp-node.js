const express = require('express');
const router = express.Router();

// DEFININDO AS COLLECTIONS:
const mongoose = require('mongoose');
const Categoria = require('../models/Categoria');
const Postagem = require("../models/Postagens");

// ROTAS:
router.get("/", (req, res) => {
     res.render("admin/index");
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

router.post("/categorias/deletar", (req, res) => {
     Categoria.deleteOne({ _id: req.body.id })
          .then(() => {
               req.flash("success_msg", "Categoria deletada com sucesso!");
               res.redirect("/adm/categorias");
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro ao deletar a categoria");
               res.redirect("/adm/categorias");
          })
});

router.get("/postagens", (req, res) => {
     Postagem.find()
          .populate('categoria')
          .sort({ data: "desc" })
          .then((postagens) => { res.render("admin/postagens", { postagens: postagens }); })
          .catch((erro) => {
               req.flash("error_msg", "Houve um erro ao listar as postagens");
               res.render("admin/postagens");
          });
});

router.get("/postagens/edit/:id", (req, res) => {
     Postagem.findOne({ _id: req.params.id })
          .then((postagem) => {

               Categoria.find()
                    .then((categorias) => {
                         res.render("admin/editpostagens", { categorias: categorias, postagem: postagem });
                    })
                    .catch((error) => {
                         req.flash("error_msg", "Houve um erro ao listar as categorias");
                         res.redirect("/adm/postagens");
                    });

          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro ao carregar o formulário de edição");
               res.redirect("/adm/postagens");
          })
});

router.post("/postagens/edit", (req, res) => {
     Postagem.findOne({ _id: req.body.id })
          .then((postagem) => {
               postagem.titulo = req.body.titulo;
               postagem.slug = req.body.slug;
               postagem.descricao = req.body.descricao;
               postagem.conteudo = req.body.conteudo;
               postagem.categoria = req.body.categoria;

               postagem.save()
                    .then(() => {
                         req.flash("success_msg", "Sucesso ao editar postagem!");
                         res.redirect("/adm/postagens");
                    })
                    .catch((error) => {
                         req.flash("error_msg", "Erro ao salvar edição da postagem");
                         res.redirect("/adm/postagens");
                    });
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro ao salvar a edição");
               res.redirect('/adm/postagens');
          })
});

router.get("/postagens/add", (req, res) => {
     Categoria.find()
          .then((categorias) => res.render("admin/addpostagem", { categorias: categorias }))
          .catch((erro) => {
               req.flash("error_msg", "Houve um erro ao carregar o formulário");
               res.redirect("adm/postagens");
          });
});

router.post("/postagens/nova", (req, res) => {
     var erros = [];
     if (req.body.categoria == 0) {
          erros.push({ texto: "Categoria inválida, registre uma categoria!" });
     }

     if (erros.length > 0) {
          res.render("admin/addpostagem", { erros: erros });
     } else {
          const novaPostagem = {
               titulo: req.body.titulo,
               slug: req.body.slug,
               descricao: req.body.descricao,
               conteudo: req.body.conteudo,
               categoria: req.body.categoria
          }
          new Postagem(novaPostagem).save()
               .then(() => {
                    console.log("sucesso ao adicionar postagem!");
                    req.flash("success_msg", "Postagem criada com sucesso!");
                    res.redirect("/adm/postagens");
               })
               .catch((eror) => {
                    console.log("erro ao adicionar postagem!");
                    req.flash("error_msg", "Houve um erro ao criar a postagem!");
                    res.redirect("/adm/postagens");
               });
     }
});

router.get("/postagens/deletar/:id", (req, res) => {
     Postagem.deleteOne({ _id: req.params.id })
          .then(() => {
               req.flash("success_msg", "Postagem deletada com sucesso");
               res.redirect("/adm/postagens");
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro interno");
               res.redirect("/adm/postagens");
          });
});

module.exports = router;