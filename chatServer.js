const net = require('net');
const fs = require('fs');

let log = fs.createWriteStream('./chat.log');
let connections = [];
let id = 1;
let chatServer = net.createServer(socket => {
    let socketID = id++;
    connections.push(socket);
    for (let connection of connections) {
        if (connection !== socket) {
            connection.write(`Client ${socketID} has entered the chat room`);
        }
    }
    socket.write(`Welcome to the chat room. There are currently ${connections.length - 1} other people in the chat room.`);
    log.write(`Client ${socketID} has entered the chat room\n`);
    socket.on('data', data => {
        let message = data.toString().trim();
        log.write(`Client ${socketID}: ${message}\n`);
        for (let connection of connections) {
            if (connection !== socket) {
                connection.write(`Client ${socketID}: ${message}`);
            }
        }
    });
    socket.on('error', err => {
    
    });
    socket.on('close', err => {
        connections.splice(connections.indexOf(socket), 1);
        for (let connection of connections) {
            connection.write(`Client ${socketID} has left the chat room`);
        }
        log.write(`Client ${socketID} has left the chat room\n`)
    });
});

chatServer.listen(5000, () => {
    console.log('Listening on port 5000');
});
