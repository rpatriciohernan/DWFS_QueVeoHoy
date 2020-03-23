CREATE DATABASE QUEVEOHOY;

CREATE TABLE PELICULA (
	ID INT AUTO_INCREMENT,
    TITULO VARCHAR(100),
    DURACION INT(5),
    DIRECTOR VARCHAR(400),
    ANIO INT(5),
    FECHA_LANZAMIENTO DATE, 
    PUNTUACION INT(2),
    POSTER VARCHAR(300),
    TRAMA VARCHAR(700),
    PRIMARY KEY (ID)
);