import { Component, Input, HostListener, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/auth/auth.service';
import { AppUserResponseDTO } from '../../../core/auth/models/app-user-response.dto';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss',
})
export class AppHeaderComponent {
  @Input() title = 'Alarido';
  @Input() showBack = false;
  @Input() backRoute: string | null = null;
  @Input() showLogout = false;
  @Input() showSettings = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isSettingsModalOpen = false;
  isLoadingUser = false;
  settingsError: string | null = null;
  currentUser: AppUserResponseDTO | null = null;

  get displayName(): string {
    return this.currentUser?.name || this.currentUser?.email || '';
  }

  logout(): void {
    this.authService.logout();
  }

  openSettingsModal(): void {
    this.isSettingsModalOpen = true;
    this.settingsError = null;
    this.currentUser = this.authService.getCurrentUser();
    this.loadCurrentUser();
  }

  closeSettingsModal(): void {
    this.isSettingsModalOpen = false;
    this.settingsError = null;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isSettingsModalOpen) {
      this.closeSettingsModal();
    }
  }

  private loadCurrentUser(): void {
    this.isLoadingUser = true;
    this.authService.refreshCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isLoadingUser = false;
      },
      error: (err: HttpErrorResponse) => {
        this.isLoadingUser = false;
        if (err.status === 401 || err.status === 403) {
          this.closeSettingsModal();
          this.router.navigate(['/login']);
        } else {
          this.settingsError = 'Não foi possível carregar os dados. Tente novamente.';
        }
      },
    });
  }
}
