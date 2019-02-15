import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { Store } from './store';
import { Libro } from '../collections/models/libro';
import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
import { AutorLibro } from '../collections/models/autor.libro';

export class Autor extends Store {

  constructor() {
    super();
    this.URI = `/v1/authors`;
    this.logger = log4js.getLogger('autor');
  }

  start() {
    this.autor = { start: 0, end: 0, model: new Autor() };
    this.store();
  }

  async store() {
    if (this.autor.start >= this.autor.end) {
      return;
    }
    let item = await this.autor.model.find_one({ ID_EDIT: this.autor.start++ })
    this.logger.debug('autor', this.autor.start, '-', item ? item._id : null);
    if (!item) {
      this.store_next();
      return;
    }
    let autor = await this.save(item);
    this.logger.info('autor', autor.first_name);
    this.store_next();
  }

  store_next() {
    setTimeout(() => {
      this.store();
    }, 0);
  }

  save(record) {
    var item = {
      '_id': uuidv4(),
      // '_id': item._id,
      'first_name': this.update_string(record.NOMBRE),
      'last_name': this.update_string(record.APELLIDOS),
      'country': this.update_string(record.NACIONALIDAD)
    };
    return this.store_record(item)
    .then((res) => {
      return res.body;
    });
  }
}
