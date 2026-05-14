import { Injectable, inject } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { BibleApiService } from './bible-api.service';
import { BibleMapper } from './bible.mapper';
import {
  BibleBook,
  BibleChapter,
  BibleReaderData,
  BibleVersion,
} from '../models/bible.model';

const ERROR_MESSAGES: Record<number, string> = {
  401: 'Sessão expirada. Por favor, faça login novamente.',
  403: 'Acesso negado ao conteúdo bíblico.',
  404: 'Livro ou capítulo não encontrado.',
  429: 'Limite de requisições atingido. Tente novamente em instantes.',
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

  loadVersions(): Observable<BibleVersion[]> {
    return this.api.getVersions().pipe(
      map((dtos) => dtos.map((dto) => this.mapper.toBibleVersion(dto))),
      catchError(mapHttpError),
    );
  }

  loadBooks(): Observable<BibleBook[]> {
    return this.api.getBooks().pipe(
      map((dtos) => dtos.map((dto) => this.mapper.toBibleBook(dto))),
      catchError(mapHttpError),
    );
  }

  loadBookChapters(bookId: string): Observable<BibleChapter[]> {
    return this.api.getChapters(bookId).pipe(
      map((dtos) => dtos.map((dto) => this.mapper.toBibleChapter(dto))),
      catchError(mapHttpError),
    );
  }

  loadReaderData(
    bookId: string,
    chapterNumber: number,
  ): Observable<BibleReaderData | null> {
    return this.api.getChapterContent(bookId, chapterNumber).pipe(
      map((dto) => this.mapper.toBibleReaderData(dto)),
      catchError(mapHttpError),
    );
  }
}

