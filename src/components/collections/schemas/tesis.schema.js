import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Tesis', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_tesis: {
    type: Number
  },
  id_generic: {
    type: Number
  },
  id_edit: {
    type: Number
  },
  cod_tesis: {
    type: String
  },
  cod_autor: {
    type: String
  },
  titulo: {
    type: String
  },
  autor_institucional: {
    type: String
  },
  tutor: {
    type: String
  },
  descriptores: {
    type: String
  },
  indice: {
    type: String
  },
  categoria: {
    type: String
  },
  facultad: {
    type: String
  },
  carrera: {
    type: String
  },
  lugar: {
    type: String
  },
  anio: {
    type: String
  },
  tipo: {
    type: String
  },
  precio: {
    type: String
  },
  paginas: {
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
