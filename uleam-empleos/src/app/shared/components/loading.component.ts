import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="loading-container d-flex justify-content-center align-items-center"
      [style.height.px]="height"
    >
      <div class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-secondary" *ngIf="message">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .loading-container {
        min-height: 200px;
      }

      .spinner-border {
        width: 3rem;
        height: 3rem;
      }
    `,
  ],
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() height: number = 200;
}
