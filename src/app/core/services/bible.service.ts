import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BibleBook, BibleReaderData, Testament } from '../models/bible.model';
import { BIBLE_BOOKS } from '../../data/bible.mock';

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

    const sortedChapters = [...book.chapters].sort((a, b) => a.number - b.number);
    const currentIndex = sortedChapters.findIndex((c) => c.number === chapterNumber);

    const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

    return of({
      bookId: book.id,
      bookName: book.name,
      testament: book.testament,
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      previousChapter: prevChapter
        ? { bookId: book.id, chapterNumber: prevChapter.number, label: `${book.name} ${prevChapter.number}` }
        : null,
      nextChapter: nextChapter
        ? { bookId: book.id, chapterNumber: nextChapter.number, label: `${book.name} ${nextChapter.number}` }
        : null,
      verses: chapter.verses,
    });
  }

  searchBooks(query: string): Observable<BibleBook[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of(this.books);
    return of(this.books.filter((b) => b.name.toLowerCase().includes(q) || b.abbreviation.toLowerCase().includes(q)));
  }
}
