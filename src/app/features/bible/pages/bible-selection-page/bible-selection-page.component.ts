import { Component, OnInit, signal, computed, inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BibleFacadeService } from '../../../../core/services/bible-facade.service';
import { BibleBook, BibleChapter } from '../../../../core/models/bible.model';

@Component({
  selector: 'app-bible-selection-page',
  standalone: true,
  imports: [
    AppHeaderComponent,
    BottomNavComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    FormsModule,
  ],
  templateUrl: './bible-selection-page.component.html',
  styleUrl: './bible-selection-page.component.scss',
})
export class BibleSelectionPageComponent implements OnInit {
  private bibleFacade = inject(BibleFacadeService);
  private router = inject(Router);

  @ViewChild('chapterSelector') chapterSelector?: ElementRef<HTMLElement>;

  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal('');
  allBooks = signal<BibleBook[]>([]);
  selectedBookId = signal<string | null>(null);
  loadingChapters = signal(false);
  chapters = signal<BibleChapter[]>([]);

  filteredOldTestament = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.allBooks()
      .filter((b) => b.testament === 'OLD_TESTAMENT')
      .filter((b) => !q || b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  });

  filteredNewTestament = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.allBooks()
      .filter((b) => b.testament === 'NEW_TESTAMENT')
      .filter((b) => !q || b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
  });

  selectedBook = computed(() => this.allBooks().find((b) => b.id === this.selectedBookId()));

  hasResults = computed(
    () =>
      this.filteredOldTestament().length > 0 || this.filteredNewTestament().length > 0,
  );

  ngOnInit(): void {
    this.bibleFacade.loadBooks().subscribe({
      next: (books) => {
        this.allBooks.set(books);
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(
          err?.message ?? 'Não foi possível carregar a Bíblia. Verifique sua conexão e tente novamente.',
        );
        this.loading.set(false);
      },
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.selectedBookId.set(null);
    this.chapters.set([]);
  }

  selectBook(bookId: string): void {
    if (this.selectedBookId() === bookId) {
      this.selectedBookId.set(null);
      this.chapters.set([]);
      return;
    }
    this.selectedBookId.set(bookId);
    this.chapters.set([]);
    this.loadingChapters.set(true);
    this.scrollToChapterSelector();
    this.bibleFacade.loadBookChapters(bookId).subscribe({
      next: (chapters) => {
        const valid = chapters.filter(
          (c) => Number.isFinite(Number(c.number)) && Number(c.number) > 0,
        );
        this.chapters.set(valid);
        this.loadingChapters.set(false);
      },
      error: (err: Error) => {
        this.error.set(err?.message ?? 'Não foi possível carregar os capítulos.');
        this.loadingChapters.set(false);
      },
    });
  }

  private scrollToChapterSelector(): void {
    setTimeout(() => {
      this.chapterSelector?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  selectChapter(chapter: BibleChapter): void {
    const bookId = this.selectedBookId();
    if (!bookId) return;
    this.router.navigate(['/biblia', bookId, chapter.number]);
  }

  getOldTestamentCount(): number {
    return this.allBooks().filter((b) => b.testament === 'OLD_TESTAMENT').length;
  }

  getNewTestamentCount(): number {
    return this.allBooks().filter((b) => b.testament === 'NEW_TESTAMENT').length;
  }
}
