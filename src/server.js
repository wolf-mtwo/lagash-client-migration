"use strict";

import "babel-core/register";
import "babel-polyfill";

import log4js from 'log4js';
import { System } from './components/system';
import { MongoDB } from './components/mongo';
import { Migration } from './components/migration';

let logger = log4js.getLogger('app');
let system = new System();
let migration = new Migration();

MongoDB.start()
.then(() => {
  logger.info('Database connect successfully');
  return MongoDB.loadModels(__dirname);
})
.then(() => {
  logger.info('mongo models were loaded');
  return system.loadModules(__dirname);
})
.then(() => {
  logger.info('modules were loaded');
  migration.load(__dirname); // to load mongo data base
  // migration.upload(__dirname);
})
.catch((err) => {
  logger.error(err);
});

let date = new Date();
setInterval(() => { logger.info('uptime', date); }, 10000);
