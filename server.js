'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;


const clientURL = "https://client-dev.psi-connect.org";
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = require('socket.io')(server,{
  cors: {
		origin: clientURL,
		methods: ["GET", "POST"],
		credentials: true
	}
});

io.on('connection', (socket) => {
  socket.emit('connect success', {connectstatus: "success"} );

  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
