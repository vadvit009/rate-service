import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleDisconnect(socket: Socket) {
    this.socketService.handleDisconnect(socket);
  }

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  emitAllRates(data: Record<string, string>) {
    this.server.emit('rates', data);
  }
}
