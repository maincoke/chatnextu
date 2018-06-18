// Inicializacion del Servidor de App Chat
var bodyParser = require('body-parser'), // Importanto Paquete Body-Parser
    http = require('http'), // Importanto Paquete http
    express = require('express'), // Importanto Paquete Express
    chat = require('./Chat'), // Importancion de App Chat
    socketio = require('socket.io'), // Importancion de Paquete Socket.io
    lib = require('./lib');

/**
 * Instancias y Variables del Servidor
 */
var port = port = process.env.PORT || 3000,
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

Server.listen(port, function() {
    console.log('Server is running on port: ' + port);
});

/**
 * Funciones para escuchar los eventos del Socket.io
 */
io.on('connection', function(socket) {
    console.log('A new user is connected on socket: ' + socket.id);

    socket.on('userJoin', function(user) {
        // Escuchar el evento UserJoin, para agregar un usuario y notificarlo a los otros sockets
        socket.user = user;
        socket.broadcast.emit('userJoin', user);
    });

    socket.on('message', function(message) {
        // Escuchar el evento Message, para notificarlo a los otros sockets
        socket.broadcast.emit('message', message);
    });

    socket.on('disconnect', function() {
        // Escuchar el evento Disconnect para desconectar un usuario y notificarlo a los otros sockets
        if (socket.hasOwnProperty('user')) {
            lib.deleteUser(socket.user, function(err, confirm) {
                if (err) throw (err)
                console.log(confirm);
            });
            socket.broadcast.emit('disconnect', socket.id)
        }
    });
});