export interface SelectedImportFile {
  file: File;
  name: string;
  size: number;
  sizeFormatted: string;
  extension: string;
  isValid: boolean;
  errorMessage: string | null;
}
