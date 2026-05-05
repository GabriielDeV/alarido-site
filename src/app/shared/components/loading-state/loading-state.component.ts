import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: `
    <div class="loading-state">
      <div class="loading-state__spinner"></div>
      <p class="loading-state__text">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      gap: 16px;

      &__spinner {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-outline-variant);
        border-top-color: var(--color-secondary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      &__text {
        font-family: var(--font-ui);
        font-size: 14px;
        color: var(--color-on-surface-variant);
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingStateComponent {
  @Input() message = 'Carregando...';
}
