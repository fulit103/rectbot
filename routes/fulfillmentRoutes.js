const {WebhookClient} = require('dialogflow-fulfillment');
const dateFormat = require('dateformat');
const MysqlConnect = require('../mysqlclient/mysqlclient');
const currencyFormatter = require('currency-formatter');

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
        const [noServicios, valorServicios] = await ventas.getVentasByFecha(req.body.queryResult.parameters.date);

        agent.add(`Realizamos ${noServicios} servicios por un valor de ${currencyFormatter.format(valorServicios, { code: 'USD' })} en esta fecha: ${ts_hms}` );
        
      }
      else if (
        req.body.queryResult && 
        req.body.queryResult.parameters &&
        req.body.queryResult.parameters["date-period"] != ""
      ){
        const ventas = new MysqlConnect();
        let {startDate, endDate} = req.body.queryResult.parameters["date-period"] 
        const [noServicos,valorServicios] = await ventas.getVentasByRangoFecha(startDate,endDate);
        startDate = dateFormat( new Date(startDate), "yyyy-mm-dd")
        endDate = dateFormat( new Date(endDate), "yyyy-mm-dd")
        agent.add(`Realizamos ${noServicos} servicios por un valor de ${currencyFormatter.format(valorServicios, { code: 'USD' })} entre ${startDate} y ${endDate}`);
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