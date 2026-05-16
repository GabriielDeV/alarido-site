import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Message, MessageParagraph, MessageReaderData } from '../models/message.model';
import {
  BibliotecaObraResponseDTO,
  BibliotecaParagrafoResponseDTO,
  BibliotecaResultadoBuscaResponseDTO,
  BibliotecaSecaoResponseDTO,
} from '../models/biblioteca.dto';

const TIPO_OBRA = 'MESSAGE';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/biblioteca`;

  private messagesCache$: Observable<Message[]> | null = null;

  getAllMessages(): Observable<Message[]> {
    if (!this.messagesCache$) {
      this.messagesCache$ = this.http
        .get<BibliotecaObraResponseDTO[]>(`${this.baseUrl}/obras`, {
          params: { tipoObra: TIPO_OBRA },
        })
        .pipe(
          map((obras) => obras.map((o) => this.mapObraToMessage(o))),
          shareReplay(1),
        );
    }
    return this.messagesCache$;
  }

  getMessageById(id: string): Observable<Message | null> {
    return this.http.get<BibliotecaObraResponseDTO>(`${this.baseUrl}/obras/${id}`).pipe(
      map((obra) => this.mapObraToMessage(obra)),
    );
  }

  getReaderData(id: string): Observable<MessageReaderData | null> {
    const obra$ = this.http.get<BibliotecaObraResponseDTO>(`${this.baseUrl}/obras/${id}`);
    const sections$ = this.http.get<BibliotecaSecaoResponseDTO[]>(`${this.baseUrl}/obras/${id}/secoes`);
    const allMessages$ = this.getAllMessages();

    return forkJoin({ obra: obra$, sections: sections$, allMessages: allMessages$ }).pipe(
      switchMap(({ obra, sections, allMessages }) => {
        if (!sections.length) {
          return of(this.buildReaderData(obra, [], allMessages));
        }
        const paragraphs$ = sections.map((s) =>
          this.http.get<BibliotecaParagrafoResponseDTO[]>(`${this.baseUrl}/secoes/${s.id}/paragrafos`),
        );
        return forkJoin(paragraphs$).pipe(
          map((allParagraphs) => {
            const flat: MessageParagraph[] = allParagraphs
              .flat()
              .sort((a, b) => a.numeroParagrafo - b.numeroParagrafo)
              .map((p) => ({ number: p.numeroParagrafo, text: p.conteudo }));
            return this.buildReaderData(obra, flat, allMessages);
          }),
        );
      }),
    );
  }

  searchContent(query: string): Observable<BibliotecaResultadoBuscaResponseDTO[]> {
    if (!query.trim()) return of([]);
    return this.http.get<BibliotecaResultadoBuscaResponseDTO[]>(`${this.baseUrl}/busca`, {
      params: { query },
    });
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private mapObraToMessage(obra: BibliotecaObraResponseDTO): Message {
    return {
      id: obra.id,
      slug: obra.slug,
      title: obra.titulo,
      preachedDate: obra.dataPregacao,
      formattedDate: this.formatDate(obra.dataPregacao),
      location: obra.local || 'Local não informado',
      summary: obra.descricao || '',
      paragraphs: [],
    };
  }

  private buildReaderData(
    obra: BibliotecaObraResponseDTO,
    paragraphs: MessageParagraph[],
    allMessages: Message[],
  ): MessageReaderData {
    const idx = allMessages.findIndex((m) => m.id === obra.id);
    const prev = idx > 0 ? allMessages[idx - 1] : null;
    const next = idx >= 0 && idx < allMessages.length - 1 ? allMessages[idx + 1] : null;
    return {
      messageId: obra.id,
      title: obra.titulo,
      preachedDate: obra.dataPregacao,
      formattedDate: this.formatDate(obra.dataPregacao),
      location: obra.local || 'Local não informado',
      previousMessage: prev ? { id: prev.id, title: prev.title } : null,
      nextMessage: next ? { id: next.id, title: next.title } : null,
      paragraphs,
    };
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr + (dateStr.includes('T') ? '' : 'T00:00:00'));
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }
}

