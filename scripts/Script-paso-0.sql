
/* PASO 1 */

CREATE TABLE pelicula (
	id INT AUTO_INCREMENT,
    titulo VARCHAR(100),
    duracion INT(5),
    director VARCHAR(400),
    anio INT(5),
    fecha_lanzamiento DATE, 
    puntuacion INT(2),
    poster VARCHAR(300),
    trama VARCHAR(700),
    PRIMARY KEY (id)
);

/* PASO 2 */

CREATE TABLE genero (
    id INT AUTO_INCREMENT,
    nombre VARCHAR(30),
    PRIMARY KEY (id)
);

ALTER TABLE pelicula
  ADD COLUMN genero_id INT,
  ADD FOREIGN KEY (genero_id) REFERENCES genero(id);


/* PASO 3 */

CREATE TABLE actor(
	id INT AUTO_INCREMENT,
    nombre VARCHAR(70),
    PRIMARY KEY (id)
);

CREATE TABLE actor_pelicula(
	id INT AUTO_INCREMENT,
    actor_id INT,
    pelicula_id INT,
    FOREIGN KEY (actor_id) REFERENCES actor(id),
    FOREIGN KEY (pelicula_id) REFERENCES pelicula(id),
    PRIMARY KEY (id)
);