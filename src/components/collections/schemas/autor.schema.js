import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Autor', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_AUTOR: {
    type: Number
  },
  NOMBRE: {
    type: String
  },
  APELLIDOS: {
    type: String
  },
  NACIONALIDAD: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
