const db = require('../lib/conexionbd');

class Controller {
  constructor() { }

  getGeneros(req, res) {
    const sqlSentence = "SELECT * FROM QUEVEOHOY.genero";
    db.query(sqlSentence, function(error, result, fields){
        if(error) {
          console.log("Error found at Get Generos query", error.message);
          return res.status(404).send("Error at users query, try again");
        } else {
          const response = {
            generos: result,
            total: result.length
          };
          res.status(200).send(JSON.stringify(response));
        }
    });
  }

}

module.exports = Controller;