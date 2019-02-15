import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';

export class Store {

  store_next() {
    setTimeout(() => {
      this.store();
    }, 0);
  }

  update_string(text) {
    if (!text) {
      return '';
    }
    return text === 'NULL' || text === 'null' ? '' : text;
  }

  update_int(num) {
    if (!num) {
      return 0;
    }
    if (num === '0' || num === '' || num === 'null') {
      return 0;
    }
    let aux = parseInt(num);
    if (isNaN(aux)) {
       return 0;
    }
    return aux;
  }

  update_year(num) {
    if (!num) {
      return 0;
    }
    if (num === '0' || num === '' || num === 'null') {
      return 0;
    }
    let aux = parseInt(num);
    if (isNaN(aux)) {
       return 0;
    }
    return aux;
  }

  store_record(item) {
    return request
    .post(this.get_URL())
    .set('x-access-token', [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
      'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
      'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
      'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
    ].join(''))
    .send(item);
  }

  get_base_url() {
    return 'http://localhost:5570';
  }

  get_URL(item) {
    return this.get_base_url() + this.URI;
  }

  // save_editorial(item) {
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
}
