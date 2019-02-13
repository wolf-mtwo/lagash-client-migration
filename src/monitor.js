import { Monitor } from './components/monitor';

let monitor = new Monitor();
monitor.start();

// HTML Migrations
// import { Monitor } from './components/monitor';
// logger.warn('node .tmp/server.js <start> <end> B');
// let node = process.argv[0];
// let path = process.argv[1];
// let start = process.argv[2] || 20000;
// let end = process.argv[3] || 20010;
// logger.info('[node]', node);
// logger.info('[path]', path);
// logger.info('[start]', start);
// logger.info('[end]', end);
//
// let monitor = new Monitor(start, end);
// monitor.play();
