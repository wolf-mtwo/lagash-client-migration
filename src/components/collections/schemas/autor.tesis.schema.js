import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('AutorTesis', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_autor: {
    type: Number
  },
  id_tesis: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
