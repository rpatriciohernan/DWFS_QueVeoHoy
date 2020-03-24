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

function createSentenceForRecomendacionWithoutGenero(req){
  const anio_inicio = req.query.anio_inicio;
  const anio_fin = req.query.anio_fin;
  const puntuacion = req.query.puntuacion;

  const aniosDefined = typeof anio_inicio !== 'undefined' && anio_fin !== 'undefined';
  const puntuacionDefined = typeof puntuacion !== 'undefined';

  var sentence = "SELECT p.id, p.titulo, p.director, p.anio, p.fecha_lanzamiento, p.poster, p.trama, g.nombre FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id"

  if (aniosDefined) {
    sentence += " WHERE anio>= "+parseInt(anio_inicio)+" AND anio<="+parseInt(anio_fin);
    if(puntuacionDefined){ sentence += " AND puntuacion>="+parseInt(puntuacion)};
  } else {
    if(puntuacionDefined){
      sentence += " WHERE puntuacion>="+parseInt(puntuacion);
      if(generoDefined){ sentence += " AND genero_id="+generoId};
    };
  }

  return sentence;
}

function executeRecomendacionQueryWithoutGenero(req, res) {

  const sentence = createSentenceForRecomendacionWithoutGenero(req);

  db.query(sentence, function(error, result, fields){
    if(error){
      console.log("Error found at Get Recomendacion without Genero", error.message);
      return res.status(404).send("Recomendacion without Genero not found");
    }else{
      const response = {
        peliculas: result
      };
      res.status(200).send(JSON.stringify(response));
    }
  })
}

function createSentenceForRecomendacionWithGenero(req, generoId){
  const anio_inicio = req.query.anio_inicio;
  const anio_fin = req.query.anio_fin;
  const puntuacion = req.query.puntuacion;

  const aniosDefined = typeof anio_inicio !== 'undefined' && anio_fin !== 'undefined';
  const puntuacionDefined = typeof puntuacion !== 'undefined';

  var sentence = "SELECT p.id, p.titulo, p.director, p.anio, p.fecha_lanzamiento, p.poster, p.trama, g.nombre FROM pelicula p INNER JOIN genero g ON p.genero_id = g.id"

  if (aniosDefined) {
    sentence += " WHERE anio>= "+parseInt(anio_inicio)+" AND anio<="+parseInt(anio_fin);
    if(puntuacionDefined){ sentence += " AND puntuacion>="+parseInt(puntuacion)};
    sentence += " AND genero_id="+generoId;
  } else {
    if(puntuacionDefined){
      sentence += " WHERE puntuacion>="+parseInt(puntuacion);
      sentence += " AND genero_id="+generoId;
    }else {
     sentence += " WHERE genero_id="+generoId;
    };
  }

  return sentence;
}

function executeRecomendacionQueryWithGenero(req, res) {
const generoNombre = req.query.genero;
const generoSentence = "SELECT * FROM QUEVEOHOY.genero WHERE nombre ='"+generoNombre+"';";

db.query(generoSentence, function(error, generoResult, fields){
  if(error){
    console.log("Error found at Get Genero for Recomendacion", error.message);
    return res.status(404).send("Genero for Recomendacion not found");
  }else{
    const generoId = generoResult[0].id;
    const sentence = createSentenceForRecomendacionWithGenero(req, generoId);

    db.query(sentence, function(error, result, fields){
      if(error){
        console.log("Error found at Get Recomendacion with Genero", error.message);
        return res.status(404).send("Recomendacion with Genero not found");
      }else{
        const response = {
          peliculas: result
        };
        res.status(200).send(JSON.stringify(response));
      }
    })
  }
})
}

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

  getPeliculaById(req, res){

    const sentenceGetPelicula = "SELECT * FROM QUEVEOHOY.pelicula WHERE id="+parseInt(req.params.id);

    db.query(sentenceGetPelicula, function(error,peliculaResult, fields){
      if(error){
        console.log("Error found at Get Pelicula by ID query", error.message);
        return res.status(404).send("Pelicula not found");
      }else{
        const pelicula = peliculaResult[0];
        
        const sentenceGetGenero = "SELECT nombre FROM genero WHERE id="+parseInt(pelicula.genero_id);

        db.query(sentenceGetGenero, function(error, generoResult, fields){
          if(error){
            console.log("Error found at Get Genero query", error.message);
            return res.status(404).send("Genero not found");
          }else{
            const genero = generoResult[0].nombre;

            const sentenceGetActores = "SELECT nombre FROM actor A INNER JOIN (SELECT * FROM actor_pelicula WHERE pelicula_id="+parseInt(pelicula.id)+") AP ON A.id = AP.actor_id;"
  
            db.query(sentenceGetActores, function(error, actoresResult, fields){
              if(error){
                console.log("Error found at Get Actores query", error.message);
                return res.status(404).send("Actores not found");
              }else{
                const actores = actoresResult;

                const response = {
                  pelicula: pelicula,
                  genero: genero,
                  actores: actores
                };
                res.status(200).send(JSON.stringify(response));
              }
            })
          }
        })
      }
    })
  }

  getRecomendacion(req, res){
    
    const generoNombre = req.query.genero;
    const generoDefined = typeof generoNombre !== 'undefined';

    if (generoDefined) { 
      executeRecomendacionQueryWithGenero(req, res)
    } else {
      executeRecomendacionQueryWithoutGenero(req, res)
    };

  }
}

module.exports = Controller;