import { io } from "socket.io-client";

// Usa la variable de entorno para el backend, o http://localhost:3001 por defecto
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// Debug: Mostrar la URL a la que intenta conectar
console.log('REACT_APP_BACKEND_URL:', process.env.REACT_APP_BACKEND_URL);
console.log('Socket backendUrl:', backendUrl);

const socket = io(backendUrl, {
  reconnectionAttempts: 3,
  reconnectionDelay: 5000,
  timeout: 20000,
  autoConnect: true,
  // Deja que Socket.IO elija el transporte (polling/websocket)
  // transports: ["websocket"], // puedes comentar esta línea para permitir fallback
  query: {
    clientType: "web",
    version: "1.0"
  }
});

// Debugging mejorado
const socketEvents = [
  "connect",
  "disconnect",
  "connect_error",
  "reconnect",
  "reconnect_attempt",
  "reconnect_error",
  "reconnect_failed"
];

socketEvents.forEach(event => {
  socket.on(event, (arg) => {
    console.log(`Socket.IO [${event}]:`, arg || '');
  });
});

export default socket;