import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Message, MessageReaderData } from '../models/message.model';
import { MESSAGES } from '../../data/messages.mock';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messages: Message[] = MESSAGES;

  getAllMessages(): Observable<Message[]> {
    return of(this.messages);
  }

  getMessageById(id: string): Observable<Message | undefined> {
    return of(this.messages.find((m) => m.id === id));
  }

  getReaderData(id: string): Observable<MessageReaderData | null> {
    const index = this.messages.findIndex((m) => m.id === id);
    if (index === -1) return of(null);

    const message = this.messages[index];
    const prev = index > 0 ? this.messages[index - 1] : null;
    const next = index < this.messages.length - 1 ? this.messages[index + 1] : null;

    return of({
      messageId: message.id,
      title: message.title,
      preachedDate: message.preachedDate,
      formattedDate: message.formattedDate,
      location: message.location,
      previousMessage: prev ? { id: prev.id, title: prev.title } : null,
      nextMessage: next ? { id: next.id, title: next.title } : null,
      paragraphs: message.paragraphs,
    });
  }

  searchMessages(query: string): Observable<Message[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of(this.messages);
    return of(
      this.messages.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.location.toLowerCase().includes(q) ||
          m.formattedDate.toLowerCase().includes(q),
      ),
    );
  }
}
