import request from 'superagent';
import cheerio from 'cheerio';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';

function string_transcoder(target) {
  this.encodeList = encodings[target];
  if (this.encodeList === undefined) {
    return undefined;
  }

  //Initialize the easy encodings
  if (target === "windows-1252") {
    var i;
    for (i = 0x0; i <= 0x7F; i++) {
      this.encodeList[i] = i;
    }
    for (i = 0xA0; i <= 0xFF; i++) {
      this.encodeList[i] = i;
    }
  }
}

string_transcoder.prototype.transcode = function(inString) {
  var res = new Uint8Array(inString.length), i;
  for (i = 0; i < inString.length; i++) {
    var temp = inString.charCodeAt(i);
    var tempEncode = (this.encodeList)[temp];
    if (tempEncode === undefined) {
      return undefined; //This encoding is messed up
    } else {
      res[i] = tempEncode;
    }
  }
  return res;
};

var encodings = {
  "windows-1252": {
    0x20AC:0x80,
    0x201A:0x82,
    0x0192:0x83,
    0x201E:0x84,
    0x2026:0x85,
    0x2020:0x86,
    0x2021:0x87,
    0x02C6:0x88,
    0x2030:0x89,
    0x0160:0x8A,
    0x2039:0x8B,
    0x0152:0x8C,
    0x017D:0x8E,
    0x2018:0x91,
    0x2019:0x92,
    0x201C:0x93,
    0x201D:0x94,
    0x2022:0x95,
    0x2013:0x96,
    0x2014:0x97,
    0x02DC:0x98,
    0x2122:0x99,
    0x0161:0x9A,
    0x203A:0x9B,
    0x0153:0x9C,
    0x017E:0x9E,
    0x0178:0x9F
  }
};

var WINDOWS_1252 = '\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\b\t\n\u000b\f\r\u000e\u000f\u0010\u0011\u0012\u0013\u0014\u0015\u0016\u0017\u0018\u0019\u001a\u001b\u001c\u001d\u001e\u001f !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~€�‚ƒ„…†‡ˆ‰Š‹Œ�Ž��‘’“”•–—˜™š›œ�žŸ ¡¢£¤¥¦§¨©ª«¬­®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ';
function fromWindows1252(binaryString) {
  var text = '';
  for (var i = 0; i < binaryString.length; i++) {
    text += WINDOWS_1252.charAt(binaryString.charCodeAt(i));
  }
  return text;
}

export class Monitor {

  constructor(start, end) {
    // this.symbols = symbol.list;
    // this.data = [];
    this.start = start;
    this.end = end;
    this.items = [];
    for (var i = start; i <= end; i++) {
      this.items.push(i);
    }
    this.logger = log4js.getLogger('monitor');
  }

  play() {
    this.show_header();
    this.run();
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

  caculate(symbol, enterprise, market) {
    let ent = enterprise.value.substring(0, enterprise.value.length - 1);
    let mark = market.value.substring(0, market.value.length - 1);
    ent = parseFloat(ent);
    mark = parseFloat(mark);
    //ent 100
    //mark x
    let porcent = ((mark * 100) / ent);
    let url = this.get_symbol(symbol);
    let info = {
      symbol,
      ent,
      mark,
      porcent,
      url
    };
    this.data.push(info);
    this.print(info);
  }

  PadLeft(value, length) {
    return (value.toString().length < length) ? this.PadLeft(' ' + value, length) :
    value;
  }

  show_report() {
    this.show_header();
    this.data.sort((a, b) => {
      if (b.porcent > a.porcent) {
        return b.porcent;
      }
    });
    this.data.forEach((info) => {
      this.print(info);
    });
  }

  show_header() {
    console.log(`${this.PadLeft('SYMBOL', 6)} ${this.PadLeft('INTERPRICE', 10)} ${this.PadLeft('MARKET', 10)} ${this.PadLeft('%', 10)}`);
  }

  print(info) {
    console.log(`${this.PadLeft(info.symbol, 6)} ${this.PadLeft(info.ent, 10)} ${this.PadLeft(info.mark, 10)} ${this.PadLeft(info.porcent.toFixed(2), 10)}   ${info.url}`);
  }

  loadBulk(item) {
    return request
    .get(this.get_URL(item))
    .set('Accept', 'text/html')
    .send();
  }

  saveBulk(item) {
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

  saveAuthor(item) {
    return request
    .post('http://localhost:5570/v1/authors')
    .set('x-access-token', [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
      'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
      'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
      'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
    ].join(''))
    .send(item);
  }

  saveMap(item) {
    return request
    .post('http://localhost:5570/v1/author-map')
    .set('x-access-token', [
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.',
      'eyJfaWQiOiIyMDAxMjk4Yy1iNDYzLTQ3Y2MtYj',
      'Q4OS1hNjRhMjdlYzcyZjUiLCJlbWFpbCI6Indvb',
      'GZAd29sZi5jb20ifQ.3xTC4bceez_LzH7NOUtG3BEpGhIek8Ixf4QvYhAuzYk'
    ].join(''))
    .send(item);
  }

  saveEditorial(item) {
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

  get_URL(item) {
    return `http://finanzas.uab.edu.bo:9095/biblioteca/buscarLibro/detallesLibro.jsp?marcador=&codigo=${item}`;
  }

  set_URL(item) {
    return `http://localhost:5570/v1/books`;
  }

  collector(html) {
    // console.log(html.transcode('windows-1252'));
    // var string = TextDecoder("windows-1252").decode(html);
    // console.log(fromWindows1252(html));
    // console.log(unescape(encodeURIComponent(html)));
    // const $ = cheerio.load('<script type="text/javascript" charset="utf-8">' + html);
    // const $ = cheerio.load('<meta charset="Windows-1252">' + html);
    const $ = cheerio.load(fromWindows1252(html));
    var items = [];
    var config = {};
    var data = $('table[bgcolor=#3270b0]').find('tr');
    config.title = $(data[1]).find('font[color="#FFFF00"]').text();
    var authores = $(data[2]).find('font[color="#FFFF00"]').text();
    config.authores = authores.replace(/\n/gi, '').split('|').map((author) => {
      var value = author.split(',');
      return {
        last_name: value[0],
        first_name: value[1]
      };
    });
    var editorial = $(data[4]).find('td');
    config.editorial = {
      name: $(editorial[1]).text(),
      country: $(editorial[3]).text(),
      city: $(editorial[5]).text()
    };
    var tags = $(data[8]).find('font').text();
    tags = tags.replace(/\t/gi, '')
    .replace(/\n/gi, '')
    .replace(/\]\[/gi, '],[');
    config.tags = tags.split(',');
    var index = $(data[10]).find('font').text();
    config.index = index.replace(/\n/gi, '').split(',');
    return config;
  }
}
