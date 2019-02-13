import fs from 'fs';
import glob from 'glob';
import log4js from 'log4js';
import uuidv4 from 'uuid/v4';
import readline from 'readline';
import request from 'superagent';
import { Articulo } from '../collections/models/articulo';
import { AutorLibro } from '../collections/models/autor.libro';
import { AutorTesis } from '../collections/models/autor.tesis';
import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
import { Libro } from '../collections/models/libro';
import { Revista } from '../collections/models/revista';
import { Tesis } from '../collections/models/tesis';
import xml2js from 'xml2js';
var parser = new xml2js.Parser();

export class Loader {

  constructor() {
    this.logger = log4js.getLogger('loader');
    this.items = [];
    this.conflicts = [];
  }

  start(dirname) {
    this.config = [
      // { file: 'ARTICULO.txt', collection: 'Articulo', model: new Articulo() },
      // { file: 'AUTOR_LIBRO.txt', collection: 'AutorLibro', model: new AutorLibro() },
      // { file: 'AUTOR_TESIS.txt', collection: 'AutorTesis', model: new AutorTesis() },
      // { file: 'AUTOR.txt', collection: 'Autor', model: new Autor() },
      // { file: 'EDITORIAL.txt', collection: 'Editorial', model: new Editorial() },
      { file: 'LIBRO.xml', collection: 'Libro', model: new Libro() },
      // { file: 'REVISTA.txt', collection: 'Revista', model: new Revista() },
      // { file: 'TESIS.txt', collection: 'Tesis', model: new Tesis() }
    ];
    this.run(dirname);
  }

  run(dirname) {
    fs.readFile(dirname + '/../data/' + 'LIBRO.xml', function(err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(result.main.DATA_RECORD[29317]);
            // console.dir(result.main.DATA_RECORD[1]);
            console.log('Done');
        });
    });

    // var item = this.config.shift();
    // if (!item) {
    //   this.store();
    //   return;
    // }
    //
    // var rd = readline.createInterface({
    //   // input: fs.createReadStream(route)
    //   // input: fs.createReadStream(route, { encoding: 'utf-8' })
    //   input: fs.createReadStream(dirname + '/../data/' + item.file)
    //   // output: process.stdout,
    //   // console: false
    // });
    // var stage = [];
    // rd.on('line', (line) => {
    //   let row = {
    //     config: item,
    //     data: line.split('\\')
    //   };
    //   // if (row.config.collection === 'Libro' && row.data.length < 24) {
    //   //   console.log('1');
    //   //   // if (line.substring(line.length() - 1) === '\\') {
    //   //   //   stage.push();
    //   //   //   this.items.push();
    //   //   // }
    //   //   // return;
    //   // }
    //   this.items.push(row);
    // });
    // rd.on('close', () => {
    //   this.run();
    // });
  }

  store() {
    var item = this.items.shift();
    if (!item) {
      return;
    }
    // console.log(item);
    // console.log(item.data[0], item.data.length);
    item.config.model.create(this.model_factory(item))
    .then((item) => {
      setTimeout(() => {
        this.store();
      }, 0);
    })
    .catch((err) => {
      this.logger.error('cant create', item, err);
    });
  }

  model_factory(item) {
    switch (item.config.collection) {
      case 'Articulo':
        return {
           id_articulo: item.data[0],
           id_revista: item.data[1],
           titulo: item.data[2],
           paginas: item.data[3].trim() === 'NULL' || item.data[3].trim() === 'null' ? 0 : item.data[3],
           autor: item.data[4]
        };
      case 'AutorLibro':
        return {
           id_autor: item.data[0],
           id_libro: item.data[1]
        };
      case 'AutorTesis':
        return {
           id_autor: item.data[0],
           id_tesis: item.data[1]
        };
      case 'Autor':
        return {
           id_autor: item.data[0],
           nombre: item.data[1],
           apellidos: item.data[2],
           nacionalidad: item.data[3]
        };
      case 'Editorial':
        return {
           id_edit: item.data[0],
           nombre: item.data[1],
           pais: item.data[2],
           ciudad: item.data[3]
        };
      case 'Libro':
        return {
           id_libro: item.data[0],
           id_generic: item.data[1],
           id_edit: item.data[2],
           cod_lib: item.data[3],
           cod_autor: item.data[4],
           titulo: item.data[5],
           descriptores: item.data[6],
           indice: item.data[7],
           volumen: item.data[8],
           tomo: item.data[9],
           ejemplar: item.data[10],
           paginas: item.data[11],
           anio: item.data[12],
           edicion: item.data[13],
           isbn: item.data[14],
           incluye: item.data[15],
           tipo: item.data[16],
           ilustracion: item.data[17],
           tam: item.data[18],
           precio: item.data[19],
           estado: item.data[20],
           notas: item.data[21],
           autor_aux: item.data[22]
        };
      case 'Revista':
        return {
           id_revista: item.data[0],
           id_generic: item.data[1],
           cod_revista: item.data[2],
           sub_titulo: item.data[3],
           autor_institucional: item.data[4],
           periodicidad: item.data[5],
           descriptores: item.data[6],
           numero: item.data[7],
           volumen: item.data[8],
           ejemplar: item.data[9],
           incluye: item.data[10],
           ilustracion: item.data[11],
           precio: item.data[12],
           estado: item.data[13],
           autor_aux: item.data[14]
        };
      case 'Tesis':
        return {
           id_tesis: item.data[0],
           id_generic: item.data[1],
           id_edit: item.data[2],
           cod_tesis: item.data[3],
           cod_autor: item.data[4],
           titulo: item.data[5],
           autor_institucional: item.data[6],
           tutor: item.data[7],
           descriptores: item.data[8],
           indice: item.data[9],
           categoria: item.data[10],
           facultad: item.data[11],
           carrera: item.data[12],
           lugar: item.data[13],
           anio: item.data[14],
           tipo: item.data[15],
           precio: item.data[16],
           paginas: item.data[17],
           estado: item.data[18],
           notas: item.data[19],
           autor_aux: item.data[20]
        };
      default:
        this.logger.error(`collection ${item.config.collection} does no exist`);
    }
  }
}
