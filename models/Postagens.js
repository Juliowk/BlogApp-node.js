const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Postagem = new Schema({
     titulo: { type: String, required: true },
     slug: { type: String, required: true },
     descricao: { type: String, required: true },
     conteudo: { type: String, required: true },
     categoria: {
          type: Schema.Types.ObjectId, // irá armazenar um id de um cataegoria
          ref: "categorias",
          required: true
     },
     data: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("postagens", Postagem);