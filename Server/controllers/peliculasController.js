const db = require('../lib/conexionbd');

class Controller {
  constructor() { }

  getPeliculas(req, res) {
    const sqlSentence = "SELECT ID, TITULO, DURACION FROM QUEVEOHOY.pelicula";
    db.query(sqlSentence, function(error, result, fields){
        if(error) {
          console.log("Error found at Get Peliculas query", error.message);
          return res.status(404).send("Error at users query, try again");
        } else {
          res.status(200).send(JSON.stringify(result));
        }
    });
  }

}

module.exports = Controller;