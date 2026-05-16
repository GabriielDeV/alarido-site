import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap, map, catchError } from 'rxjs';
import { AuthService } from './auth.service';
import { UserRoleService } from '../users/services/user-role.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const userRoleService = inject(UserRoleService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const currentUser = authService.getCurrentUser();

  const user$ = currentUser
    ? of(currentUser)
    : authService.refreshCurrentUser().pipe(catchError(() => of(null)));

  return user$.pipe(
    switchMap((user) => {
      if (!user) return of(router.createUrlTree(['/login']));
      return userRoleService.hasAdminRole(user.id).pipe(
        map((isAdmin) => (isAdmin ? true : router.createUrlTree(['/home']))),
        catchError(() => of(router.createUrlTree(['/home']))),
      );
    }),
  );
};
