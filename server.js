const express = require('express');
const routes = require('./router');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const socketioJwt = require('socketio-jwt');
const cors = require('cors');
const path = require('path');

const app = express();
// const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

// Body parser para leer los datos del formulario
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(cors());
// Definir rutas de la aplicación
app.use('/', routes());



// Conectar Mongo
mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://root:root@cluster0-371br.mongodb.net/test?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err.message);
    });
const ser = app.listen(port, () => {
    console.log(`Servidor funcionando correctamente en el puerto ${port}`);
});

const server = http.Server(app);
// console.log(`${ser} http`)
const io = socketio(ser);
io.use(
    socketioJwt.authorize({
        secret: 'SK123',
        handshake: true,
        callback: false
    })
);

// io.on('connection', () => {
//     console.log('aea');
// });

// require('./router')(app);
require('./io')(io);