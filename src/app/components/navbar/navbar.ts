import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="app-layout" *ngIf="authService.user$ | async as user">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="logo">Clinica<span>SW</span></div>
        <nav class="sidebar-nav">
          <a routerLink="/pacientes" routerLinkActive="active" class="nav-item">
            <span class="icon">👤</span> Pacientes
          </a>
          <a routerLink="/citas" routerLinkActive="active" class="nav-item">
            <span class="icon">📅</span> Citas
          </a>
          <a *ngIf="isAdmin()" routerLink="/clinicas" routerLinkActive="active" class="nav-item">
            <span class="icon">🏥</span> Clínicas
          </a>
          <a *ngIf="isAdmin()" class="nav-item" style="cursor: not-allowed; opacity: 0.5;">
            <span class="icon">📊</span> Reportes (Pronto)
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info" *ngIf="authService.user$ | async as u">
             <div class="username">{{ u.fullName }}</div>
             <div class="role-tag">{{ u.roles[0] }}</div>
          </div>
          <button class="btn-logout" (click)="logout()">
            <span class="icon">🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Header (Dynamic) -->
      <header class="main-header">
        <div class="header-content">
          <h2 class="page-title">{{ pageTitle }}</h2>
          <div class="header-actions">
            <button *ngIf="currentRoute === '/pacientes'" class="btn btn-primary" (click)="navigate('/pacientes/nuevo')">
              + Crear Paciente
            </button>
            <button *ngIf="currentRoute === '/citas'" class="btn btn-primary" (click)="navigate('/citas/nuevo')">
              + Crear Cita
            </button>
          </div>
        </div>
      </header>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; }
    .sidebar {
      width: 260px; height: 100vh; background: #1e293b; color: white;
      position: fixed; left: 0; top: 0; display: flex; flex-direction: column;
      padding: 1.5rem; transition: all 0.3s; z-index: 1000;
    }
    .logo { font-size: 1.5rem; font-weight: 800; margin-bottom: 2.5rem; flex-shrink: 0; }
    .logo span { color: #3b82f6; }
    .sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; overflow-y: auto; }
    .nav-item {
      display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
      color: #94a3b8; text-decoration: none; border-radius: 0.5rem; transition: 0.2s;
    }
    .nav-item:hover, .nav-item.active { background: #334155; color: white; }
    .icon { font-size: 1.2rem; }
    .sidebar-footer { border-top: 1px solid #334155; padding-top: 1.5rem; flex-shrink: 0; margin-top: auto; }
    .btn-logout {
      width: 100%; display: flex; align-items: center; gap: 0.75rem;
      background: transparent; border: none; color: #ef4444; font-weight: 600;
      cursor: pointer; padding: 0.75rem 1rem; transition: 0.2s;
    }
    .btn-logout:hover { background: rgba(239, 68, 68, 0.1); border-radius: 0.5rem; }

    .user-info { margin-bottom: 1rem; padding: 0 1rem; }
    .username { font-weight: 700; color: #f8fafc; font-size: 0.9rem; }
    .role-tag { font-size: 0.7rem; color: #3b82f6; text-transform: uppercase; font-weight: 600; }

    .main-header {
      position: fixed; top: 0; left: 260px; right: 0; height: 70px;
      background: white; border-bottom: 1px solid #e2e8f0; z-index: 100;
      padding: 0 2rem; display: flex; align-items: center;
    }
    .header-content { width: 100%; display: flex; justify-content: space-between; align-items: center; }
    .page-title { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0; }
  `]
})
export class NavbarComponent {
  currentRoute = '';
  pageTitle = '';

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.urlAfterRedirects;
      this.updateHeader();
    });
  }

  updateHeader() {
    if (this.currentRoute.includes('/pacientes')) {
      this.pageTitle = 'Gestión de Pacientes';
    } else if (this.currentRoute.includes('/citas')) {
      this.pageTitle = 'Gestión de Citas';
    } else if (this.currentRoute.includes('/clinicas')) {
      this.pageTitle = 'Administración de Clínicas';
    } else {
      this.pageTitle = 'Panel de Control';
    }
  }

  isAdmin(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.roles?.includes('ROLE_ADMIN');
  }

  isMedico(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.roles?.includes('ROLE_MEDICO');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']).then(() => window.location.reload());
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}
