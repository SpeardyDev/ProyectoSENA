import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  reconnectionAttempts: 3, // Reducido para fallar más rápido
  reconnectionDelay: 5000, // 5 segundos entre intentos
  timeout: 20000, // 20 segundos máximo de espera
  autoConnect: true,
  transports: ["websocket"],
  query: {
    clientType: "web",
    version: "1.0"
  }
});

// Debugging mejorado
const socketEvents = ["connect", "disconnect", "connect_error", "reconnect", "reconnect_attempt", "reconnect_error", "reconnect_failed"];

socketEvents.forEach(event => {
  socket.on(event, (arg) => {
    console.log(`Socket.IO [${event}]:`, arg || '');
  });
});

export default socket;