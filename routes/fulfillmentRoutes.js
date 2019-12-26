const {WebhookClient} = require('dialogflow-fulfillment');
const dateFormat = require('dateformat');
const MysqlConnect = require('../mysqlclient/mysqlclient');

module.exports = app => {
  app.post('/fulfillment', async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    function snoopy(agent) {
        agent.add(`Welcome to my Snoopy fulfillment!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    async function serviciosRealizados(agent){
      if (
        req.body.queryResult && 
        req.body.queryResult.parameters &&
        req.body.queryResult.parameters.date != ""
        ){
        
        const ventas = new MysqlConnect();
        const ts_hms = dateFormat( new Date(req.body.queryResult.parameters.date), "yyyy-mm-dd");

        agent.add(`Realizamos ${await ventas.getVentasByFecha(req.body.queryResult.parameters.date)} servicios en esta fecha: ${ts_hms}` );
        
      }
      else if (
        req.body.queryResult && 
        req.body.queryResult.parameters &&
        req.body.queryResult.parameters["date-period"] != ""
      ){
        agent.add('Realizamos tantos servicios periodo');
      }
      else {
        agent.add('Realizamos tantos servicios ');
      }      
    }

    let intentMap = new Map();
    intentMap.set('snoopy', snoopy);
    intentMap.set('servicios-realizados', serviciosRealizados);
    intentMap.set('Default Fallback Intent', fallback);

    agent.handleRequest(intentMap);
  });
}