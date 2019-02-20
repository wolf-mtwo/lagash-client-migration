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
    if (!text || text == ' ') {
      return 'others';
    }
    var items = [];
    if (
      text.includes('cdr') ||
      text.includes('crds') ||
      text.includes('Cdrs') ||
      text.includes('cdrs') ||
      text.includes('Cdros') ||
      text.includes('cdros') ||
      text.includes('chart') ||
      text.includes('Cuadrs') ||
      text.includes('cuadrs') ||
      text.includes('square') ||
      text.includes('cuadros') ||
      text.includes('cuadors') ||
      text.includes('Cuadros')
    ) {
        items.push('square');
    }
    if (
      text.includes('grfs') ||
      text.includes('graf') ||
      text.includes('Graf') ||
      text.includes('grfcs') ||
      text.includes('gfcos') ||
      text.includes('grafs') ||
      text.includes('grafs') ||
      text.includes('grafcs') ||
      text.includes('Gráfi') ||
      text.includes('grficos') ||
      text.includes('Gráficos') ||
      text.includes('gráficos') ||
      text.includes('graficos')
    ) {
        items.push('chart');
    }
    if (
      text.includes('fts') ||
      text.includes('ftos') ||
      text.includes('fots') ||
      text.includes('Ftos') ||
      text.includes('phots') ||
      text.includes('Imágenes') ||
      text.includes('fotos') ||
      text.includes('Fotos') ||
      text.includes('photos')
    ) {
        items.push('photo');
    }
    if (
      text.includes('tbls') ||
      text.includes('TBLS') ||
      text.includes('Tbls') ||
      text.includes('tblas') ||
      text.includes('tabls') ||
      text.includes('Tablas') ||
      text.includes('tablas')
    ) {
        items.push('table');
    }
    if (
      text.includes('mps') ||
      text.includes('mpas') ||
      text.includes('planos') ||
      text.includes('maps') ||
      text.includes('Mapas') ||
      text.includes('mapas')
    ) {
        items.push('map');
    }
    if (
      text.includes('fig') ||
      text.includes('Fts') ||
      text.includes('figr') ||
      text.includes('Figura') ||
      text.includes('figs') ||
      text.includes('Figs') ||
      text.includes('fits') ||
      text.includes('fgrs') ||
      text.includes('firs') ||
      text.includes('FIGA') ||
      text.includes('Figrs') ||
      text.includes('Ftgrs') ||
      text.includes('fogrs') ||
      text.includes('figrs') ||
      text.includes('fibrs') ||
      text.includes('Fuguras') ||
      text.includes('grfcos') ||
      text.includes('figure') ||
      text.includes('Foguras') ||
      text.includes('FIguras') ||
      text.includes('figuras') ||
      text.includes('Figuras')
    ) {
        items.push('shape');
    }
    if (
      text.includes('dis') ||
      text.includes('dbjs') ||
      text.includes('dibs') ||
      text.includes('ibjs') ||
      text.includes('djos') ||
      text.includes('dbjos') ||
      text.includes('dibjs') ||
      text.includes('dibujs') ||
      text.includes('dibujos') ||
      text.includes('Dibujos') ||
      text.includes('drawings') ||
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
    if (text.includes('minas') || text.includes('láminas')) {
        items.push('sheet');
    }
    if (
      text.includes('dgmas') ||
      text.includes('dgrmas') ||
      text.includes('esquems') ||
      text.includes('Esquemas') ||
      text.includes('esquema') ||
      text.includes('esquemas') ||
      text.includes('diagramas')
    ) {
        items.push('diagram');
    }
    if (text.includes('orgmas') || text.includes('organigramas')) {
        items.push('organizationchat');
    }
    if (
      text.includes('S.F.') ||
      text.includes('g.') ||
      text.includes('0') ||
      text.includes('fls') ||
      text.includes('log') ||
      text.includes('form') ||
      text.includes('Formal') ||
      text.includes('1988') ||
      text.includes('Otros') ||
      text.includes('ndice') ||
      text.includes('Dramas') ||
      text.includes('Pinturas') ||
      text.includes('Plural') ||
      text.includes('Índice') ||
      text.includes('Pearson') ||
      text.includes('Cultural') ||
      text.includes('Contents') ||
      text.includes('banderas') ||
      text.includes('grabados') ||
      text.includes('bibliograf') ||
      text.includes('950-769-067-0')
    ) {
        items.push('others');
    }
    if (items.length <= 0) {
      if  (
        text.includes('.') ||
        text.includes('ndice')
      ) {
          items.push('others');
      }
    }
    // console.log(items);
    if (items.length > 0) {
        return items.join(',');
    } else {
      console.log(text);
      throw new Error('update_illustration error', text);
    }
  }

  update_brings(text) {
    // console.log(text);
    if (!text || text == ' ') {
      return 'others';
    }
    var items = [];

    // text.includes('BiogrÃ¡ficas')
    if (
      text.includes('bibl') ||
      text.includes('biblio') ||
      text.includes('bibliog') ||
      text.includes('bibliogr') ||
      text.includes('biliograf') ||
      text.includes('Bibliograf') ||
      text.includes('Bibliographia') ||
      text.includes('Bobliograf') ||
      text.includes('Bibliographies') ||
      text.includes('Bibliographics') ||
      text.includes('bibliography') ||
      text.includes('Bibliography') ||
      text.includes('Bibliogragía')
    ) {
        items.push('bibliography');
    }
    if (
      text.includes('Biografía') ||
      text.includes('biografía') ||
      text.includes('Biográficas')
    ) {
        items.push('biography');
    }
    if (
      text.includes('geograf') ||
      text.includes('Geografía')
    ) {
        items.push('geography');
    }
    if (
      text.includes('Conten') ||
      text.includes('Content') ||
      text.includes('contents') ||
      text.includes('figuras') ||
      text.includes('Contenst') ||
      text.includes('CONTENTS') ||
      text.includes('Conteudo') ||
      text.includes('Contents') ||
      text.includes('contentes') ||
      text.includes('contenido') ||
      text.includes('Contenido') ||
      text.includes('contensts')
    ) {
        items.push('content');
    }
    if (
      text.includes('INDEX') ||
      text.includes('indes') ||
      text.includes('ndice') ||
      text.includes('index') ||
      text.includes('nice') ||
      text.includes('nidce') ||
      text.includes('ndece') ||
      text.includes('Index') ||
      text.includes('Índex') ||
      text.includes('ndide') ||
      text.includes('ndix') ||
      text.includes('ndex') ||
      text.includes('dnice') ||
      text.includes('nidice') ||
      text.includes('indice') ||
      text.includes('Índice') ||
      text.includes('índice') ||
      text.includes('Indice')
    ) {
        items.push('index');
    }
    if (
      text.includes('CD') ||
      text.includes('Cd') ||
      text.includes('C.D.') ||
      text.includes('cd')
    ) {
        items.push('cd');
    }
    if (text.includes('Sumario')) {
        items.push('sumary');
    }
    if (
      text.includes('glosa') ||
      text.includes('Glosário') ||
      text.includes('Glosario')
    ) {
        items.push('glossary');
    }
    if (text.includes('Vocabulario')) {
        items.push('vocabulary');
    }
    if (
      text.includes('anexos') ||
      text.includes('Anexos')
    ) {
        items.push('annex');
    }
    if (text.includes('Léxico')) {
        items.push('lexical');
    }
    if (
      text.includes('1988') ||
      text.includes('2002') ||
      text.includes('temas') ||
      text.includes('Title') ||
      text.includes('programa') ||
      text.includes('Notas') ||
      text.includes('temaro') ||
      text.includes('Temario') ||
      text.includes('table') ||
      text.includes('Wants') ||
      text.includes('Table') ||
      text.includes('Tablas') ||
      text.includes('autores') ||
      text.includes('Estructura') ||
      text.includes('huesos') ||
      text.includes('anatomia') ||
      text.includes('nervioso') ||
      text.includes('articulaciones') ||
      text.includes('Nueva') ||
      text.includes('Figuras') ||
      text.includes('figrs') ||
      text.includes('Fotos') ||
      text.includes('tablas') ||
      text.includes('Hebrew') ||
      text.includes('Título') ||
      text.includes('Morata') ||
      text.includes('contest') ||
      text.includes('Contrib') ||
      text.includes('Láminas') ||
      text.includes('Laminas') ||
      text.includes('Pearson') ||
      text.includes('cuadros') ||
      text.includes('Íncluye') ||
      text.includes('ncluye') ||
      text.includes('dibujos') ||
      text.includes('Dibujos') ||
      text.includes('Folleto') ||
      text.includes('matieres') ||
      text.includes('MATIERES') ||
      text.includes('research') ||
      text.includes('Bosquejo') ||
      text.includes('Artículos') ||
      text.includes('liturgico') ||
      text.includes('gramaticales') ||
      text.includes('conyrnts') ||
      text.includes('Bosquejos') ||
      text.includes('Prefacio') ||
      text.includes('alfabetic') ||
      text.includes('Gramatica') ||
      text.includes('Barcelona') ||
      text.includes('abbreviat') ||
      text.includes('Dedicated') ||
      text.includes('Appendixes') ||
      text.includes('Dedication') ||
      text.includes('Referencia') ||
      text.includes('referencias') ||
      text.includes('preliminares') ||
      text.includes('ilustracion') ||
      text.includes('cuadernillo') ||
      text.includes('Cuadernillo') ||
      text.includes('abreviatura') ||
      text.includes('Introduction') ||
      text.includes('Contributors') ||
      text.includes('Abreviaturas') ||
      text.includes('950-573-966-4') ||
      text.includes('Ínteramericana')
    ) {
        items.push('others');
    }
    if (items.length <= 0) {
      if  (
        text.includes('5') ||
        text.includes('s i.') ||
        text.includes('ndic e') ||
        text.includes('1988') ||
        text.includes('Conte') ||
        text.includes('ndice')
      ) {
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
