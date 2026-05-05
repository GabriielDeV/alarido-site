export type ContentType = 'BIBLE' | 'MESSAGE';

export interface ReadingPreference {
  theme: 'dark' | 'light';
  fontSize: number; // percentage, default 100
  fontFamily: string;
  lineHeight: number;
}

export interface ReadingProgress {
  contentType: ContentType;
  bookId?: string;
  chapterNumber?: number;
  messageId?: string;
  lastReadAt: string;
}

export const DEFAULT_READING_PREFERENCE: ReadingPreference = {
  theme: 'dark',
  fontSize: 100,
  fontFamily: 'Newsreader',
  lineHeight: 1.7,
};
