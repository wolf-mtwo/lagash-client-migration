import request from 'superagent';
import cheerio from 'cheerio';
import utf8 from 'utf8';
import uuidv4 from 'uuid/v4';
import log4js from 'log4js';
import oracledb from 'oracledb';

let config = {
  user: "wolf_2019",
  password: "wolf_2019",
  connectString: "http://LAPTOP-3TI2F6HD:1158/em"
};

export class Oracle {

  constructor() {
    this.logger = log4js.getLogger('oracle');
  }

  connect() {
    oracledb.getConnection(config, (err, connection) => {
        if (err) {

          this.logger.error(err.message);
          return;
        }
        console.log(connection);

        // connection.execute(
        //   `SELECT manager_id, department_id, department_name
        //    FROM departments
        //    WHERE manager_id = :id`,
        //   [103],  // bind value for :id
        //   function(err, result) {
        //     if (err) {
        //       console.error(err.message);
        //       doRelease(connection);
        //       return;
        //     }
        //     console.log(result.rows);
        //     doRelease(connection);
        //   });
      });

  }

  run() {
  }
}




function doRelease(connection) {
  connection.close(
    function(err) {
      if (err)
        console.error(err.message);
    });
}
