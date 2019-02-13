import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Tesis', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_TESIS: {
    type: Number
  },
  ID_GENERIC: {
    type: Number
  },
  ID_EDIT: {
    type: Number
  },
  COD_TESIS: {
    type: String
  },
  COD_AUTOR: {
    type: String
  },
  TITULO: {
    type: String
  },
  AUTOR_INSTITUCIONAL: {
    type: String
  },
  TUTOR: {
    type: String
  },
  DESCRIPTORES: {
    type: String
  },
  INDICE: {
    type: String
  },
  CATEGORIA: {
    type: String
  },
  FACULTAD: {
    type: String
  },
  CARRERA: {
    type: String
  },
  LUGAR: {
    type: String
  },
  ANIO: {
    type: String
  },
  TIPO: {
    type: String
  },
  PRECIO: {
    type: String
  },
  PAGINAS: {
    type: String
  },
  ESTADO: {
    type: String
  },
  NOTAS: {
    type: String
  },
  AUTOR_AUX: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
