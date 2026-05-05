import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent } from '../../../../shared/components/app-header/app-header.component';
import { BottomNavComponent } from '../../../../shared/components/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [AppHeaderComponent, BottomNavComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  constructor(private router: Router) {}

  goToBible(): void {
    this.router.navigate(['/biblia']);
  }

  goToMessages(): void {
    this.router.navigate(['/mensagens']);
  }
}
