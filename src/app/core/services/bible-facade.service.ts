import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BibleApiService } from './bible-api.service';
import { BibleMapper } from './bible.mapper';
import {
  BibleBook,
  BibleChapter,
  BibleReaderData,
  BibleVersion,
} from '../models/bible.model';

const ERROR_MESSAGES: Record<number, string> = {
  401: 'Chave da API.Bible ausente ou inválida.',
  403: 'Acesso negado à Bíblia selecionada.',
  404: 'Livro ou capítulo não encontrado.',
  429: 'Limite de requisições atingido.',
};

function mapHttpError(err: { status?: number }): Observable<never> {
  const message =
    ERROR_MESSAGES[err?.status ?? 0] ??
    'Não foi possível carregar a Bíblia. Tente novamente em instantes.';
  return throwError(() => new Error(message));
}

@Injectable({ providedIn: 'root' })
export class BibleFacadeService {
  private api = inject(BibleApiService);
  private mapper = inject(BibleMapper);
  private defaultBibleId = environment.apiBible.defaultBibleId;

  loadVersions(): Observable<BibleVersion[]> {
    return this.api.getPortugueseBibles().pipe(
      map((res) => res.data.map((dto) => this.mapper.toBibleVersion(dto))),
      catchError(mapHttpError),
    );
  }

  loadBooks(): Observable<BibleBook[]> {
    return this.api.getBooks(this.defaultBibleId).pipe(
      map((res) => res.data.map((dto, i) => this.mapper.toBibleBook(dto, i + 1, []))),
      catchError(mapHttpError),
    );
  }

  loadBookChapters(bookId: string): Observable<BibleChapter[]> {
    return this.api.getChapters(this.defaultBibleId, bookId).pipe(
      map((res) => res.data.map((dto) => this.mapper.toBibleChapter(dto))),
      catchError(mapHttpError),
    );
  }

  loadReaderData(
    bookId: string,
    chapterNumber: number,
  ): Observable<BibleReaderData | null> {
    const chapterId = `${bookId}.${chapterNumber}`;
    return forkJoin({
      books: this.api.getBooks(this.defaultBibleId),
      chapters: this.api.getChapters(this.defaultBibleId, bookId),
      content: this.api.getChapterContent(this.defaultBibleId, chapterId),
    }).pipe(
      map(({ books, chapters, content }) => {
        const bookDtos = books.data;
        const bookDto = bookDtos.find((b) => b.id === bookId);
        if (!bookDto) return null;
        const order = bookDtos.indexOf(bookDto) + 1;
        const chapterList = chapters.data.map((dto) => this.mapper.toBibleChapter(dto));
        const book = this.mapper.toBibleBook(bookDto, order, chapterList);
        return this.mapper.toBibleReaderData(content.data, book, chapterList);
      }),
      catchError(mapHttpError),
    );
  }
}
