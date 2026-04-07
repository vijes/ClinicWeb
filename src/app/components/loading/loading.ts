import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loadingService.isLoading()" class="loading-overlay">
      <div class="spinner-container">
        <div class="beautiful-spinner"></div>
        <p class="loading-text">Procesando...</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }

    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
    }

    .beautiful-spinner {
      width: 60px;
      height: 60px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-left-color: #3b82f6; /* Modern Blue */
      border-top-color: #8b5cf6;  /* Modern Purple */
      border-radius: 50%;
      animation: spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
    }

    .loading-text {
      color: white;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 1.1rem;
      font-weight: 500;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
}
