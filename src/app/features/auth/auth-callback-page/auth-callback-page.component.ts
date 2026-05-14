import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-auth-callback-page',
  standalone: true,
  template: `
    <div class="callback-container">
      <p class="callback-message">Autenticando...</p>
    </div>
  `,
  styles: [`
    .callback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #1a1a2e;
    }
    .callback-message {
      color: rgba(255, 255, 255, 0.7);
      font-size: 1rem;
    }
  `],
})
export class AuthCallbackPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const code = params.get('code');
    const state = params.get('state');

    if (!code || !state) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.handleCallback(code, state);
  }
}
