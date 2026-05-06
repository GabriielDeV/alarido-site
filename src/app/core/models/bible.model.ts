export type Testament = 'OLD_TESTAMENT' | 'NEW_TESTAMENT';

export interface BibleChapter {
  id: string;        // "MAT.1"
  number: number;
  reference: string; // "Matthew 1"
}

export interface BibleBook {
  id: string;           // "MAT" — API.Bible book ID
  order: number;
  name: string;
  nameLong: string;
  abbreviation: string; // "Mt"
  testament: Testament;
  totalChapters: number;
  chapters: BibleChapter[];
}

export interface ChapterNavRef {
  bookId: string;
  chapterNumber: number;
  label: string;
}

export interface BibleReaderData {
  bibleId: string;
  bookId: string;
  bookName: string;
  testament: Testament;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  contentHtml: string;
  copyright: string;
  previousChapter: ChapterNavRef | null;
  nextChapter: ChapterNavRef | null;
}

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}
