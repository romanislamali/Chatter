import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Subject } from 'rxjs';
import { Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient!: Client;
  private messageSubject = new Subject<any>();

  connect(): void {
    const socket = new SockJS(environment.socketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: str => console.log(str)
    });

    this.stompClient.onConnect = () => {
      console.log('✅ Connected to WebSocket');

      this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        this.messageSubject.next(msg);
      });
    };

    this.stompClient.activate();
  }

  sendMessage(message: { sender: string, receiver: string, content: string }) {
    this.stompClient.publish({
      destination: '/app/send',
      body: JSON.stringify(message)
    });
  }

  onMessage() {
    return this.messageSubject.asObservable();
  }
}
