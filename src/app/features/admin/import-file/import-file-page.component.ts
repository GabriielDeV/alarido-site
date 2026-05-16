import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription, interval, switchMap, takeWhile, tap } from 'rxjs';
import { AppHeaderComponent } from '../../../shared/components/app-header/app-header.component';
import { ImportFileService, ImportMessageMetadata } from './services/import-file.service';
import { SelectedImportFile } from './models/selected-import-file.model';
import { BibliotecaImportacaoResponseDTO, ImportacaoStatus } from '../../../core/models/biblioteca.dto';

@Component({
  selector: 'app-import-file-page',
  standalone: true,
  imports: [AppHeaderComponent, FormsModule],
  templateUrl: './import-file-page.component.html',
  styleUrl: './import-file-page.component.scss',
})
export class ImportFilePageComponent implements OnDestroy {
  private readonly importFileService = inject(ImportFileService);
  private readonly router = inject(Router);
  private pollSub: Subscription | null = null;

  selectedFile = signal<SelectedImportFile | null>(null);
  isDragOver = signal(false);
  isImporting = signal(false);
  importStatus = signal<ImportacaoStatus | null>(null);
  importError = signal<string | null>(null);
  importacaoId = signal<string | null>(null);

  metadata: ImportMessageMetadata = {
    titulo: '',
    autor: 'William Marrion Branham',
    idioma: 'pt-BR',
    dataPregacao: '',
    local: '',
    descricao: '',
  };

  readonly acceptedFormats = '.pdf,.docx';
  readonly rules = [
    'O tamanho máximo do arquivo é 25MB.',
    'Formatos aceitos: PDF e DOCX.',
    'O título da mensagem é obrigatório antes de importar.',
    'A codificação do arquivo deve ser compatível com UTF-8.',
  ];

  get isTitleMissing(): boolean {
    return !this.metadata.titulo.trim();
  }

  get canImport(): boolean {
    return !!this.selectedFile()?.isValid && !this.isImporting() && !this.isTitleMissing;
  }

  get importSuccess(): boolean {
    return this.importStatus() === 'COMPLETED';
  }

  get importFailed(): boolean {
    return this.importStatus() === 'FAILED';
  }

  get isProcessing(): boolean {
    const s = this.importStatus();
    return s === 'PENDING' || s === 'PROCESSING';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.processFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(): void {
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.processFile(file);
  }

  removeFile(): void {
    this.stopPolling();
    this.selectedFile.set(null);
    this.importStatus.set(null);
    this.importError.set(null);
    this.importacaoId.set(null);
  }

  cancel(): void {
    this.removeFile();
    this.router.navigate(['/home']);
  }

  importFile(): void {
    const file = this.selectedFile();
    if (!this.canImport || !file) return;

    this.isImporting.set(true);
    this.importError.set(null);
    this.importStatus.set(null);

    this.importFileService.importMessageFile(file.file, this.metadata).subscribe({
      next: (result) => {
        this.importacaoId.set(result.id);
        this.importStatus.set(result.status);
        if (result.status !== 'COMPLETED' && result.status !== 'FAILED') {
          this.startPolling(result.id);
        } else {
          this.isImporting.set(false);
          if (result.status === 'FAILED') {
            this.importError.set(result.mensagemErro ?? 'Falha na importação.');
          }
        }
      },
      error: () => {
        this.isImporting.set(false);
        this.importError.set('Erro ao enviar o arquivo. Verifique sua conexão e tente novamente.');
      },
    });
  }

  reprocess(): void {
    const id = this.importacaoId();
    if (!id) return;
    this.isImporting.set(true);
    this.importError.set(null);
    this.importStatus.set(null);

    this.importFileService.reprocessImport(id, this.metadata).subscribe({
      next: (result) => {
        this.importStatus.set(result.status);
        if (result.status !== 'COMPLETED' && result.status !== 'FAILED') {
          this.startPolling(result.id);
        } else {
          this.isImporting.set(false);
          if (result.status === 'FAILED') {
            this.importError.set(result.mensagemErro ?? 'Falha na importação.');
          }
        }
      },
      error: () => {
        this.isImporting.set(false);
        this.importError.set('Erro ao reprocessar. Tente novamente.');
      },
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  private processFile(file: File): void {
    this.stopPolling();
    this.importStatus.set(null);
    this.importError.set(null);
    this.importacaoId.set(null);
    this.selectedFile.set(this.importFileService.validateFile(file));
  }

  private startPolling(importacaoId: string): void {
    this.stopPolling();
    this.pollSub = interval(3000)
      .pipe(
        switchMap(() => this.importFileService.getImportStatus(importacaoId)),
        tap((result: BibliotecaImportacaoResponseDTO) => {
          this.importStatus.set(result.status);
          if (result.status === 'FAILED') {
            this.importError.set(result.mensagemErro ?? 'Falha na importação.');
          }
        }),
        takeWhile(
          (result: BibliotecaImportacaoResponseDTO) =>
            result.status !== 'COMPLETED' && result.status !== 'FAILED',
          true,
        ),
      )
      .subscribe({
        complete: () => {
          this.isImporting.set(false);
        },
        error: () => {
          this.isImporting.set(false);
          this.importError.set('Erro ao consultar status da importação.');
        },
      });
  }

  private stopPolling(): void {
    this.pollSub?.unsubscribe();
    this.pollSub = null;
  }
}
