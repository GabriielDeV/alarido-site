import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { ReaderControlsComponent } from '../../../../shared/components/reader-controls/reader-controls.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { MessageService } from '../../../../core/services/message.service';
import { ReadingPreferenceService } from '../../../../core/services/reading-preference.service';
import { MessageReaderData } from '../../../../core/models/message.model';

@Component({
  selector: 'app-message-reader-page',
  standalone: true,
  imports: [AppHeaderComponent, ReaderControlsComponent, LoadingStateComponent, EmptyStateComponent],
  templateUrl: './message-reader-page.component.html',
  styleUrl: './message-reader-page.component.scss',
})
export class MessageReaderPageComponent implements OnInit {
  private messageService = inject(MessageService);
  private prefService = inject(ReadingPreferenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = signal(true);
  readerData = signal<MessageReaderData | null>(null);

  get fontSize(): number {
    return this.prefService.preference().fontSize;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const messageId = params.get('messageId') ?? '';
      this.loadMessage(messageId);
    });
  }

  private loadMessage(id: string): void {
    this.loading.set(true);
    this.messageService.getReaderData(id).subscribe((data) => {
      this.readerData.set(data);
      this.loading.set(false);
      if (data) {
        this.prefService.saveProgress({
          contentType: 'MESSAGE',
          messageId: data.messageId,
          lastReadAt: new Date().toISOString(),
        });
      }
    });
  }

  navigateToPrev(): void {
    const prev = this.readerData()?.previousMessage;
    if (prev) this.router.navigate(['/mensagens', prev.id]);
  }

  navigateToNext(): void {
    const next = this.readerData()?.nextMessage;
    if (next) this.router.navigate(['/mensagens', next.id]);
  }
}
