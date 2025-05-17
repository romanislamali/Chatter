import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: any[] = [];
  sender: string = 'Roman';
  receiver: string = 'Bob';
  content: string = '';

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.messages$.subscribe(data => {
      this.messages = data;
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
      this.scrollToBottom();
    }
  }

  scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 100);
  }

}
