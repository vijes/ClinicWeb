import { Directive, ElementRef, inject, effect } from '@angular/core';
import { LoadingService } from '../services/loading.service';

@Directive({
  selector: '[appLoading]',
  standalone: true
})
export class LoadingDirective {
  private el = inject(ElementRef);
  private loadingService = inject(LoadingService);

  constructor() {
    // React to signal changes using effect()
    effect(() => {
      const isLoading = this.loadingService.isLoading();
      this.updateState(isLoading);
    });
  }

  private updateState(isLoading: boolean): void {
    const nativeElement = this.el.nativeElement;
    
    if (isLoading) {
      nativeElement.disabled = true;
      nativeElement.style.opacity = '0.7';
      nativeElement.style.cursor = 'not-allowed';
      nativeElement.classList.add('is-loading');
    } else {
      nativeElement.disabled = false;
      nativeElement.style.opacity = '1';
      nativeElement.style.cursor = 'pointer';
      nativeElement.classList.remove('is-loading');
    }
  }
}
