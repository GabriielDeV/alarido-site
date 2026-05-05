import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="empty-state">
      <span class="material-symbols-outlined empty-state__icon">search_off</span>
      <h3 class="empty-state__title">{{ title }}</h3>
      <p class="empty-state__description">{{ description }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      gap: 12px;

      &__icon {
        font-size: 48px;
        color: var(--color-outline);
        margin-bottom: 8px;
      }

      &__title {
        font-family: var(--font-ui);
        font-size: 18px;
        font-weight: 600;
        color: var(--color-on-surface);
      }

      &__description {
        font-family: var(--font-ui);
        font-size: 14px;
        color: var(--color-on-surface-variant);
        max-width: 280px;
      }
    }
  `],
})
export class EmptyStateComponent {
  @Input() title = 'Nenhum conteúdo encontrado';
  @Input() description = 'Tente alterar os filtros ou buscar por outro termo.';
}
