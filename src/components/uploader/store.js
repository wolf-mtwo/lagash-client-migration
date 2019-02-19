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

  update_cover(text) {
    if (!text) {
      return 'others';
    }
    if (text === 'Empastado') {
      return 'empastado';
    }
    if (text === 'Rústico') {
      return 'rustic';
    }
    if (text === 'Anillado') {
      return 'ringed';
    }
    console.log(text);
    throw new Error('update_cover error', text);
  }

  update_illustration(text) {
    console.log(text);
    if (!text || text == ' ') {
      return 'others';
    }
    var items = [];
    // text.includes('Cdros')
    if (
      text.includes('Cdros') ||
      text.includes('crds') ||
      text.includes('cdr') ||
      text.includes('Cdrs') ||
      text.includes('cdros') ||
      text.includes('square') ||
      text.includes('Cuadros') ||
      text.includes('chart') ||
      text.includes('cdrs') ||
      text.includes('cuadrs')
    ) {
        items.push('square');
    }
    if (
      text.includes('gráficos') ||
      text.includes('grficos') ||
      text.includes('grafcs') ||
      text.includes('grfs') ||
      text.includes('grfcs') ||
      text.includes('graf') ||
      text.includes('graficos') ||
      text.includes('grafs') ||
      text.includes('grafs')
    ) {
        items.push('chart');
    }
    if (
      text.includes('ftos') ||
      text.includes('fts') ||
      text.includes('fots') ||
      text.includes('Ftos') ||
      text.includes('fotos') ||
      text.includes('Fotos')
    ) {
        items.push('photo');
    }
    if (
      text.includes('tablas') ||
      text.includes('tblas') ||
      text.includes('Tablas') ||
      text.includes('tbls') ||
      text.includes('tabls')
    ) {
        items.push('table');
    }
    if (
      text.includes('mpas') ||
      text.includes('mps') ||
      text.includes('maps')
    ) {
        items.push('map');
    }
    if (
      text.includes('Figrs') ||
      text.includes('figr') ||
      text.includes('fogrs') ||
      text.includes('Figuras') ||
      text.includes('figs') ||
      text.includes('Figs') ||
      text.includes('fgrs') ||
      text.includes('grfcos') ||
      text.includes('figure') ||
      text.includes('figrs') ||
      text.includes('figuras')
    ) {
        items.push('shape');
    }
    if (
      text.includes('dbjs') ||
      text.includes('dibs') ||
      text.includes('dis') ||
      text.includes('drawings') ||
      text.includes('dibjs') ||
      text.includes('dibj')
    ) {
        items.push('drawing');
    }
    if (
      text.includes('colls') ||
      text.includes('coll')
    ) {
        items.push('collection');
    }
    if (text.includes('fichas')) {
        items.push('tags');
    }
    if (text.includes('láminas')) {
        items.push('sheet');
    }
    if (
      text.includes('dgmas') ||
      text.includes('dgrmas') ||
      text.includes('esquemas') ||
      text.includes('diagramas')
    ) {
        items.push('diagram');
    }
    if (text.includes('organigramas')) {
        items.push('organizationchat');
    }
    if (
      text.includes('Cultural') ||
      text.includes('1988') ||
      text.includes('Pearson') ||
      text.includes('Plural') ||
      text.includes('Contents') ||
      text.includes('Índice') ||
      text.includes('fls') ||
      text.includes('bibliograf') ||
      text.includes('950-769-067-0') ||
      text.includes('Otros') ||
      text.includes('form')
    ) {
        items.push('others');
    }
    if (items.length > 0) {
        return items.join(',');
    } else {
      console.log(text);
      throw new Error('update_illustration error', text);
    }
  }

  update_brings(text) {
    console.log(text);
    if (!text || text == ' ') {
      return 'others';
    }
    var items = [];

    // text.includes('BiogrÃ¡ficas')
    if (
      text.includes('bibliography') ||
      text.includes('Bibliograf') ||
      text.includes('bibliog') ||
      text.includes('biliograf') ||
      text.includes('bibliogr') ||
      text.includes('biblio') ||
      text.includes('bibl') ||
      text.includes('Bibliogragía')
    ) {
        items.push('bibliography');
    }
    if (
      text.includes('Biografía') ||
      text.includes('Biográficas')
    ) {
        items.push('biography');
    }
    if (text.includes('Geografía')) {
        items.push('geography');
    }
    if (
      text.includes('contensts') ||
      text.includes('Content') ||
      text.includes('Contenst') ||
      text.includes('contents') ||
      text.includes('contentes') ||
      text.includes('CONTENTS') ||
      text.includes('Contenido') ||
      text.includes('Contents')
    ) {
        items.push('content');
    }
    if (
      text.includes('INDEX') ||
      text.includes('indes') ||
      text.includes('index') ||
      text.includes('indice') ||
      text.includes('Índice') ||
      text.includes('índice') ||
      text.includes('Indice') ||
      text.includes('Index') ||
      text.includes('Índex')) {
        items.push('index');
    }
    if (text.includes('CD') || text.includes('cd')) {
        items.push('cd');
    }
    if (text.includes('Sumario')) {
        items.push('sumary');
    }
    if (text.includes('Glosario')) {
        items.push('glossary');
    }
    if (text.includes('Vocabulario')) {
        items.push('vocabulary');
    }
    if (text.includes('anexos') || text.includes('Anexos')) {
        items.push('annex');
    }
    if (text.includes('Léxico')) {
        items.push('lexical');
    }
    if (
      text.includes('conyrnts') ||
      text.includes('1988') ||
      text.includes('Referencia') ||
      text.includes('matieres') ||
      text.includes('MATIERES') ||
      text.includes('research') ||
      text.includes('Pearson') ||
      text.includes('ilustracion') ||
      text.includes('Ínteramericana') ||
      text.includes('950-573-966-4') ||
      text.includes('contest') ||
      text.includes('tablas') ||
      text.includes('cuadernillo') ||
      text.includes('Cuadernillo') ||
      text.includes('Gramatica') ||
      text.includes('Barcelona') ||
      text.includes('table') ||
      text.includes('Íncluye') ||
      text.includes('Morata') ||
      text.includes('2002') ||
      text.includes('Nueva') ||
      text.includes('figrs')) {
        items.push('others');
    }
    if (items.length <= 0) {
      if  (
        text.includes('ndice') ||
        text.includes('1988')) {
          items.push('others');
      }
    }

    if (items.length > 0) {
        return items.join(',');
    } else {
      console.log(text);
      throw new Error('update_brings error', text);
    }
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
