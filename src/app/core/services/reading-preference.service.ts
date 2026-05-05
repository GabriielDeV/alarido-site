import { Injectable, signal, effect } from '@angular/core';
import {
  ReadingPreference,
  ReadingProgress,
  DEFAULT_READING_PREFERENCE,
} from '../models/reading-preference.model';

const PREF_KEY = 'alarido_reading_preference';
const PROGRESS_KEY = 'alarido_reading_progress';

@Injectable({ providedIn: 'root' })
export class ReadingPreferenceService {
  preference = signal<ReadingPreference>(this.loadPreference());
  progress = signal<ReadingProgress | null>(this.loadProgress());

  constructor() {
    effect(() => {
      localStorage.setItem(PREF_KEY, JSON.stringify(this.preference()));
    });
    effect(() => {
      const p = this.progress();
      if (p) localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
    });
  }

  increaseFontSize(): void {
    this.preference.update((p) => ({ ...p, fontSize: Math.min(p.fontSize + 10, 160) }));
  }

  decreaseFontSize(): void {
    this.preference.update((p) => ({ ...p, fontSize: Math.max(p.fontSize - 10, 70) }));
  }

  resetFontSize(): void {
    this.preference.update((p) => ({ ...p, fontSize: 100 }));
  }

  saveProgress(progress: ReadingProgress): void {
    this.progress.set({ ...progress, lastReadAt: new Date().toISOString() });
  }

  private loadPreference(): ReadingPreference {
    try {
      const stored = localStorage.getItem(PREF_KEY);
      return stored ? (JSON.parse(stored) as ReadingPreference) : { ...DEFAULT_READING_PREFERENCE };
    } catch {
      return { ...DEFAULT_READING_PREFERENCE };
    }
  }

  private loadProgress(): ReadingProgress | null {
    try {
      const stored = localStorage.getItem(PROGRESS_KEY);
      return stored ? (JSON.parse(stored) as ReadingProgress) : null;
    } catch {
      return null;
    }
  }
}
