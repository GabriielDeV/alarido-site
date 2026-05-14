import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AlaridoBibleVersionDto,
  AlaridoBibleBookDto,
  AlaridoBibleChapterDto,
  AlaridoBibleReaderDto,
} from '../models/bible-api.dto';

export interface BibleChapterContentOptions {
  bibleId?: string;
  contentType?: string;
  includeNotes?: boolean;
  includeTitles?: boolean;
  includeChapterNumbers?: boolean;
  includeVerseNumbers?: boolean;
  includeVerseSpans?: boolean;
}

@Injectable({ providedIn: 'root' })
export class BibleApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/bible`;
  private readonly defaultBibleId = environment.bible.defaultBibleId;

  private booksCache = new Map<string, Observable<AlaridoBibleBookDto[]>>();
  private chaptersCache = new Map<string, Observable<AlaridoBibleChapterDto[]>>();

  getVersions(language = 'por'): Observable<AlaridoBibleVersionDto[]> {
    return this.http.get<AlaridoBibleVersionDto[]>(`${this.baseUrl}/versions`, {
      params: { language },
    });
  }

  getBooks(bibleId = this.defaultBibleId): Observable<AlaridoBibleBookDto[]> {
    if (!this.booksCache.has(bibleId)) {
      this.booksCache.set(
        bibleId,
        this.http
          .get<AlaridoBibleBookDto[]>(`${this.baseUrl}/books`, {
            params: new HttpParams().set('bibleId', bibleId),
          })
          .pipe(shareReplay(1)),
      );
    }
    return this.booksCache.get(bibleId)!;
  }

  getChapters(bookId: string, bibleId = this.defaultBibleId): Observable<AlaridoBibleChapterDto[]> {
    const cacheKey = `${bibleId}:${bookId}`;
    if (!this.chaptersCache.has(cacheKey)) {
      this.chaptersCache.set(
        cacheKey,
        this.http
          .get<AlaridoBibleChapterDto[]>(`${this.baseUrl}/books/${bookId}/chapters`, {
            params: new HttpParams().set('bibleId', bibleId),
          })
          .pipe(shareReplay(1)),
      );
    }
    return this.chaptersCache.get(cacheKey)!;
  }

  getChapterContent(
    bookId: string,
    chapterNumber: number,
    options: BibleChapterContentOptions = {},
  ): Observable<AlaridoBibleReaderDto> {
    let params = new HttpParams().set('bibleId', options.bibleId ?? this.defaultBibleId);
    if (options.contentType) params = params.set('contentType', options.contentType);
    if (options.includeNotes != null) params = params.set('includeNotes', String(options.includeNotes));
    if (options.includeTitles != null) params = params.set('includeTitles', String(options.includeTitles));
    if (options.includeChapterNumbers != null) params = params.set('includeChapterNumbers', String(options.includeChapterNumbers));
    if (options.includeVerseNumbers != null) params = params.set('includeVerseNumbers', String(options.includeVerseNumbers));
    if (options.includeVerseSpans != null) params = params.set('includeVerseSpans', String(options.includeVerseSpans));

    return this.http.get<AlaridoBibleReaderDto>(
      `${this.baseUrl}/books/${bookId}/chapters/${chapterNumber}`,
      { params },
    );
  }
}

