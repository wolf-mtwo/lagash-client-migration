import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Articulo', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_ARTICULO: {
    type: Number
  },
  ID_REVISTA: {
    type: Number
  },
  TITULO: {
    type: String
  },
  // PAGINA: {
  //   type: Number
  // },
  PAGINA: {
    type: String
  },
  AUTOR: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
