import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './service/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  messages: any[] = [];
  sender: string = 'Roman';
  receiver: string = 'Bob';
  content: string = '';

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.connect();

    this.chatService.onMessage().subscribe(msg => {
      this.messages.push(msg);
    });
  }

  send(): void {
    if (this.content.trim()) {
      this.chatService.sendMessage({
        sender: this.sender,
        receiver: this.receiver,
        content: this.content
      });
      this.content = '';
    }
  }
}
