import request from 'superagent';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import { Store } from './store';
// import { Libro } from '../collections/models/libro';
import { Tesis } from '../collections/models/tesis';
import { Autor } from '../collections/models/autor';
import { Editorial } from '../collections/models/editorial';
// import { AutorLibro } from '../collections/models/autor.libro';
import { AutorTesis } from '../collections/models/autor.tesis';
//
import { MapEditorial } from '../collections/models/map.editorial';
import { MapAutor } from '../collections/models/map.autor';

export class StoreThesis extends Store {

  constructor() {
    super();
    this.uploader = null;
    this.isEmpty = null;
    this.count = 0;
    this.URI = `/v1/thesis`;
    this.logger = log4js.getLogger('store-tesis');
  }

  start(isEmpty, uploader) {
    this.uploader = uploader;
    this.isEmpty = isEmpty;
    this.tesis =  new Tesis();
    this.editorial = new Editorial();
    this.autor = new Autor();

    this.mapEditorial = new MapEditorial();
    this.autorTesis = new AutorTesis();
    this.mapAutor = new MapAutor();

    this.store();
  }

  store_helpers() {
    this.uploader.store_helpers();
  }

  async store() {
    let first_tesis = await this.tesis.find_one({});
    if (!first_tesis) {
      this.store_helpers();
      return;
    }
    this.logger.info('tesis start :',this.count++, '|', first_tesis.COD_LIB, first_tesis.COD_AUTOR, '-', first_tesis.TITULO);
    let autor_map = await this.autorTesis.query({ID_TESIS: first_tesis.ID_TESIS});
    let editorial = await this.editorial.find_one({ID_EDIT: first_tesis.ID_EDIT});
    let aux_editorial = await this.mapEditorial.query({ID_EDIT: editorial.ID_EDIT});
    if (aux_editorial.length <= 0) {
      await this.mapEditorial.create(editorial._doc);
    }
    let autors = [];
    for (const map of autor_map) {
        autors.push(await this.autor.find_one({ID_AUTOR: map.ID_AUTOR }));
    }

    for (const autor of autors) {
        let aux_autor = await this.mapAutor.query({ID_AUTOR: autor.ID_AUTOR});
        if (aux_autor.length <= 0) {
          await this.mapAutor.create(autor._doc);
        }
    }
    try {
      let tutor = null;
      if (first_tesis.TUTOR) {
        first_tesis.TUTOR = first_tesis.TUTOR.trim();
      }
      if (first_tesis.TUTOR) {
        let tutor_info = first_tesis.TUTOR.split(',');
        if (tutor_info.length == 2) {
        } else {
          tutor_info = first_tesis.TUTOR.split('.');
        }
        if (tutor_info.length == 2) {
        } else {
          let aux_tutor = first_tesis.TUTOR.split(' ');
          let last_name_aux = aux_tutor.shift();
          tutor_info = [last_name_aux, aux_tutor.join(' ')];
        }
        // console.log(tutor_info);
        tutor = {
          country: "bolivia",
          degree: "Lic.",
          first_name: tutor_info[1] || tutor_info[0],
          last_name: tutor_info[0],
          _id: uuidv4()
        };
        // console.log(tutor);
        this.logger.debug('tutor start :', first_tesis.TUTOR);
        await this.saveTutorMap(tutor);
        this.logger.debug('tutor end   :', tutor._id, tutor.last_name, tutor.first_name);
      }

      let record = await this.save(first_tesis, editorial, tutor);
      try {
        for (const autor of autors) {
          this.logger.debug('autor start :', autor._id, autor.NOMBRE);
          await this.saveAutorMap({
            author_id: autor._id,
            material_id: record._id,
            type: 'THESIS',
            _id: uuidv4()
          });
          this.logger.debug('autor end   :', autor._id, autor.NOMBRE);
        }
      } catch (e) {
        console.log('ERROR DEBUG AUTOR');
        this.logger.error(e.response ? e.response.body: e);
      }
      try {
        this.logger.debug('ejemplar start :', first_tesis.COD_TESIS, first_tesis.COD_AUTOR, '-', first_tesis.TITULO);
        var ejemplar = {
          material_id: record._id,
          enabled: true,
          inventory: this.isEmpty ? first_tesis.ID_TESIS : Math.floor(Math.random() * 2000000),
          order: 1,
          state: 'STORED',
          _id: uuidv4()
        };
        await this.saveEjemplarMap(ejemplar, record._id);
        this.logger.debug('ejemplar end   :', first_tesis.COD_TESIS, first_tesis.COD_AUTOR, '-', first_tesis.TITULO);
      } catch (e) {
        console.log('ERROR DEBUG');
        this.logger.error(e.response ? e.response.body: e);
      }

      await this.tesis.remove(first_tesis);
      this.store_next();
    } catch (e) {
      this.logger.error(e.response ? e.response.body: e);
    }
  }

  save(record, editorial, tutor) {
    var item = {
      '_id': this.isEmpty ? record._id : uuidv4(),
      'title': this.update_string(record.TITULO),
      // 'code_author': this.update_string(record.COD_AUTOR) ? this.update_string(record.COD_AUTOR) : 'null',
      'code_material': this.update_string(record.COD_TESIS),
      'code_author': this.update_string(record.COD_AUTOR),
      'tags': this.update_string(record.DESCRIPTORES),
      editorial_id: editorial._id,
      catalog_id: null,
      image: null,
      'enabled': true,
      'year': this.update_year(record.ANIO),
      tutor_id: tutor ? tutor._id : null,
      carrera_id: null,
      faculty_id: null,
      'cover': this.update_cover(record.TIPO),
      // 'illustrations': this.update_illustration(record.ILUSTRACION),
      // 'high': this.update_int(record.TAM),
      // 'width': 0,
      'pages': this.update_int(record.PAGINAS),
      'price': this.update_int(record.PRECIO),
      // 'brings': this.update_brings(record.INCLUYE),
      'index': this.update_string(record.INDICE)
    };
    return this.store_record(item)
    .then((res) => {
      return res.body;
    });
  }

  saveTutorMap(item) {
    return request
    .post(this.get_base_url() + '/v1/tutors')
    .send(item);
  }

  saveAutorMap(item) {
    return request
    .post(this.get_base_url() + '/v1/author-map')
    .send(item);
  }

  saveEjemplarMap(item, book_id) {
    return request
    .post(this.get_base_url() + `/v2/thesis/${book_id}/ejemplares`)
    .send(item);
  }
}
