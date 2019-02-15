import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { Store } from './store';
import { Libro } from '../collections/models/libro';
import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
import { AutorLibro } from '../collections/models/autor.libro';

export class StoreBook extends Store {

  constructor() {
    super();
    this.URI = `/v1/books`;
    this.logger = log4js.getLogger('store-book');
  }

  start() {
    // this.libro = { start: 0, end: 100, model: new Libro() };
    this.libro = { start: 0, end: 36895, model: new Libro() };
    this.autorLibro = { start: 0, end: 0, model: new AutorLibro() };
    this.editorial = { start: 0, end: 0, model: new Editorial() };
    this.autor = { start: 0, end: 0, model: new Autor() };
    this.store();
  }

  async store() {
    // var item = this.items.shift();
    if (this.libro.start >= this.libro.end) {
      return;
    }
    let item = await this.libro.model.find_one({ ID_LIBRO: this.libro.start++ })
    this.logger.debug('book', this.libro.start, '-' , item ? item._id : null);
    if (!item) {
      this.store_next();
      return;
    }

    let editorial = await this.editorial.model.find_one({ID_EDIT: item.ID_EDIT });
    let autor_map = await this.autorLibro.model.query({ID_LIBRO: item.ID_LIBRO });
    let autors = [];
    for (const map of autor_map) {
        autors.push(await this.autor.model.find_one({ID_AUTOR: map.ID_AUTOR }));
    }
    // console.log(editorial);
    // console.log(autors);
    // console.log(item);
    try {
      let record = await this.save(item, editorial);
      this.logger.info('book', record.title);
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
      '_id': uuidv4(),
      // 'code': this.update_string(record.COD_LIB) + uuidv4(),
      // '_id': item._id,
      'code': this.update_string(record.COD_LIB),
      'enabled': true,
      // : this.update_string(record.ID_LIBRO),
      // : this.update_string(record.ID_GENERIC),
      // 'editorial_id': this.update_string(record.ID_EDIT),
      // : this.update_string(record.COD_AUTOR),
      'title': this.update_string(record.TITULO),
      'tags': this.update_string(record.DESCRIPTORES),
      'index': this.update_string(record.INDICE),
      // : this.update_string(record.VOLUMEN),
      // : this.update_string(record.TOMO),
      // : this.update_string(record.EJEMPLAR),
      'type': '',
      'pages': this.update_int(record.PAGINAS),
      'year': this.update_year(record.ANIO),
      // : this.update_string(record.EDICION),
      'isbn': this.update_string(record.ISBN),
      'brings': this.update_string(record.INCLUYE),
      'cover': this.update_string(record.TIPO),
      'illustrations': this.update_string(record.ILUSTRACION),
      'high': this.update_int(record.TAM),
      'width': 0,
      'price': this.update_int(record.PRECIO),
      // : this.update_string(record.ESTADO),
      // : this.update_string(record.NOTAS),
      // : this.update_string(record.AUTOR_AUX),
      catalog_id: null,
      editorial_id: null,
      image: null
    };
    return this.store_record(item)
    .then((res) => {
      return res.body;
    });
  }

  // update_string(text) {
  //   if (!text) {
  //     return '';
  //   }
  //   return text === 'NULL' || text === 'null' ? '' : text;
  // }


}
