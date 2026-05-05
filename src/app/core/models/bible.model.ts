export type Testament = 'OLD_TESTAMENT' | 'NEW_TESTAMENT';

export interface BibleVerse {
  number: number;
  text: string;
}

export interface BibleChapter {
  number: number;
  title?: string;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  order: number;
  name: string;
  abbreviation: string;
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
  bookId: string;
  bookName: string;
  testament: Testament;
  chapterNumber: number;
  chapterTitle?: string;
  previousChapter: ChapterNavRef | null;
  nextChapter: ChapterNavRef | null;
  verses: BibleVerse[];
}
