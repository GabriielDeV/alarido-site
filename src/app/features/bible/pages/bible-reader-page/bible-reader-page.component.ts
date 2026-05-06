import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { ReaderControlsComponent } from '../../../../shared/components/reader-controls/reader-controls.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BibleFacadeService } from '../../../../core/services/bible-facade.service';
import { ReadingPreferenceService } from '../../../../core/services/reading-preference.service';
import { BibleReaderData } from '../../../../core/models/bible.model';

@Component({
  selector: 'app-bible-reader-page',
  standalone: true,
  imports: [
    AppHeaderComponent,
    ReaderControlsComponent,
    LoadingStateComponent,
    EmptyStateComponent,
  ],
  templateUrl: './bible-reader-page.component.html',
  styleUrl: './bible-reader-page.component.scss',
})
export class BibleReaderPageComponent implements OnInit {
  private bibleFacade = inject(BibleFacadeService);
  private prefService = inject(ReadingPreferenceService);
  private sanitizer = inject(DomSanitizer);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  error = signal<string | null>(null);
  readerData = signal<BibleReaderData | null>(null);

  get fontSize(): number {
    return this.prefService.preference().fontSize;
  }

  testamentLabel = computed(() => {
    const data = this.readerData();
    if (!data) return '';
    return data.testament === 'OLD_TESTAMENT' ? 'Antigo Testamento' : 'Novo Testamento';
  });

  safeContentHtml = computed((): SafeHtml => {
    const data = this.readerData();
    if (!data?.contentHtml) return '';
    return this.sanitizer.bypassSecurityTrustHtml(data.contentHtml);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const bookId = params.get('bookId') ?? '';
      const chapterNumber = Number(params.get('chapterNumber') ?? 1);
      this.loadChapter(bookId, chapterNumber);
    });
  }

  private loadChapter(bookId: string, chapterNumber: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.bibleFacade.loadReaderData(bookId, chapterNumber).subscribe({
      next: (data) => {
        this.readerData.set(data);
        this.loading.set(false);
        if (data) {
          this.prefService.saveProgress({
            contentType: 'BIBLE',
            bibleId: data.bibleId,
            bookId: data.bookId,
            chapterId: data.chapterId,
            chapterNumber: data.chapterNumber,
            lastReadAt: new Date().toISOString(),
          });
        }
      },
      error: (err: Error) => {
        this.error.set(
          err?.message ?? 'Não foi possível carregar este capítulo. Verifique sua conexão.',
        );
        this.loading.set(false);
      },
    });
  }

  navigateToPrev(): void {
    const prev = this.readerData()?.previousChapter;
    if (prev) this.router.navigate(['/biblia', prev.bookId, prev.chapterNumber]);
  }

  navigateToNext(): void {
    const next = this.readerData()?.nextChapter;
    if (next) this.router.navigate(['/biblia', next.bookId, next.chapterNumber]);
  }

  goBack(): void {
    this.router.navigate(['/biblia']);
  }
}
