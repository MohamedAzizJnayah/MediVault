import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat-service';

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
  time: string;
}

@Component({
  selector: 'app-chatbo-widget',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbo-widget.html',
  styleUrl: './chatbo-widget.css',
})
export class ChatboWidget {

isOpen = false;
  inputText = '';
  isLoading = false;

  @ViewChild('scrollBox') scrollBox?: ElementRef<HTMLDivElement>;
  @ViewChild('chatInput') chatInput?: ElementRef<HTMLInputElement>;

  messages: ChatMessage[] = [
    {
      from: 'bot',
      text: 'Hi 👋 I’m MediVault Assistant.\nAsk me about medications, reminders, or your medical records.',
      time: 'Now'
    }
  ];

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      setTimeout(() => {
        this.chatInput?.nativeElement.focus();
        this.scrollToBottom();
      }, 0);
    }
  }

  prefill(text: string) {
    this.inputText = text;
    setTimeout(() => this.chatInput?.nativeElement.focus(), 0);
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private scrollToBottom() {
    const el = this.scrollBox?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  sendMessage() {
    const text = this.inputText.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ from: 'user', text, time: this.getCurrentTime() });
    this.inputText = '';
    this.isLoading = true;

    setTimeout(() => this.scrollToBottom(), 0);

    this.chatService.sendMessage(text).subscribe({
      next: (response: string) => {
        this.messages.push({ from: 'bot', text: response, time: this.getCurrentTime() });
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 0);
      },
      error: (err) => {
        console.error('Chatbot error', err);
        this.messages.push({
          from: 'bot',
          text: "❌ I can't reply right now. Please check that the backend is running.",
          time: this.getCurrentTime()
        });
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 0);
      }
    });
  }
}