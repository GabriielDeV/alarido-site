export interface MessageParagraph {
  number: number;
  text: string;
}

export interface MessageNavRef {
  id: string;
  title: string;
}

export interface Message {
  id: string;
  slug: string;
  title: string;
  preachedDate: string;
  formattedDate: string;
  location: string;
  summary: string;
  paragraphs: MessageParagraph[];
}

export interface MessageReaderData {
  messageId: string;
  title: string;
  preachedDate: string;
  formattedDate: string;
  location: string;
  previousMessage: MessageNavRef | null;
  nextMessage: MessageNavRef | null;
  paragraphs: MessageParagraph[];
}
