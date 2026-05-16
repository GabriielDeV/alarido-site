import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UserRoleService } from '../../../core/users/services/user-role.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userRoleService = inject(UserRoleService);

  isAdmin = signal(false);

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRoleService.hasAdminRole(user.id).subscribe((admin) => {
        this.isAdmin.set(admin);
      });
    }
  }
}
