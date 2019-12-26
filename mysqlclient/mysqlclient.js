const mysql = require('mysql2/promise');
const config = require('../config/keys');

const MYSQL_CONNECT = {
  host     : config.mysqlHost,
  user     : config.mysqlUser,
  password : config.mysqlPassword,
  database : config.mysqlDatabase
};

class MysqlConnect {

  constructor(){   
  }

  async getVentasByFecha(fecha) {
    try{      
      console.log("llamando getVentas");
      this.connection = await mysql.createConnection(MYSQL_CONNECT);
      console.log("llamando getVentas 2");
      const sql = `SELECT count(*) as no_servicios FROM itinerario WHERE DATE_FORMAT(fecha_creacion,'%Y-%m-%d')=DATE_FORMAT('${fecha}','%Y-%m-%d')`;
      console.log(sql);
      const [rows, fields] = await this.connection.execute( sql );
      console.log("ejecutado getVentas"); 
      console.log(rows[0]['no_servicios']);     
      console.log("ejecutado getVentas"); 
      return rows[0]['no_servicios'];
    } catch(err){
      console.log(err);
      return []
    }
  }
}

module.exports = MysqlConnect;