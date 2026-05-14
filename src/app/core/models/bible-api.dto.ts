// ─── DTOs for Alarido Bible API (/api/bible) ─────────────────────────────────

export interface AlaridoBibleVersionDto {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
}

export interface AlaridoBibleBookDto {
  id: string;
  order: number;
  name: string;
  nameLong: string;
  abbreviation: string;
  testament: string;
}

export interface AlaridoBibleChapterDto {
  id: string;
  bookId: string;
  number: number;
  reference: string;
}

export interface AlaridoBibleNavigationDto {
  bookId: string;
  chapterNumber: number;
  label: string;
}

export interface AlaridoBibleReaderDto {
  bibleId: string;
  bookId: string;
  bookName: string;
  testament: string;
  chapterId: string;
  chapterNumber: number;
  reference: string;
  contentHtml: string;
  copyright: string;
  previousChapter: AlaridoBibleNavigationDto | null;
  nextChapter: AlaridoBibleNavigationDto | null;
}
