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

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// REQUIRE DE ROTAS:
const routerAdmin = require('./routes/admin');

const app = express();

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

// ROTAS:
app.use('/adm', routerAdmin);

const PORT = 3000;
app.listen(PORT, () => { console.log(`APLICAÇÃO RODANDO EM: http://localhost:3000/`) });