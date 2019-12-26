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
    try {      
      this.connection = await mysql.createConnection(MYSQL_CONNECT);
      const sql = `
        SELECT 
          count(*) as no_servicios, 
          sum((valor_servicio + tiempo_espera + parqueadero)) as valor_servicio
        FROM 
          itinerario 
        WHERE 
          DATE_FORMAT(fecha_creacion,'%Y-%m-%d')=DATE_FORMAT('${fecha}','%Y-%m-%d') AND
          estado=3`;
      const [rows, fields] = await this.connection.execute( sql );          
      return [ rows[0]['no_servicios'], rows[0]['valor_servicio']];
    } catch (err) {
      return [0,0]
    }
  }

  async getVentasByRangoFecha(fechaInicio, fechaFin) {
    try {
      this.connection = await mysql.createConnection(MYSQL_CONNECT);
      const sql = `
        SELECT 
          count(*) as no_servicios,
          sum((valor_servicio + tiempo_espera + parqueadero)) as valor_servicio
        FROM itinerario WHERE 
          estado=3 AND
          CAST(fecha_creacion AS DATE) BETWEEN 
            CAST('${fechaInicio}' AS DATE )  AND
            CAST('${fechaFin}' AS DATE )` ;
      console.log(sql);
      const [rows, fields] = await this.connection.execute( sql );       
      console.log(rows);   
      return [ rows[0]['no_servicios'], rows[0]['valor_servicio']];
    } catch (err) {
      return [0,0];
    }
  }
}

module.exports = MysqlConnect;