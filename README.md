# BlogApp Node.js

## Descrição

O BlogApp é uma aplicação web desenvolvida utilizando tecnologias modernas como Node.js, Express.js, MongoDB e Handlebars. Este projeto oferece uma plataforma versátil para criar, gerenciar e compartilhar conteúdo através de postagens em um blog.

Com uma interface amigável construída com Bootstrap, o BlogApp proporciona uma experiência intuitiva para os usuários. Desde a tela inicial, os visitantes são recebidos com uma apresentação limpa e organizada das postagens e categorias disponíveis.

## Tecnologias Utilizadas

- Node.js
- JavaScript
- Express.js
- MongoDB
- Handlebars
- Bootstrap

## Telas

### Tela Inicial
![Tela de inicio](./public/images/Captura%20de%20tela%202024-05-15%20093805.png)

### Lista de Categorias Cadastradas
![Tela de categorias](./public/images/Captura%20de%20tela%202024-05-15%20094141.png)

### Tela de Login
![Tela de login](./public/images/Captura%20de%20tela%202024-05-15%20094239.png)

### Tela de Registro
![Tela de registro](./public/images/Captura%20de%20tela%202024-05-15%20094351.png)

### Lista de Categorias
![Tela de categorias](./public/images/Captura%20de%20tela%202024-05-15%20095812.png)

### Nova Categoria
![Nova categoria](./public/images/Captura%20de%20tela%202024-05-15%20095922.png)

### Editar Categoria
![Editar categoria](./public/images/Captura%20de%20tela%202024-05-15%20100035.png)

### Administração de Postagens
![Administração de postagens](./public/images/Captura%20de%20tela%202024-05-15%20100143.png)

### Editar Postagem
![Editar postagem](./public/images/Captura%20de%20tela%202024-05-15%20100241.png)

## Rotas

- **GET** `/`: Tela inicial
- **GET** `/postagem/:slug`: Visualização de uma postagem específica
- **GET** `/categorias`: Lista de categorias cadastradas
- **GET** `/categorias/:slug`: Visualização de postagens de uma categoria específica
- **GET** `/adm/categorias`: Gerenciamento de categorias
- **GET** `/adm/categorias/add`: Adicionar nova categoria
- **POST** `/adm/categorias/nova`: Criar nova categoria
- **GET** `/adm/categorias/edit/:id`: Editar categoria existente
- **POST** `/adm/categorias/edit`: Salvar alterações na categoria
- **POST** `/adm/categorias/deletar`: Excluir categoria
- **GET** `/adm/postagens`: Administração de postagens
- **GET** `/adm/postagens/edit/:id`: Editar postagem existente
- **POST** `/adm/postagens/edit`: Salvar alterações na postagem
- **POST** `/adm/postagens/nova`: Criar nova postagem
- **GET** `/adm/postagens/deletar/:id`: Excluir postagem
- **GET** `/usuarios/registro`: Registro de usuários
- **POST** `/usuarios/registro`: Criar novo usuário
- **GET** `/usuarios/login`: Login de usuários
- **POST** `/usuarios/login`: Autenticar usuário
- **GET** `/usuarios/deslogar`: Encerrar sessão

## Autor

Este projeto foi desenvolvido por [Júlio Elias de Sousa Rocha](https://github.com/Juliowk).
