import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Editorial', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  id_edit: {
    type: Number
  },
  nombre: {
    type: String
  },
  pais: {
    type: String
  },
  ciudad: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
