import express from 'express';
const app = express();
import http from 'http';
const server = http.createServer(app);
import { Server, Socket } from "socket.io";
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log(`${socket.id} connected`);
  socket.on('create or join', (room) => {
    if (!socket.rooms.has(room)) {
      handleRooms(socket, room);
    }
  });

  socket.on('chat message', (msg, room) => {
    io.to(room).emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

function handleICECandidate(socket: Socket, iceCandidate: RTCPeerConnectionIceEvent) {
  socket.rooms.forEach(room => {
    io.to(room).emit('candidate', iceCandidate);
  });
}

function handleLocalDescription(socket: Socket, sessionDescription: RTCSessionDescription) {
  socket.rooms.forEach(room => {
    io.to(room).emit('session-description»', sessionDescription);
  });
}

function handleRooms(socket: Socket, room: string) {
  const clients = io.sockets.adapter.rooms.get(room);
  const numClients = clients ? clients.size : 0;

  console.log('Room ' + room + ' has ' + numClients + ' client(s)');

  if (numClients === 0) {
    socket.join(room);
    socket.emit('created', `created: ${room}`);
  } else if (numClients === 1) {
    io.sockets.in(room).emit('join', room);
    socket.join(room);
    socket.emit('joined', `joined: ${room}, current clients: ${numClients}`);
  } else {
    io.to(room).emit('chat message', `client ${socket.id} tried joining the room but it is full`);
    socket.emit('full', `tried joining '${room}' but it is full (clients: ${numClients}`)
  }
}

server.listen(3000, () => {
  console.log('listening on *:3000');
});