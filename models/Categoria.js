const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// CRIAÇÃO DO MODEL CATEGORIAS:
const Categoria = new Schema({
     nome: { type: String, required: true },
     slug: { type: String, required: true },
     date: { type: Date, default: Date.now() } // passando valor padrão
});

module.exports = mongoose.model("categorias", Categoria);