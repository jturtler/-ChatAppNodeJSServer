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

  console.log("------ Connected to server : " + socket.id );

  socket.on('username', (username) => {

		onlineUsers.push( username );
    socket.emit('abcTest', { testdata: "testDATA1" });
		UsersCollection.findOne({username: username}).then(( curUser ) => {
			UsersCollection.find(
				{ username: { $in: curUser.contacts } }
			)
			.sort({ fullName: 1 })
			.then(( contactList ) => {
				socket.emit('contactList', { curUser: curUser, contacts: contactList, onlineList: onlineUsers });
			})
		});

	});

  // socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('timeTEST', new Date().toTimeString()), 1000);
