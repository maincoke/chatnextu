// Inicializacion del Servidor de App Chat
const bodyParser = require('body-parser'), // Importanto Paquete Body-Parser
    http = require('http'), // Importanto Paquete http
    express = require('express'), // Importanto Paquete Express
    chat = require('./Chat'), // Importancion de App Chat
    socketio = require('socket.io'), // Importancion de Paquete Socket.io
    lib = require('./lib');

/**
 * Instancias y Variables del Servidor
 */
const port = process.env.PORT || 3000,
    app = express(),
    Server = http.createServer(app),
    io = socketio(Server);

/**
 * Configuracion y asignacion de funcionalidad del Servidor
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/chat', chat); // Importacion de App Chat
//app.use(lib);
app.use(express.static('public'));

/* ECMAScript 5
Server.listen(port, function() {
    console.log('Server is running on port: ' + port);
});
*/
// ECMAScript 6 // Fat Arrow (=>) suplanta la palabra (function) ------------------------>
Server.listen(port, () => console.log('Server is running on port: ' + port));


/**
 * Funciones para escuchar los eventos del Socket.io
 */
io.on('connection', function(socket) {
    console.log('A new user is connected on socket: ' + socket.id);

    // Escuchar el evento UserJoin, para agregar un usuario y notificarlo a los otros sockets
    socket.on('userJoin', user => { //Fat Arrow (=>) suplanta la palabra (function) --->
        socket.user = user;
        socket.broadcast.emit('userJoin', user);
    });

    // Escuchar el evento Message, para notificarlo a los otros sockets
    socket.on('message', message => socket.broadcast.emit('message', message));

    // Escuchar el evento Disconnect para desconectar un usuario y notificarlo a los otros sockets
    socket.on('disconnect', () => { //Fat Arrow (=>) suplanta la palabra (function) --->
        if (socket.hasOwnProperty('user')) {
            lib.deleteUser(socket.user, (err, confirm) => {
                if (err) throw (err)
                console.log(confirm);
            });
        }
        socket.broadcast.emit('refreshUsers');
    });
});