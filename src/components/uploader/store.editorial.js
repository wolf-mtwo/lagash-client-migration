"use strict";

import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
// import { Articulo } from '../collections/models/articulo';
// import { AutorLibro } from '../collections/models/autor.libro';
// import { AutorTesis } from '../collections/models/autor.tesis';
// import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
// import { Libro } from '../collections/models/libro';
// import { Revista } from '../collections/models/revista';
// import { Tesis } from '../collections/models/tesis';

export class StoreEditorial {

  constructor() {
    this.date = new Date();
    this.logger = log4js.getLogger('store-editorial');
  }

  start() {
    // this.editorial = { start: 0, end: 100, model: new Editorial() };
    this.editorial = { start: 0, end: 42000, model: new Editorial() };
    this.store();
  }

  async store() {
    if (this.editorial.start >= this.editorial.end) {
      return;
    }
    let item = await this.editorial.model.find_one({ ID_EDIT: this.editorial.start++ })
    this.logger.debug('editorial', this.editorial.start, '-', item ? item._id : null);
    if (!item) {
      this.store_next();
      return;
    }
    let editorial = await this.save(item);
    this.logger.info('editorial', editorial.name);
    this.store_next();
  }

  store_next() {
    setTimeout(() => {
      this.store();
    }, 0);
  }

  save(record) {
    let item = {
      '_id': item._id,
      // '_id': uuidv4(),
      'name': this.update_string(record.NOMBRE),
      'city': this.update_string(record.CIUDAD),
      'country': this.update_string(record.PAIS)
    };
    return this.save_editorial(item)
    .then((res) => {
      return res.body;
    });
  }

  update_string(text) {
    if (!text) {
      return '';
    }
    return text === 'NULL' || text === 'null' ? '' : text;
  }

  save_editorial(item) {
    return request
    .post('http://localhost:5570/v1/editorials')
    .set('x-access-token', [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
      'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
      'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
      'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
    ].join(''))
    .send(item);
  }
}
