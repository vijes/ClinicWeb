import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main [class.authenticated]="authService.user$ | async">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      transition: all 0.3s;
    }
    main.authenticated {
      padding-left: 260px;
      padding-top: 70px;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
