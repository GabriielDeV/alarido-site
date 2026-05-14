import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { AppUserResponseDTO } from '../../../core/auth/models/app-user-response.dto';
import { AppHeaderComponent } from '../../../shared/components/app-header/app-header.component';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [AppHeaderComponent],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  currentUser: AppUserResponseDTO | null = null;
  isLoading = true;

  async ngOnInit(): Promise<void> {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.currentUser) {
      try {
        this.currentUser = await firstValueFrom(this.authService.refreshCurrentUser());
      } catch {
        this.currentUser = null;
      }
    }

    if (!this.currentUser) {
      await this.router.navigate(['/login']);
      return;
    }

    this.isLoading = false;
  }

  get displayName(): string {
    return this.currentUser?.name || this.currentUser?.email || '';
  }
}
