import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loadingCount = 0;
  
  // Use Angular Signals for high-performance reactive state (available since v16)
  isLoading = signal<boolean>(false);

  /**
   * Increments the loading counter and activates the loader.
   */
  show(): void {
    this._loadingCount++;
    this.isLoading.set(true);
  }

  /**
   * Decrements the loading counter and deactivates the loader if it reaches zero.
   */
  hide(): void {
    this._loadingCount = Math.max(0, this._loadingCount - 1);
    if (this._loadingCount === 0) {
      this.isLoading.set(false);
    }
  }

  /**
   * Resets the loading state manually if needed.
   */
  reset(): void {
    this._loadingCount = 0;
    this.isLoading.set(false);
  }
}
