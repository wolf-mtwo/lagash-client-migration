import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Revista', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_revista: {
    type: Number
  },
  id_generic: {
    type: Number
  },
  id_edit: {
    type: Number
  },
  cod_revista: {
    type: String
  },
  cod_autor: {
    type: String
  },
  titulo: {
    type: String
  },
  sub_titulo: {
    type: String
  },
  autor_institucional: {
    type: String
  },
  editor: {
    type: String
  },
  fecha: {
    type: String
  },
  periodicidad: {
    type: String
  },
  descriptores: {
    type: String
  },
  indice: {
    type: String
  },
  numero: {
    type: String
  },
  volumen: {
    type: String
  },
  ejemplar: {
    type: String
  },
  paginas: {
    type: String
  },
  issn: {
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
