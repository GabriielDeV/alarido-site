import { Component, OnInit, OnDestroy, signal, computed, inject, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { ReaderControlsComponent } from '../../../../shared/components/reader-controls/reader-controls.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BibleService } from '../../../../core/services/bible.service';
import { ReadingPreferenceService } from '../../../../core/services/reading-preference.service';
import { BibleReaderData } from '../../../../core/models/bible.model';

@Component({
  selector: 'app-bible-reader-page',
  standalone: true,
  imports: [AppHeaderComponent, ReaderControlsComponent, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './bible-reader-page.component.html',
  styleUrl: './bible-reader-page.component.scss',
})
export class BibleReaderPageComponent implements OnInit {
  private bibleService = inject(BibleService);
  private prefService = inject(ReadingPreferenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  readerData = signal<BibleReaderData | null>(null);

  get fontSize(): number {
    return this.prefService.preference().fontSize;
  }

  testamentLabel = computed(() => {
    const data = this.readerData();
    if (!data) return '';
    return data.testament === 'OLD_TESTAMENT' ? 'Antigo Testamento' : 'Novo Testamento';
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
    this.bibleService.getReaderData(bookId, chapterNumber).subscribe((data) => {
      this.readerData.set(data);
      this.loading.set(false);
      if (data) {
        this.prefService.saveProgress({
          contentType: 'BIBLE',
          bookId: data.bookId,
          chapterNumber: data.chapterNumber,
          lastReadAt: new Date().toISOString(),
        });
      }
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
