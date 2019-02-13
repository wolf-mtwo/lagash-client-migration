import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Revista', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_REVISTA: {
    type: Number
  },
  ID_GENERIC: {
    type: Number
  },
  ID_EDIT: {
    type: Number
  },
  COD_REVISTA: {
    type: String
  },
  COD_AUTOR: {
    type: String
  },
  TITULO: {
    type: String
  },
  SUBTITULO: {
    type: String
  },
  AUTOR_INSTITUCIONAL: {
    type: String
  },
  EDITOR: {
    type: String
  },
  FECHA: {
    type: String
  },
  PERIODICIDAD: {
    type: String
  },
  DESCRIPTORES: {
    type: String
  },
  INDICE: {
    type: String
  },
  NUMERO: {
    type: String
  },
  VOLUMEN: {
    type: String
  },
  EJEMPLAR: {
    type: String
  },
  PAGINAS: {
    type: String
  },
  INCLUYE: {
    type: String
  },
  TIPO: {
    type: String
  },
  ILUSTRACION: {
    type: String
  },
  TAM: {
    type: String
  },
  PRECIO: {
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
