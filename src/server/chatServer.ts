import { WebSocketServer, WebSocket } from 'ws';

interface Message {
  id: string;
  senderId: string;
  channelId: string;
  content: string;
  timestamp: Date;
  attachments?: { name: string; url: string; type: string }[];
}

interface ConnectedClient extends WebSocket {
  userId?: string;
}

const clients = new Set<ConnectedClient>();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: ConnectedClient) => {
  console.log('Novo cliente conectado');
  clients.add(ws);

  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      
      if (message.type === 'auth') {
        ws.userId = message.userId;
        console.log(`Cliente autenticado: ${message.userId}`);
        return;
      }

      // Broadcast the message to all connected clients
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message));
        }
      });
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      ws.send(JSON.stringify({ type: 'error', error: 'Formato de mensagem inválido' }));
    }
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('Erro de WebSocket:', error);
    clients.delete(ws);
  });
});

console.log('Servidor WebSocket iniciado na porta 8080'); 