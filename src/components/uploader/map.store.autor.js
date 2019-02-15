import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { Store } from './store';
import { Libro } from '../collections/models/libro';
import { MapAutor } from '../collections/models/map.autor';
import { Editorial } from '../collections/models/editorial';
import { AutorLibro } from '../collections/models/autor.libro';

export class MapStoreAutor extends Store {

  constructor() {
    super();
    this.isEmpty = null;
    this.URI = `/v1/authors`;
    this.logger = log4js.getLogger('autor');
  }

  start(isEmpty) {
    this.isEmpty = isEmpty;
    this.autor = { start: 0, end: 100, model: new MapAutor() };
    this.store();
  }

  async store() {
    let item = await this.autor.model.find_one({})
    if (!item) {
      this.logger.debug('end storing all autor');
      return;
    }
    this.logger.debug('start autor', this.autor.start, '-', item ? item._id : null);
    try {
      let autor = await this.save(item);
      this.logger.info('end autor', autor.first_name);
      await this.autor.model.remove(item);
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
    var item = {
      '_id': this.isEmpty ? record._id : uuidv4(),
      'code': '',
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
