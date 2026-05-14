import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AppUserResponseDTO } from './models/app-user-response.dto';

const STORAGE_KEY_STATE = 'pkce_state';
const STORAGE_KEY_VERIFIER = 'pkce_code_verifier';
const STORAGE_KEY_ACCESS_TOKEN = 'access_token';
const STORAGE_KEY_REFRESH_TOKEN = 'refresh_token';
const STORAGE_KEY_ID_TOKEN = 'id_token';
const STORAGE_KEY_CURRENT_USER = 'alarido_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // ─── PKCE Helpers ────────────────────────────────────────────────────────────

  private generateRandomString(length = 64): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  private async sha256(plain: string): Promise<ArrayBuffer> {
    const encoder = new TextEncoder();
    return crypto.subtle.digest('SHA-256', encoder.encode(plain));
  }

  private base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (const byte of bytes) {
      binary += String.fromCharCode(byte);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  // ─── Public API ──────────────────────────────────────────────────────────────

  async login(): Promise<void> {
    if (!this.isBrowser) return;

    const state = this.generateRandomString(32);
    const codeVerifier = this.generateRandomString(64);
    const codeChallenge = this.base64UrlEncode(await this.sha256(codeVerifier));

    localStorage.setItem(STORAGE_KEY_STATE, state);
    localStorage.setItem(STORAGE_KEY_VERIFIER, codeVerifier);

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: environment.keycloak.clientId,
      redirect_uri: environment.keycloak.redirectUri,
      scope: environment.keycloak.scope,
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${environment.keycloak.issuer}/protocol/openid-connect/auth?${params.toString()}`;
    window.location.href = authUrl;
  }

  async handleCallback(code: string, state: string): Promise<void> {
    if (!this.isBrowser) return;

    const savedState = localStorage.getItem(STORAGE_KEY_STATE);
    const codeVerifier = localStorage.getItem(STORAGE_KEY_VERIFIER);

    localStorage.removeItem(STORAGE_KEY_STATE);
    localStorage.removeItem(STORAGE_KEY_VERIFIER);

    if (!savedState || state !== savedState || !codeVerifier) {
      this.clearTokens();
      await this.router.navigate(['/login']);
      return;
    }

    try {
      const tokenEndpoint = `${environment.keycloak.issuer}/protocol/openid-connect/token`;

      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: environment.keycloak.clientId,
        redirect_uri: environment.keycloak.redirectUri,
        code,
        code_verifier: codeVerifier,
      });

      const response = await firstValueFrom(
        this.http.post<TokenResponse>(tokenEndpoint, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
      );

      this.saveTokens(response);
      await this.syncUser();
      await this.router.navigate(['/home']);
    } catch {
      this.clearTokens();
      await this.router.navigate(['/login']);
    }
  }

  async logout(): Promise<void> {
    if (!this.isBrowser) return;

    const idToken = localStorage.getItem(STORAGE_KEY_ID_TOKEN);
    this.clearTokens();

    const params = new URLSearchParams({
      client_id: environment.keycloak.clientId,
      post_logout_redirect_uri: environment.keycloak.postLogoutRedirectUri,
    });

    if (idToken) {
      params.set('id_token_hint', idToken);
    }

    const logoutUrl = `${environment.keycloak.issuer}/protocol/openid-connect/logout?${params.toString()}`;
    window.location.href = logoutUrl;
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false;
    return !!localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  }

  getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(STORAGE_KEY_ACCESS_TOKEN);
  }

  getCurrentUser(): AppUserResponseDTO | null {
    if (!this.isBrowser) return null;
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    return raw ? (JSON.parse(raw) as AppUserResponseDTO) : null;
  }

  refreshCurrentUser(): Observable<AppUserResponseDTO> {
    return this.http
      .post<AppUserResponseDTO>(`${environment.apiUrl}/api/auth/sync-user`, {})
      .pipe(tap((user) => this.setCurrentUser(user)));
  }

  // ─── Private Helpers ─────────────────────────────────────────────────────────

  private saveTokens(response: TokenResponse): void {
    localStorage.setItem(STORAGE_KEY_ACCESS_TOKEN, response.access_token);
    if (response.refresh_token) {
      localStorage.setItem(STORAGE_KEY_REFRESH_TOKEN, response.refresh_token);
    }
    if (response.id_token) {
      localStorage.setItem(STORAGE_KEY_ID_TOKEN, response.id_token);
    }
  }

  private clearTokens(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(STORAGE_KEY_ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEY_REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEY_ID_TOKEN);
    localStorage.removeItem(STORAGE_KEY_STATE);
    localStorage.removeItem(STORAGE_KEY_VERIFIER);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  }

  private setCurrentUser(user: AppUserResponseDTO): void {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
  }

  private async syncUser(): Promise<void> {
    const user = await firstValueFrom(
      this.http.post<AppUserResponseDTO>(`${environment.apiUrl}/api/auth/sync-user`, {})
    );
    this.setCurrentUser(user);
  }
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  token_type: string;
  expires_in: number;
}
