const jsonwebtoken = require('jsonwebtoken');
const profile = require('./controllers/profile');
const _ = require('lodash');

let connectedUsers = {};

module.exports = io => {
    io.on('connection', async(socket) /* async socket */ => {
        // console.log(socket.id);
        console.log('io .js alfin');
        const { token } = socket.handshake.query;
        // console.log(token);
        // // print('aea');
        // // get the data from jwt
        const { id } = await jsonwebtoken.verify(token, 'SK123');
        console.log(id);

        socket.join(id); // use the user id as room
        const user = await profile.info(id);

        io.to(id).emit('connected', { id: socket.id, connectedUsers }); // emit when the user is connected
        socket.broadcast.emit('joined', {
            id,
            user
        });

        connectedUsers[id] = user;

        socket.on('send', message => {
            socket.broadcast.emit('new-message', {
                from: { id, username: user.username },
                message
            });
        });

        socket.on('send-file', ({ type, url }) => {
            socket.broadcast.emit('new-file', {
                from: { id, username: user.username },
                file: { type, url }
            });
        });

        socket.on('disconnect', () => {
            connectedUsers = _.omit(connectedUsers, id);
            io.emit('disconnected', id);
        });
    });
};