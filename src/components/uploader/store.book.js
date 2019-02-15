import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { Store } from './store';
import { Libro } from '../collections/models/libro';
import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
import { AutorLibro } from '../collections/models/autor.libro';

import { MapEditorial } from '../collections/models/map.editorial';
import { MapAutor } from '../collections/models/map.autor';

export class StoreBook extends Store {

  constructor() {
    super();
    this.isEmpty = null;
    this.URI = `/v1/books`;
    this.logger = log4js.getLogger('store-book');
  }

  start(isEmpty) {
    this.isEmpty = isEmpty;
    this.libro = { start: 0, end: 10, model: new Libro() };
    // this.libro = { start: 0, end: 36895, model: new Libro() };
    this.autorLibro = { start: 0, end: 0, model: new AutorLibro() };
    this.editorial = { start: 0, end: 0, model: new Editorial() };
    this.autor = { start: 0, end: 0, model: new Autor() };

    this.mapEditorial = new MapEditorial();
    this.mapAutor = new MapAutor();
    this.store();
  }

  async store() {
    if (this.libro.start >= this.libro.end) {
      return;
    }
    this.libro.start++;
    let first_book = await this.libro.model.find_one({});
    if (!first_book) {
      this.store_next();
      return;
    }
    let items = await this.libro.model.query({
      COD_LIB: first_book.COD_LIB,
      COD_AUTOR: first_book.COD_AUTOR
    });
    console.log(items);
    this.logger.debug('start book', this.libro.start, '-' , first_book.TITULO);
    let editorial = await this.editorial.model.find_one({ID_EDIT: first_book.ID_EDIT});
    let autor_map = await this.autorLibro.model.query({ID_LIBRO: first_book.ID_LIBRO});
    let aux_editorial = await this.mapEditorial.query({ID_EDIT: editorial.ID_EDIT});
    if (aux_editorial.length <= 0) {
      await this.mapEditorial.create(editorial._doc);
    }
    let autors = [];
    for (const map of autor_map) {
        autors.push(await this.autor.model.find_one({ID_AUTOR: map.ID_AUTOR }));
    }
    for (const autor of autors) {
        let aux_autor = await this.mapAutor.query({ID_AUTOR: autor.ID_AUTOR});
        if (aux_autor.length <= 0) {
          await this.mapAutor.create(autor._doc);
        }
    }
    try {
      let record = await this.save(first_book, editorial, autor_map);
      for (const autor of autors) {
        this.logger.info('autor start', autor.NOMBRE);
        await this.saveAutorMap({
          author_id: autor._id,
          resource_id: record._id,
          type: 'BOOK',
          _id: uuidv4()
        });
        this.logger.info('autor end', autor.NOMBRE);
      }
      for (const aux_item of items) {
        this.logger.info('ejemplar start', aux_item.TITULO);
        await this.saveEjemplarMap({
          code: this.update_string(aux_item.COD_LIB),
          code_item: this.update_string(aux_item.COD_LIB),
          code_author: this.update_string(aux_item.COD_AUTOR),
          data_id: record._id,
          enabled: true,
          // inventory: aux_item.ID_LIBRO,
          inventory: this.isEmpty ? aux_item.ID_LIBRO : Math.floor(Math.random() * 2000000),
          order: this.update_string(aux_item.EJEMPLAR),
          state: "STORED",
          _id: uuidv4()
        }, record._id);
        this.logger.info('ejemplar end', aux_item.TITULO);
      }
      for (const aux_item of items) {
        await this.libro.model.remove(aux_item);
      }
    } catch (e) {
      this.logger.error(e.response ? e.response.body: e);
    }
  }

  save(record, editorial, autor_map) {
    var item = {
      // '_id': uuidv4(),
      '_id': this.isEmpty ? record._id : uuidv4(),
      // 'code': this.update_string(record.COD_LIB) + uuidv4(),
      // '_id': item._id,
      'code_item': this.update_string(record.COD_LIB),
      'code_author': this.update_string(record.COD_AUTOR),
      'enabled': true,
      // : this.update_string(record.ID_LIBRO),
      // : this.update_string(record.ID_GENERIC),
      // 'editorial_id': this.update_string(record.ID_EDIT),
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
      editorial_id: editorial._id,
      image: null
    };
    return this.store_record(item)
    .then((res) => {
      return res.body;
    });
  }

  saveAutorMap(item) {
    return request
    .post(this.get_base_url() + '/v1/author-map')
    .send(item);
  }

  saveEjemplarMap(item, book_id) {
    return request
    .post(this.get_base_url() + `/v2/books/${book_id}/ejemplares`)
    .send(item);
  }
}
