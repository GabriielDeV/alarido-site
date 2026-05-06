import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BibleBook, BibleReaderData, Testament } from '../models/bible.model';
import { BIBLE_BOOKS } from '../../data/bible.mock';

/**
 * @deprecated Use BibleFacadeService for API-backed data.
 * This service is kept as an optional fallback/reference only.
 */
@Injectable({ providedIn: 'root' })
export class BibleService {
  private books: BibleBook[] = BIBLE_BOOKS;

  getAllBooks(): Observable<BibleBook[]> {
    return of(this.books);
  }

  getBooksByTestament(testament: Testament): Observable<BibleBook[]> {
    return of(this.books.filter((b) => b.testament === testament));
  }

  getBookById(id: string): Observable<BibleBook | undefined> {
    return of(this.books.find((b) => b.id === id));
  }

  getReaderData(bookId: string, chapterNumber: number): Observable<BibleReaderData | null> {
    const book = this.books.find((b) => b.id === bookId);
    if (!book) return of(null);

    const chapter = book.chapters.find((c) => c.number === chapterNumber);
    if (!chapter) return of(null);

    const prevChapter = chapterNumber > 1 ? book.chapters[chapterNumber - 2] : null;
    const nextChapter = chapterNumber < book.totalChapters ? book.chapters[chapterNumber] : null;

    return of({
      bibleId: 'mock',
      bookId: book.id,
      bookName: book.name,
      testament: book.testament,
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      chapterTitle: chapter.reference,
      contentHtml: '',
      copyright: '',
      previousChapter: prevChapter
        ? { bookId: book.id, chapterNumber: prevChapter.number, label: prevChapter.reference }
        : null,
      nextChapter: nextChapter
        ? { bookId: book.id, chapterNumber: nextChapter.number, label: nextChapter.reference }
        : null,
    });
  }

  searchBooks(query: string): Observable<BibleBook[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of(this.books);
    return of(
      this.books.filter(
        (b) => b.name.toLowerCase().includes(q) || b.abbreviation.toLowerCase().includes(q),
      ),
    );
  }
}
