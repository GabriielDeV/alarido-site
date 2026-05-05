import { Component, inject } from '@angular/core';
import { ReadingPreferenceService } from '../../../core/services/reading-preference.service';

@Component({
  selector: 'app-reader-controls',
  standalone: true,
  templateUrl: './reader-controls.component.html',
  styleUrl: './reader-controls.component.scss',
})
export class ReaderControlsComponent {
  prefService = inject(ReadingPreferenceService);

  get fontSize(): number {
    return this.prefService.preference().fontSize;
  }

  decrease(): void {
    this.prefService.decreaseFontSize();
  }

  increase(): void {
    this.prefService.increaseFontSize();
  }
}
