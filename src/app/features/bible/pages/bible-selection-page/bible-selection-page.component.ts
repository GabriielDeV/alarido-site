import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BibleService } from '../../../../core/services/bible.service';
import { BibleBook } from '../../../../core/models/bible.model';

@Component({
  selector: 'app-bible-selection-page',
  standalone: true,
  imports: [AppHeaderComponent, BottomNavComponent, LoadingStateComponent, EmptyStateComponent, FormsModule],
  templateUrl: './bible-selection-page.component.html',
  styleUrl: './bible-selection-page.component.scss',
})
export class BibleSelectionPageComponent implements OnInit {
  loading = signal(true);
  searchQuery = signal('');
  allBooks = signal<BibleBook[]>([]);
  selectedBookId = signal<string | null>(null);

  filteredOldTestament = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.allBooks()
      .filter((b) => b.testament === 'OLD_TESTAMENT')
      .filter((b) => !q || b.name.toLowerCase().includes(q) || b.abbreviation.toLowerCase().includes(q));
  });

  filteredNewTestament = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    return this.allBooks()
      .filter((b) => b.testament === 'NEW_TESTAMENT')
      .filter((b) => !q || b.name.toLowerCase().includes(q) || b.abbreviation.toLowerCase().includes(q));
  });

  selectedBook = computed(() =>
    this.allBooks().find((b) => b.id === this.selectedBookId()),
  );

  hasResults = computed(
    () => this.filteredOldTestament().length > 0 || this.filteredNewTestament().length > 0,
  );

  constructor(private bibleService: BibleService, private router: Router) {}

  ngOnInit(): void {
    this.bibleService.getAllBooks().subscribe((books) => {
      this.allBooks.set(books);
      this.loading.set(false);
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.selectedBookId.set(null);
  }

  selectBook(bookId: string): void {
    this.selectedBookId.set(this.selectedBookId() === bookId ? null : bookId);
  }

  selectChapter(chapterNumber: number): void {
    const bookId = this.selectedBookId();
    if (!bookId) return;
    this.router.navigate(['/biblia', bookId, chapterNumber]);
  }

  getOldTestamentCount(): number {
    return this.allBooks().filter((b) => b.testament === 'OLD_TESTAMENT').length;
  }

  getNewTestamentCount(): number {
    return this.allBooks().filter((b) => b.testament === 'NEW_TESTAMENT').length;
  }
}
