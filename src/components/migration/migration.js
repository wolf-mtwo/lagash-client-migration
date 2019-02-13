import log4js from 'log4js';
import uuidv4 from 'uuid/v4';
import request from 'superagent';
import { Loader } from '../loader';
import { Uploader } from '../uploader';

export class Migration {

  constructor() {
    this.logger = log4js.getLogger('migration');
    this.loader = new Loader();
    this.uploader = new Uploader();
  }

  load(dirname) {
    this.loader.start(dirname);
  }

  upload(dirname) {
    this.uploader.start(dirname);
  }
}
