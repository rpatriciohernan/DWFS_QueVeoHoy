const db = require('../lib/conexionbd');



// FUNCTIONS
function createQuerySentenceToShowValues(req) {
  var sentence = "SELECT * FROM QUEVEOHOY.pelicula";

  //FILTERS
  const anio = req.query.anio;
  const titulo = req.query.titulo;
  const genero = req.query.genero;
  
  const anioDefined = typeof anio !== 'undefined';
  const tituloDefined = typeof titulo !== 'undefined';
  const generoDefined = typeof genero !== 'undefined';

  if(generoDefined) {
    sentence += " WHERE genero_id="+parseInt(genero);
    if(anioDefined) { sentence += " AND anio ="+parseInt(anio)};
    if(tituloDefined) { sentence += " AND titulo LIKE '"+titulo+"%'"};
  } else {
    if (anioDefined) {
      sentence += " WHERE anio ="+parseInt(anio);
      if(tituloDefined) { sentence += " AND titulo LIKE '"+titulo+"%'"};
    } else {
      if(tituloDefined) { sentence += " WHERE titulo LIKE '"+titulo+"%'"};
    }
  }

  //ORDER
  const columna_orden = req.query.columna_orden;
  const tipo_orden = req.query.tipo_orden;

  const orderDefined = (typeof columna_orden !== 'undefined') && (typeof tipo_orden !== 'undefined');

  if(orderDefined) { sentence += " ORDER BY "+columna_orden+" "+tipo_orden};

  //LIMITS
  const pagina = req.query.pagina;
  const cantidad = req.query.cantidad;

  const limitDefined = typeof pagina !== 'undefined' && typeof cantidad !== 'undefined';

  if(limitDefined){
    var offset = ((pagina-1) * cantidad);
    sentence += " LIMIT "+parseInt(offset)+", "+parseInt(cantidad)
  };
  
  return sentence;

};


function createQuerySentenceToCountValues(req) {

  var sentence = "SELECT COUNT(*) AS COUNT FROM QUEVEOHOY.pelicula";

  //FILTERS
  const anio = req.query.anio;
  const titulo = req.query.titulo;
  const genero = req.query.genero;
  
  const anioDefined = typeof anio !== 'undefined';
  const tituloDefined = typeof titulo !== 'undefined';
  const generoDefined = typeof genero !== 'undefined';

  if(generoDefined) {
    sentence += " WHERE genero_id="+parseInt(genero);
    if(anioDefined) { sentence += " AND anio ="+parseInt(anio)};
    if(tituloDefined) { sentence += " AND titulo LIKE '"+titulo+"%'"};
  } else {
    if (anioDefined) {
      sentence += " WHERE anio ="+parseInt(anio);
      if(tituloDefined) { sentence += " AND titulo LIKE '"+titulo+"%'"};
    } else {
      if(tituloDefined) { sentence += " WHERE titulo LIKE '"+titulo+"%'"};
    }
  }

  return sentence;
};

// CONTROLLER DEFINITION
class Controller {
  constructor() { }

  getPeliculas(req, res) {
    
    const sentenceShowValues = createQuerySentenceToShowValues(req);
    const sentenceCountValues = createQuerySentenceToCountValues(req);

    db.query(sentenceShowValues, function(error, resultValues, fields){
        if(error) {
          console.log("Error found at Get Peliculas query", error.message);
          return res.status(404).send("Error at Peliculas query, try again");
        } else {
          db.query(sentenceCountValues, function(error, resultCount, fields){
            if(error) {
              console.log("Error found at Count Peliculas query", error.message);
              return res.status(404).send("Error at Count Peliculas query, try again");
            }else{
              const response = {
                peliculas: resultValues,
                total: resultCount[0].COUNT
              };
              res.status(200).send(JSON.stringify(response));
            }
          });
        }
    });
  }
}

module.exports = Controller;