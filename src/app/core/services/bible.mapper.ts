import { Injectable } from '@angular/core';
import {
  AlaridoBibleVersionDto,
  AlaridoBibleBookDto,
  AlaridoBibleChapterDto,
  AlaridoBibleReaderDto,
} from '../models/bible-api.dto';
import {
  BibleBook,
  BibleChapter,
  BibleReaderData,
  BibleVersion,
  ChapterNavRef,
  Testament,
} from '../models/bible.model';

@Injectable({ providedIn: 'root' })
export class BibleMapper {
  toBibleVersion(dto: AlaridoBibleVersionDto): BibleVersion {
    return {
      id: dto.id,
      name: dto.name,
      abbreviation: dto.abbreviation,
      language: dto.language,
    };
  }

  toBibleBook(dto: AlaridoBibleBookDto): BibleBook {
    return {
      id: dto.id,
      order: dto.order,
      name: dto.name,
      nameLong: dto.nameLong,
      abbreviation: dto.abbreviation,
      testament: dto.testament as Testament,
      totalChapters: 0,
      chapters: [],
    };
  }

  toBibleChapter(dto: AlaridoBibleChapterDto): BibleChapter {
    return {
      id: dto.id,
      number: dto.number,
      reference: dto.reference,
    };
  }

  toBibleReaderData(dto: AlaridoBibleReaderDto): BibleReaderData {
    const previousChapter: ChapterNavRef | null = dto.previousChapter
      ? {
          bookId: dto.previousChapter.bookId,
          chapterNumber: dto.previousChapter.chapterNumber,
          label: dto.previousChapter.label,
        }
      : null;

    const nextChapter: ChapterNavRef | null = dto.nextChapter
      ? {
          bookId: dto.nextChapter.bookId,
          chapterNumber: dto.nextChapter.chapterNumber,
          label: dto.nextChapter.label,
        }
      : null;

    return {
      bibleId: dto.bibleId,
      bookId: dto.bookId,
      bookName: dto.bookName,
      testament: dto.testament as Testament,
      chapterId: dto.chapterId,
      chapterNumber: dto.chapterNumber,
      chapterTitle: dto.reference,
      contentHtml: dto.contentHtml,
      copyright: dto.copyright,
      previousChapter,
      nextChapter,
    };
  }
}

