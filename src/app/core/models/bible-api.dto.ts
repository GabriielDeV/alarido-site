// ─── DTOs for API.Bible ────────────────────────────────────────────────────────

export interface ApiBibleResponseDto<T> {
  data: T;
}

export interface ApiBibleLanguageDto {
  id: string;
  name: string;
  nameLocal: string;
  script: string;
  scriptDirection: string;
}

export interface ApiBibleDto {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  language: ApiBibleLanguageDto;
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
}

/** A book entry returned by GET /bibles/{id}/books */
export interface ApiBibleBookDto {
  id: string;          // "MAT"
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

/** A chapter entry returned by GET /bibles/{id}/books/{bookId}/chapters */
export interface ApiBibleChapterDto {
  id: string;          // "MAT.1"
  bibleId: string;
  bookId: string;      // "MAT"
  number: string;      // "1" (string from API)
  reference: string;   // "Matthew 1"
}

/** Chapter content returned by GET /bibles/{id}/chapters/{chapterId} */
export interface ApiBibleChapterContentDto {
  id: string;          // "MAT.1"
  bibleId: string;
  number: string;      // "1"
  bookId: string;      // "MAT"
  reference: string;   // "Matthew 1"
  content: string;     // HTML
  copyright: string;
}
