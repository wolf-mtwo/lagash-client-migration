import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Autor', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_autor: {
    type: Number
  },
  nombre: {
    type: String
  },
  apellidos: {
    type: String
  },
  nacionalidad: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
