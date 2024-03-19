const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

// Speichere eine Zuordnung von WebSocket-Verbindungen zu Client-Kennungen
const clients = new Map();

wss.on('connection', function connection(ws) {
  // Generiere eine eindeutige Kennung für den Client
  const clientId = generateClientId();
  
  // Speichere die WebSocket-Verbindung und die Client-Kennung
  clients.set(ws, clientId);
  
  // Sende eine Begrüßungsnachricht an den Client
  ws.send(`Willkommen, Client ${clientId}!`);
  
  ws.on('message', function incoming(message) {
    console.log(`Empfangene Nachricht von Client ${clientId}: ${message}`);
    
    // Hier kannst du die empfangenen Daten verarbeiten
    
    // Sende eine Nachricht an alle Clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Nachricht von Client ${clientId}: ${message}`);
      }
    });
  });
  
  ws.on('close', function close() {
    // Entferne die Verbindung aus der Zuordnung
    clients.delete(ws);
  });
});

// Funktion zur Generierung einer eindeutigen Client-ID
function generateClientId() {
  return Math.random().toString(36).substring(7);
}
