import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { BibliotecaImportacaoResponseDTO } from '../../../../core/models/biblioteca.dto';
import { SelectedImportFile } from '../models/selected-import-file.model';

const ALLOWED_EXTENSIONS = ['pdf', 'docx'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export interface ImportMessageMetadata {
  titulo: string;
  tituloOriginal?: string;
  autor?: string;
  codigo?: string;
  idioma?: string;
  colecaoId?: string | null;
  dataPregacao?: string;
  local?: string;
  descricao?: string;
}

@Injectable({ providedIn: 'root' })
export class ImportFileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/api/admin/biblioteca/importacoes`;

  validateFile(file: File): SelectedImportFile {
    const name = file.name;
    const size = file.size;
    const extension = name.split('.').pop()?.toLowerCase() ?? '';
    const sizeFormatted = this.formatSize(size);

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return { file, name, size, sizeFormatted, extension, isValid: false, errorMessage: 'Formato de arquivo não permitido. Use PDF ou DOCX.' };
    }

    if (size === 0) {
      return { file, name, size, sizeFormatted, extension, isValid: false, errorMessage: 'O arquivo selecionado está vazio.' };
    }

    if (size > MAX_SIZE_BYTES) {
      return { file, name, size, sizeFormatted, extension, isValid: false, errorMessage: 'O arquivo ultrapassa o tamanho máximo permitido de 25MB.' };
    }

    return { file, name, size, sizeFormatted, extension, isValid: true, errorMessage: null };
  }

  importMessageFile(
    file: File,
    metadata: ImportMessageMetadata,
  ): Observable<BibliotecaImportacaoResponseDTO> {
    const form = new FormData();
    form.append('file', file, file.name);
    form.append('tipoObra', 'MESSAGE');
    form.append('titulo', metadata.titulo);
    if (metadata.tituloOriginal) form.append('tituloOriginal', metadata.tituloOriginal);
    form.append('autor', metadata.autor ?? 'William Marrion Branham');
    if (metadata.codigo) form.append('codigo', metadata.codigo);
    form.append('idioma', metadata.idioma ?? 'pt-BR');
    if (metadata.colecaoId) form.append('colecaoId', metadata.colecaoId);
    if (metadata.dataPregacao) form.append('dataPregacao', metadata.dataPregacao);
    if (metadata.local) form.append('local', metadata.local);
    if (metadata.descricao) form.append('descricao', metadata.descricao);
    return this.http.post<BibliotecaImportacaoResponseDTO>(this.baseUrl, form);
  }

  getImportStatus(importacaoId: string): Observable<BibliotecaImportacaoResponseDTO> {
    return this.http.get<BibliotecaImportacaoResponseDTO>(`${this.baseUrl}/${importacaoId}`);
  }

  reprocessImport(importacaoId: string, metadata: ImportMessageMetadata): Observable<BibliotecaImportacaoResponseDTO> {
    const form = new FormData();
    form.append('tipoObra', 'MESSAGE');
    form.append('titulo', metadata.titulo);
    if (metadata.tituloOriginal) form.append('tituloOriginal', metadata.tituloOriginal);
    form.append('autor', metadata.autor ?? 'William Marrion Branham');
    if (metadata.codigo) form.append('codigo', metadata.codigo);
    form.append('idioma', metadata.idioma ?? 'pt-BR');
    if (metadata.colecaoId) form.append('colecaoId', metadata.colecaoId);
    if (metadata.dataPregacao) form.append('dataPregacao', metadata.dataPregacao);
    if (metadata.local) form.append('local', metadata.local);
    if (metadata.descricao) form.append('descricao', metadata.descricao);
    return this.http.post<BibliotecaImportacaoResponseDTO>(`${this.baseUrl}/${importacaoId}/reprocessar`, form);
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

