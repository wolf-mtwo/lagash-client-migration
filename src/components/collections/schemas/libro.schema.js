import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Libro', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_libro: {
    type: Number
  },
  id_generic: {
    type: Number
  },
  id_edit: {
    type: Number
  },
  cod_lib: {
    type: String
  },
  cod_autor: {
    type: String
  },
  titulo: {
    type: String
  },
  descriptores: {
    type: String
  },
  indice: {
    type: String
  },
  volumen: {
    type: String
  },
  tomo: {
    type: String
  },
  ejemplar: {
    type: String
  },
  paginas: {
    type: String
  },
  anio: {
    type: String
  },
  edicion: {
    type: String
  },
  isbn: {
    type: String
  },
  incluye: {
    type: String
  },
  tipo: {
    type: String
  },
  ilustracion: {
    type: String
  },
  tam: {
    type: String
  },
  precio: {
    type: String
  },
  estado: {
    type: String
  },
  notas: {
    type: String
  },
  autor_aux: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
