// (INFO) O QUE É EXPRESS:
// É um framework para Node.js que fornece recursos mínimos para construção de serviços web. Facilita
// o desenvolvimentos de aplicações back-end.

// (INFO) O QUE É EXPRESS-HANDLEBARS:
// Template Engine JavaScript usado para manipular um layout HTML, permitindo fragmentar o código 
// HTML em módulos/Views.

// (INFO) O QUE É BODY-PARSER:
// Middleware que faz a analise e parse dos dados de entrada contidos no corpo da requisição, disponibilizando 
// as propriedades em req.body, as quais podem ser facilmente acessadas em notação de objeto.

// (INFO) O QUE É MONGOOSE:
// O Mongoose é uma biblioteca Node.js que facilita a modelagem de objetos MongoDB para aplicativos 
// web, fornecendo uma interface simples e baseada em esquemas para interagir com o banco de dados MongoDB.

// (INFO) BIBLIOTECA PATH:
// A biblioteca `path` é um módulo do Node.js que fornece utilitários para manipular caminhos de arquivos e 
// diretórios de forma consistente e portável entre diferentes sistemas operacionais. Ele simplifica a criação 
// e manipulação de caminhos, permitindo a construção segura de caminhos de arquivos em aplicativos Node.js.

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const Postagem = require("./models/Postagens"); // MODEL
const Categoria = require("./models/Categoria"); // MODEL

const passport = require("passport");
require("./config/auth")(passport);

const app = express();

// REQUIRE DE ROTAS:
const routerAdmin = require('./routes/admin');
const routerUsuarios = require('./routes/usuario');

// CONFIGURAÇÕES DE SESSÃO:
app.use(session({ // utilizado para armazenar dados de sessão do usuário entre diferentes requisições HTTP
     secret: 'qualquercoisa',
     resave: true,
     saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// MIDDLEWARE:
app.use((req, res, next) => {
     // VARIAVEIS GLOBAIS: (acessaveis em qualquer parte do projeto)
     res.locals.success_msg = req.flash("success_msg");
     res.locals.error_msg = req.flash("error_msg");
     res.locals.error = req.flash("error");
     res.locals.user = req.user || null;
     next();
});

// CONFIGURAÇÕES DO BODY-PARSER (Middleware):
app.use(bodyParser.urlencoded({ extended: true })); // irá analisar dados de formulários URL-encoded
app.use(bodyParser.json()); // irá analisar dados JSON enviados no corpo das requisições HTTP

// CONFIGURAÇÕES DO HANDLEBARS (Templayte Engine):
app.engine('handlebars', handlebars.engine({ // hendlebars setado como templete engine, e main setado como layout padrão
     defaultLayout: 'main',
     runtimeOptions: {
          allowProtoPropertiesByDefault: true,
          allowProtoMethodsByDefault: true
     }
}));
app.set('view engine', 'handlebars'); // indica ao Express que o motor de visualização padrão a ser usado é o Handlebars

// CONFIGURAÇÕES DA PASTA PUBLIC (PATH):
// (configura o Express para servir arquivos estáticos localizados no diretório "public" do servidor);
app.use(express.static(path.join(__dirname, "public")));

// CONFIGURAÇÕES DO MONGOOSE: (relizando conexão)
mongoose.connect("mongodb://localhost/blogapp")
     .then(() => {
          console.log("Conectado ao mongo");
     }).catch((error) => {
          console.log("Erro ao se conectar:" + error);
     });

// ROTAS:
app.get("/", (req, res) => {
     Postagem.find().populate("categoria")
          .sort({ data: "desc" })
          .then((postagens) => {
               const formattedPostagens = postagens.map(postagem => ({
                    ...postagem.toObject(),
                    data: postagem.data.toLocaleString()
               }));
               res.render("index", { postagens: formattedPostagens });
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro interno")
               res.render("/404");
          });
});

app.get("/postagem/:slug", (req, res) => {
     Postagem.findOne({ slug: req.params.slug })
          .then((postagem) => {
               if (postagem) {
                    postagem = { ...postagem.toObject(), data: postagem.data.toLocaleString() }
                    res.render("postagem/index", { postagem: postagem });
               } else {
                    req.flash("error_msg", "Está postagem não existe!");
                    res.redirect("/");
               }
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro interno!");
               res.redirect("/")
          })
});

app.get("/categorias", (req, res) => {
     Categoria.find()
          .sort({ date: 'desc' })
          .then((categorias) => {
               res.render("categorias/index", { categorias: categorias });
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro interno ao listar as categorias");
               res.redirect("/");
          })
});

app.get("/categorias/:slug", (req, res) => {
     Categoria.findOne({ slug: req.params.slug })
          .sort({ date: 'desc' })
          .then((categoria) => {
               if (categoria) {
                    Postagem.find({ categoria: categoria._id })
                         .sort({ data: 'desc' })
                         .then((postagens) => {
                              postagens = postagens.map(postagem => ({
                                   ...postagem.toObject(), data: postagem.data.toLocaleString(), nomeCategoria: categoria.nome
                              }));
                              res.render("categorias/postagens", { postagens: postagens, categoria: categoria });
                         })
                         .catch((error) => {
                              req.flash("error_msg", "Houve um erro ao listar os posts");
                              res.redirect("/");
                         });
               } else {
                    req.flash("error_msg", "Essa categoria não existe");
                    res.redirect("/");
               }
          })
          .catch((error) => {
               req.flash("error_msg", "Houve um erro interno ao carregar a página dessa categoria");
               res.redirect("/");
          })
});

app.get("/404", (req, res) => {
     res.send("Erro 404!");
});

app.use('/adm', routerAdmin);
app.use('/usuarios', routerUsuarios);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`APLICAÇÃO RODANDO!`) });
