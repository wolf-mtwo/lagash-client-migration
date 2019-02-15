import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { MapEditorial } from '../collections/models/map.editorial';

export class MapStoreEditorial {

  constructor() {
    this.isEmpty = null;
    this.logger = log4js.getLogger('store-editorial');
  }

  start(isEmpty) {
    this.isEmpty = isEmpty;
    this.editorial = { start: 0, end: 100, model: new MapEditorial() };
    // this.editorial = { start: 0, end: 42000, model: new Editorial() };
    this.store();
  }

  async store() {
    let item = await this.editorial.model.find_one({})
    if (!item) {
      this.logger.debug('end storing all editorial');
      return;
    }
    this.logger.debug('start editorial', this.editorial.start, '-', item ? item._id : null);
    try {
      let editorial = await this.save(item);
      this.logger.info('end editorial', editorial.name);
      await this.editorial.model.remove(item);
      this.store_next();
    } catch (e) {
      console.log(e.response.body);
    }
  }

  store_next() {
    setTimeout(() => {
      this.store();
    }, 0);
  }

  save(record) {
    let item = {
      '_id': this.isEmpty ? record._id : uuidv4(),
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
