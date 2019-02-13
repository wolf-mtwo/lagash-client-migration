import mongoose from 'mongoose';
import uuid from 'uuid/v1';

var Schema = mongoose.Schema;

mongoose.model('AutorLibro', new Schema({
  _id: {
    type: String,
    default: () => { return uuid(); }
  },
  ID_AUTOR: {
    type: Number
  },
  ID_LIBRO: {
    type: Number
  },
  created: {
    type: Date,
    default: Date.now
  }
}));
