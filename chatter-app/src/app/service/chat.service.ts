import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Subject } from 'rxjs';
import { Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';



@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient!: Client;
  private connected = false;
  private messagesSubject = new BehaviorSubject<any[]>([]);

  messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.initializeWebSocketConnection();
  }

  initializeWebSocketConnection() {
    const socket = new SockJS(environment.socketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      this.connected = true;
      // Subscribe for receiving new message
      this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
        const msg = JSON.parse(message.body);
        this.messagesSubject.next([msg, ...this.messagesSubject.getValue()]);
      });

      // Fetch all existing notifications
      this.stompClient.publish({
        destination: '/app/fetch-all-messages',
        body: ''
      });

      this.stompClient.subscribe('/user/queue/all-messages', (message: IMessage) => {
        const messages = JSON.parse(message.body);
        this.messagesSubject.next(messages);
      });
    };

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient) this.stompClient.deactivate();
  }

  sendMessage(message: any) {
    if (this.connected) {
      this.stompClient.publish({
        destination: '/app/send',
        body: JSON.stringify(message)
      });
    } else {
      this.initializeWebSocketConnection();
    }
  }

  // private stompClient!: Client;
  // private messageSubject = new Subject<any>();

  // connect(): void {
  //   const socket = new SockJS(environment.socketUrl);
  //   this.stompClient = new Client({
  //     webSocketFactory: () => socket,
  //     reconnectDelay: 5000,
  //     debug: str => console.log(str)
  //   });

  //   this.stompClient.onConnect = () => {
  //     console.log('✅ Connected to WebSocket');

  //     this.stompClient.subscribe('/topic/messages', (message: IMessage) => {
  //       const msg = JSON.parse(message.body);
  //       this.messageSubject.next(msg);
  //     });
  //   };

  //   this.stompClient.activate();
  // }

  // sendMessage(message: { sender: string, receiver: string, content: string }) {
  //   this.stompClient.publish({
  //     destination: '/app/send',
  //     body: JSON.stringify(message)
  //   });
  // }

  // onMessage() {
  //   return this.messageSubject.asObservable();
  // }
}
