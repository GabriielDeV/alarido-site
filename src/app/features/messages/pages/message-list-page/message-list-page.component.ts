import { Component, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { MessageService } from '../../../../core/services/message.service';
import { Message } from '../../../../core/models/message.model';

@Component({
  selector: 'app-message-list-page',
  standalone: true,
  imports: [AppHeaderComponent, BottomNavComponent, LoadingStateComponent, EmptyStateComponent, FormsModule],
  templateUrl: './message-list-page.component.html',
  styleUrl: './message-list-page.component.scss',
})
export class MessageListPageComponent implements OnInit {
  loading = signal(true);
  searchQuery = signal('');
  allMessages = signal<Message[]>([]);

  filteredMessages = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.allMessages();
    return this.allMessages().filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.formattedDate.toLowerCase().includes(q),
    );
  });

  constructor(private messageService: MessageService, private router: Router) {}

  ngOnInit(): void {
    this.messageService.getAllMessages().subscribe((messages) => {
      this.allMessages.set(messages);
      this.loading.set(false);
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  openMessage(messageId: string): void {
    this.router.navigate(['/mensagens', messageId]);
  }
}
