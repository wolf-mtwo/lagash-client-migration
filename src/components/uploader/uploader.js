"use strict";

import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { Articulo } from '../collections/models/articulo';
import { AutorLibro } from '../collections/models/autor.libro';
import { AutorTesis } from '../collections/models/autor.tesis';
import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
import { Libro } from '../collections/models/libro';
import { Revista } from '../collections/models/revista';
import { Tesis } from '../collections/models/tesis';

import { StoreEditorial } from './store.editorial';

export class Uploader {

  constructor() {
    this.storeEditorial = new StoreEditorial();
  }

  start() {
    this.logger = log4js.getLogger('uploader');
    this.articulo = { start: 0, end: 100, model: new Articulo() };
    this.autorLibro = { start: 0, end: 100, model: new AutorLibro() };
    this.autorTesis = { start: 0, end: 100, model: new AutorTesis() };
    this.autor = { start: 0, end: 100, model: new Autor() };
    this.editorial = { start: 0, end: 100, model: new Editorial() };
    this.revista = { start: 0, end: 100, model: new Revista() };
    this.Tesis = { start: 0, end: 100, model: new Tesis() };
    this.libro = { start: 0, end: 100, model: new Libro() };
    // this.run(dirname);

    // console.log(this.libro.model.find_one({ ID_LIBRO: this.libro.start++ }));
    // this.store();
    this.storeEditorial.start();
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
    console.log(editorial);
    console.log(autors);
    console.log(item);
  }

  store_next() {
    setTimeout(() => {
      this.store();
    }, 0);
  }

  run() {
    this.logger = log4js.getLogger('guardando.....');
    let item = this.items.shift();
    if (!item) {
      // this.show_report();
      return;
    }
    return this.loadBulk(item)
    .then((res) => {
      return this.collector(res.text);
    })
    .then((data) => {
      let bookOrigin = null;
      let editorial = {
        "_id": uuidv4(),
        "name": data.editorial.name,
        "city": data.editorial.city,
        "country": data.editorial.country
      };
      return this.saveEditorial(editorial)
      .then((editorial) => {
        editorial = editorial.body;
        var item = {
          "_id": uuidv4(),
          "code": [
            'ZZZ',
            uuidv4().substring(0, 3),
            uuidv4().substring(0, 3)
          ].join('.'),
          "enabled": true,
          "tags": data.tags.join(','),
          "type": null,
          "cover": null,
          "length": Math.floor((Math.random() * 100) + 1),
          "width": Math.floor((Math.random() * 100) + 1),
          "pages": Math.floor((Math.random() * 1000) + 1),
          "price": Math.floor((Math.random() * 500) + 1),
          "illustrations": null,
          "brings": null,
          "year": 2018,
          "editorial_id": editorial._id,
          "title": data.title,
          "isbn": Math.floor((Math.random() * 1000000) + 1),
          "index": data.index.join('\n')
        };
        return this.saveBulk(item);
      })
      .then((book) => {
        bookOrigin = book.body;
        this.logger.info('Se guardo el libro:', data.title);
        let authores = data.authores.map((author) => {
          return {
            "_id": uuidv4(),
            "country": "bolivia",
            "code": uuidv4().substring(0, 6),
            "first_name": author.first_name,
            "last_name": author.last_name
          };
        });
        return Promise.all(authores.map((author) => {
          return this.saveAuthor(author);
        }));
      })
      .then((result) => {
        this.logger.info('Se guardaron los authores:', JSON.stringify(data.authores));
        return Promise.all(result.map((author) => {
          author = author.body;
          return this.saveMap({
            author_id: author._id,
            resource_id: bookOrigin._id,
            type: "BOOK",
            _id: uuidv4()
          }).
          catch((err) => {
            console.log(err.error);
          });
        }));
      })
      .then((result) => {
        this.logger.info('El libro se guardo correctamente');
      });
    })
    .then((result) => {
      this.run();
    })
    .catch((err) => {
      console.log(err.message);
      this.run();
    });
  }


  store_book(item) {
    return request
    .post(this.set_URL())
    .set('x-access-token', [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
      'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
      'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
      'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
    ].join(''))
    .send(item);
  }

  // saveAuthor(item) {
  //   return request
  //   .post('http://localhost:5570/v1/authors')
  //   .set('x-access-token', [
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
  //     'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
  //     'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
  //     'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
  //   ].join(''))
  //   .send(item);
  // }

  // saveMap(item) {
  //   return request
  //   .post('http://localhost:5570/v1/author-map')
  //   .set('x-access-token', [
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
  //     'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
  //     'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
  //     'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
  //   ].join(''))
  //   .send(item);
  // }
  //
  // saveEditorial(item) {
  //   return request
  //   .post('http://localhost:5570/v1/editorials')
  //   .set('x-access-token', [
  //     'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
  //     'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
  //     'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
  //     'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
  //   ].join(''))
  //   .send(item);
  // }
  //
  // get_URL(item) {
  //   return `http://finanzas.uab.edu.bo:9095/biblioteca/buscarLibro/detallesLibro.jsp?marcador=&codigo=${item}`;
  // }

  set_URL(item) {
    return `http://localhost:5570/v1/books`;
  }
}
