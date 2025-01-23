import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  logger = new Logger(SocketGateway.name);
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  afterInit() {
    this.logger.log('Socket gateway initialized');
  }

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
