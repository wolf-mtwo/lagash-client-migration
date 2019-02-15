import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';

import { MapStoreAutor } from './map.store.autor';
import { MapStoreEditorial } from './map.store.editorial';
import { StoreBook } from './store.book';

export class Uploader {

  constructor() {
    this.storeAutor = new MapStoreAutor();
    this.storeEditorial = new MapStoreEditorial();
    this.storeBook = new StoreBook();
    this.isEmpty = false;
  }

  start() {
    this.logger = log4js.getLogger('uploader');
    this.store();
  }

  store() {
    this.logger.info('start book');
    this.storeBook.start(this.isEmpty);
    // this.logger.info('start autor');
    // this.storeAutor.start(this.isEmpty);
    // this.logger.info('start editorial');
    // this.storeEditorial.start(this.isEmpty);
  }
}
