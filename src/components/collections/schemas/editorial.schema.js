import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('Editorial', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_EDIT: {
    type: Number
  },
  NOMBRE: {
    type: String
  },
  PAIS: {
    type: String
  },
  CIUDAD: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
