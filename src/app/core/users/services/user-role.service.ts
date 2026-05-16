import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, shareReplay } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppRole } from '../models/app-role.model';

@Injectable({ providedIn: 'root' })
export class UserRoleService {
  private readonly http = inject(HttpClient);
  private readonly rolesCache = new Map<string, Observable<AppRole[]>>();

  findRolesByUser(userId: string): Observable<AppRole[]> {
    if (!this.rolesCache.has(userId)) {
      this.rolesCache.set(
        userId,
        this.http
          .get<AppRole[]>(`${environment.apiUrl}/api/users/${userId}/roles`)
          .pipe(shareReplay(1)),
      );
    }
    return this.rolesCache.get(userId)!;
  }

  hasAdminRole(userId: string): Observable<boolean> {
    return this.findRolesByUser(userId).pipe(
      map((roles) => roles.some((r) => r.name.toUpperCase() === 'ADMIN')),
      catchError(() => of(false)),
    );
  }
}
