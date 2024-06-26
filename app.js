const express = require('express');
const multer = require('multer');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;
// Comando iniciar node app.js

// Configuración de multer para el manejo de archivos
const upload = multer({ dest: 'images/' });

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'gato2442',
    database: 'fifa'
});
//Envio los datos del formulario por url

//Verificacion de errores para validar si la conexion es correcta
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos.');
});
//Envio los datos del formulario por url
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pagina_principal')));

//Configuro para que la aplicacon inicie desde el director o carpeta pagina principal
 
 
app.post('/registrar_usuario', (req, res) => {
    const { usuario, password, email, birthday, rol} = req.body;

    const query = 'INSERT INTO usuario (nombre, password, email, birthday, rol) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [usuario, password, email, birthday, rol], (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario:', err);
            res.send('Error al registrar el usuario');
        } else {
            console.log('Usuario registrado exitosamente:', result);
            res.send('Usuario registrado exitosamente');
            res.redirect('/');
        }
    });
});

// Ruta para manejar el inicio de sesión
app.post('/iniciar_sesion', (req, res) => { // Define una ruta POST para '/iniciar_sesion'
    const { email, password } = req.body; // Extrae 'correo' y 'contraseña' del cuerpo de la solicitud

    // Define la consulta SQL para obtener el rol del usuario que coincida con el correo y la contraseña
    const query = 'SELECT rol FROM usuario WHERE email = ? AND password = ?';

    // Ejecuta la consulta SQL con los valores de 'correo' y 'contraseña'
    connection.query(query, [email, password], (err, results) => {
        if (err) { // Si hay un error en la consulta
            console.error('Error al iniciar sesión:', err); // Imprime el error en la consola
            res.send('Error al iniciar sesión'); // Envía una respuesta de error al cliente
        } else if (results.length > 0) { // Si la consulta devuelve al menos un resultado
            const rol = results[0].rol; // Obtiene el rol del usuario del primer resultado
            if (rol === 1) { // Si el rol es 1 (administrador)
                res.redirect('/administrador.html'); // Redirige a la página del administrador
            } else if (rol === 2) { // Si el rol es 2 (usuario normal)
                res.redirect('/usuario.html'); // Redirige a la página del usuario
            }
        } else { // Si no se encuentra ningún usuario con las credenciales proporcionadas
            res.send('Correo o clave incorrectos'); // Envía una respuesta indicando que las credenciales son incorrectas
        }
    });
});


//CONFEDERACION
app.get('/confederaciones', (req, res) => {
    //Realiza una consulta SQL para seleccionar todas las filas de la tabla "peliculas"
    connection.query('SELECT * FROM confederaciones', (err, rows) => {
        // Maneja los errores, si los hay
        if (err) throw err;
        res.send(rows); // Aquí puedes enviar la respuesta como quieras (por ejemplo, renderizar un HTML o enviar un JSON)
    });
});


//CONFEDERACION
app.get('/confederaciones/:id', (req, res) => {
    //Extraer el id de los parametros de la solicitud
    const id = req.params.id;
    //Ejecuto la consulta SQL para obtener los datos de la pelicula con el id
    connection.query('SELECT * FROM confederaciones WHERE id = ?', [id], (err, result) => {
        if (err) {
            //manejamos si ocurre un error en la consulta
            console.log('Error al obtener los datos', err);
            res.status(500).send('Error interno en el servidor');
            return;
        }
        if (result.length == 0) {
            res.status(404).send('confederacion no encontrada')
            return;
        }
        //enviamos los datos de la pelicula en formato JSON
        res.json(result[0]);
    });
});


// Modificar el endpoint /paises para manejar la paginación
app.get('/paises', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    //Realiza una consulta SQL para seleccionar las filas de la tabla "paises" con paginación
    connection.query('SELECT * FROM paises LIMIT ?, ?', [offset, limit], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

//PAIS
app.get('/paises/:id', (req, res) => {
    //Extraer el id de los parametros de la solicitud
    const id = req.params.id;
    //Ejecuto la consulta SQL para obtener los datos de la pelicula con el id
    connection.query('SELECT * FROM paises WHERE id = ?', [id], (err, result) => {
        if (err) {
            //manejamos si ocurre un error en la consulta
            console.log('Error al obtener los datos', err);
            res.status(500).send('Error interno en el servidor');
            return;
        }
        if (result.length == 0) {
            res.status(404).send('Paises no encontrada')
            return;
        }
        //enviamos los datos de la PAIS en formato JSON
        res.json(result[0]);
    });
});

//LIGA
app.get('/ligas', (req, res) => {
    //Realiza una consulta SQL para seleccionar todas las filas de la tabla "peliculas"
    connection.query('SELECT * FROM ligas', (err, rows) => {
        // Maneja los errores, si los hay
        if (err) throw err;
        res.send(rows); // Aquí puedes enviar la respuesta como quieras (por ejemplo, renderizar un HTML o enviar un JSON)
    });
});

//LIGA
app.get('/ligas/:id', (req, res) => {
    //Extraer el id de los parametros de la solicitud
    const id = req.params.id;
    //Ejecuto la consulta SQL para obtener los datos de la pelicula con el id
    connection.query('SELECT * FROM ligas WHERE id = ?', [id], (err, result) => {
        if (err) {
            //manejamos si ocurre un error en la consulta
            console.log('Error al obtener los datos', err);
            res.status(500).send('Error interno en el servidor');
            return;
        }
        if (result.length == 0) {
            res.status(404).send('liga no encontrada')
            return;
        }
        //enviamos los datos de la PAIS en formato JSON
        res.json(result[0]);
    });
});

// Modificar el endpoint /paises para manejar la paginación
app.get('/equipos', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    //Realiza una consulta SQL para seleccionar las filas de la tabla "equipos" con paginación
    connection.query('select NombreEquipo, NombrePais,YearEquipo, LigaPerteneciente from equipos e left join paises p on e.PaisPerteneciente = p.IdPais LIMIT ?, ?', [offset, limit], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

//Equipos
app.get('/equipos/:id', (req, res) => {
    //Extraer el id de los parametros de la solicitud
    const id = req.params.id;
    //Ejecuto la consulta SQL para obtener los datos de la pelicula con el id
    connection.query('SELECT * FROM equipos WHERE id = ?', [id], (err, result) => {
        if (err) {
            //manejamos si ocurre un error en la consulta
            console.log('Error al obtener los datos', err);
            res.status(500).send('Error interno en el servidor');
            return;
        }
        if (result.length == 0) {
            res.status(404).send('equipos no encontrada')
            return;
        }
        //enviamos los datos de la PAIS en formato JSON
        res.json(result[0]);
    });
});
// jugadores
app.get('/jugadores', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    //Realiza una consulta SQL para seleccionar las filas de la tabla "jugadores" con paginación
    connection.query('select idJugador, nombreJugador, apellidoJugador, cumpleJugador, valoracionJugador, NombrePais from jugadores j left join paises p on j.paisJugador = p.IdPais LIMIT ?, ?', [offset, limit], (err, rows) => {
        if (err) throw err;
        res.send(rows);
    });
});

//Equipos
app.get('/jugadores/:id', (req, res) => {
    //Extraer el id de los parametros de la solicitud
    const id = req.params.id;
    //Ejecuto la consulta SQL para obtener los datos de la pelicula con el id
    connection.query('SELECT * FROM jugadores WHERE idJugador = ?', [id], (err, result) => {
        if (err) {
            //manejamos si ocurre un error en la consulta
            console.log('Error al obtener los datos', err);
            res.status(500).send('Error interno en el servidor');
            return;
        }
        if (result.length === 0) {
            res.status(404).send('jugadores no encontrada')
            return;
        }
        //enviamos los datos de la PAIS en formato JSON
        res.json(result[0]);
    });
});
app.post('/guardar_jugadores',(req, res) => {
    const { nombre, apellido, pais, fecha, valoracion } = req.body;
    const sql = 'INSERT INTO jugadores (nombreJugador, apellidoJugador, paisJugador, cumpleJugador, valoracionJugador) VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [nombre, apellido, pais, fecha, valoracion], (err, result) => {
        if (err) throw err;
        console.log('Jugador insertado correctamente.');
        res.redirect('/jugadores.html');
    });
});
//Define una ruta DELETE en la aplicación Express para eliminar una película por su ID
app.delete('/eliminar_jugadores/:id', (req, res) => {
    //Obtiene el parámetro 'id' de la URL para eliminar la pelicula en especifico
    const id = req.params.id;
    //Define la consulta SQL para eliminar una película donde el ID coincida
    const sql = 'DELETE FROM jugadores WHERE idJugador = ?';
    //Ejecuta la consulta SQL, utilizando el Id que se enviara a la consulta SQL
    connection.query(sql, [id], (err, result) => {
        // Si ocurre un error durante la ejecución de la consulta, lanza una excepción
        if (err) throw err;
        // Imprime un mensaje en la consola indicando que la película fue eliminada correctamente
        console.log('jugador eliminado correctamente.');
        // Envía una respuesta HTTP 200 OK al cliente, indicando que la eliminación fue exitosa
        res.sendStatus(200); 
    });
});
app.post('/modificar_jugadores', (req, res) => { 
    const { id, nombre, apellido, pais, fecha, valoracion } = req.body;
    // Consulta SQL para actualizar los datos de la película en la base de datos
    const sql = 'UPDATE jugadores SET nombreJugador = ?, apellidoJugador = ?, paisJugador = ?, cumpleJugador = ?, valoracionJugador = ? WHERE idJugador = ?';
    // Ejecuta la consulta SQL
    connection.query(sql, [nombre, apellido, pais, fecha, valoracion, id], (err, result) => {
        if (err) {
            // Si ocurre un error, muestra un mensaje en la consola y envía una respuesta de error al cliente
            console.error('Error al modificar la película:', err);
            res.status(500).send('Error interno del servidor');
            return;
        }
        // Si la actualización es exitosa, muestra un mensaje en la consola
        console.log('jugador modificado correctamente.');
        // Redirecciona al usuario a la página de listado de películas
        res.redirect('/jugadores.html');
    });
});

//Verifico si el servidor local se levanto en el puerto 3000
app.listen(port, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

