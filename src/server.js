import log4js from 'log4js';
import System from './components/system';
import { Monitor } from './components/monitor';

let logger = log4js.getLogger('app');
logger.warn('node .tmp/server.js <start> <end> B');
let node = process.argv[0];
let path = process.argv[1];
let start = process.argv[2] || 20000;
let end = process.argv[3] || 20010;
logger.info('[node]', node);
logger.info('[path]', path);
logger.info('[start]', start);
logger.info('[end]', end);

let monitor = new Monitor(start, end);
monitor.play();

// let system = new System();
// var yourApiKey = 'Q71DBI2RESC3LMBM';
//
// system.loadModules(__dirname)
// .then(() => {
//   logger.info('modules where loaded');
//   return system.start();
// })
// .then(() => {
//   logger.info('server started at port: ' + system.port);
//
// })
// .catch((err) => {
//   logger.error(err);
// });
