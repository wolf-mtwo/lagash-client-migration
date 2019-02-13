import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Articulo', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_articulo: {
    type: Number
  },
  id_revista: {
    type: Number
  },
  titulo: {
    type: String
  },
  paginas: {
    type: Number
  },
  autor: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
