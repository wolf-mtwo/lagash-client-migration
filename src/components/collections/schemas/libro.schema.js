import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Libro', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_LIBRO: {
   type: Number
  },
  ID_GENERIC: {
   type: Number
  },
  ID_EDIT: {
   type: Number
  },
  COD_LIB: {
   type: String
  },
  COD_AUTOR: {
   type: String
  },
  TITULO: {
   type: String
  },
  DESCRIPTORES: {
   type: String
  },
  INDICE: {
   type: String
  },
  VOLUMEN: {
   type: String
  },
  TOMO: {
   type: String
  },
  EJEMPLAR: {
   type: String
  },
  PAGINAS: {
   type: String
  },
  ANIO: {
   type: String
  },
  EDICION: {
    type: String
  },
  ISBN: {
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
