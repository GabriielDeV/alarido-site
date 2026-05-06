import { Injectable } from '@angular/core';
import {
  ApiBibleDto,
  ApiBibleBookDto,
  ApiBibleChapterDto,
  ApiBibleChapterContentDto,
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
  toBibleVersion(dto: ApiBibleDto): BibleVersion {
    return {
      id: dto.id,
      name: dto.nameLocal || dto.name,
      abbreviation: dto.abbreviationLocal || dto.abbreviation,
      language: dto.language.id,
    };
  }

  toBibleBook(
    dto: ApiBibleBookDto,
    order: number,
    chapters: BibleChapter[],
  ): BibleBook {
    const testament: Testament = order <= 39 ? 'OLD_TESTAMENT' : 'NEW_TESTAMENT';
    return {
      id: dto.id,
      order,
      name: dto.name,
      nameLong: dto.nameLong,
      abbreviation: dto.abbreviation,
      testament,
      totalChapters: chapters.length,
      chapters,
    };
  }

  toBibleChapter(dto: ApiBibleChapterDto): BibleChapter {
    return {
      id: dto.id,
      number: parseInt(dto.number, 10),
      reference: dto.reference,
    };
  }

  toBibleReaderData(
    contentDto: ApiBibleChapterContentDto,
    book: BibleBook,
    chapters: BibleChapter[],
  ): BibleReaderData {
    const chapterNumber = parseInt(contentDto.number, 10);
    const chapterIndex = chapters.findIndex((c) => c.id === contentDto.id);

    const previousChapter: ChapterNavRef | null =
      chapterIndex > 0
        ? {
            bookId: book.id,
            chapterNumber: chapters[chapterIndex - 1].number,
            label: chapters[chapterIndex - 1].reference,
          }
        : null;

    const nextChapter: ChapterNavRef | null =
      chapterIndex >= 0 && chapterIndex < chapters.length - 1
        ? {
            bookId: book.id,
            chapterNumber: chapters[chapterIndex + 1].number,
            label: chapters[chapterIndex + 1].reference,
          }
        : null;

    return {
      bibleId: contentDto.bibleId,
      bookId: contentDto.bookId,
      bookName: book.name,
      testament: book.testament,
      chapterId: contentDto.id,
      chapterNumber,
      chapterTitle: contentDto.reference,
      contentHtml: contentDto.content,
      copyright: contentDto.copyright,
      previousChapter,
      nextChapter,
    };
  }
}
