import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiBibleResponseDto,
  ApiBibleDto,
  ApiBibleBookDto,
  ApiBibleChapterDto,
  ApiBibleChapterContentDto,
} from '../models/bible-api.dto';

@Injectable({ providedIn: 'root' })
export class BibleApiService {
  private http = inject(HttpClient);
  private cfg = environment.apiBible;
  private headers = new HttpHeaders({ 'api-key': this.cfg.apiKey });

  private booksCache = new Map<string, Observable<ApiBibleResponseDto<ApiBibleBookDto[]>>>();
  private chaptersCache = new Map<string, Observable<ApiBibleResponseDto<ApiBibleChapterDto[]>>>();

  getPortugueseBibles(): Observable<ApiBibleResponseDto<ApiBibleDto[]>> {
    return this.http.get<ApiBibleResponseDto<ApiBibleDto[]>>(
      `${this.cfg.baseUrl}/bibles`,
      { headers: this.headers, params: { language: this.cfg.defaultLanguage } },
    );
  }

  getBooks(bibleId: string): Observable<ApiBibleResponseDto<ApiBibleBookDto[]>> {
    if (!this.booksCache.has(bibleId)) {
      this.booksCache.set(
        bibleId,
        this.http
          .get<ApiBibleResponseDto<ApiBibleBookDto[]>>(
            `${this.cfg.baseUrl}/bibles/${bibleId}/books`,
            { headers: this.headers },
          )
          .pipe(shareReplay(1)),
      );
    }
    return this.booksCache.get(bibleId)!;
  }

  getChapters(
    bibleId: string,
    bookId: string,
  ): Observable<ApiBibleResponseDto<ApiBibleChapterDto[]>> {
    const key = `${bibleId}:${bookId}`;
    if (!this.chaptersCache.has(key)) {
      this.chaptersCache.set(
        key,
        this.http
          .get<ApiBibleResponseDto<ApiBibleChapterDto[]>>(
            `${this.cfg.baseUrl}/bibles/${bibleId}/books/${bookId}/chapters`,
            { headers: this.headers },
          )
          .pipe(shareReplay(1)),
      );
    }
    return this.chaptersCache.get(key)!;
  }

  getChapterContent(
    bibleId: string,
    chapterId: string,
  ): Observable<ApiBibleResponseDto<ApiBibleChapterContentDto>> {
    const params = {
      'content-type': this.cfg.defaultContentType,
      'include-notes': 'false',
      'include-titles': 'true',
      'include-chapter-numbers': 'false',
      'include-verse-numbers': 'true',
      'include-verse-spans': 'true',
    };
    return this.http.get<ApiBibleResponseDto<ApiBibleChapterContentDto>>(
      `${this.cfg.baseUrl}/bibles/${bibleId}/chapters/${chapterId}`,
      { headers: this.headers, params },
    );
  }
}
