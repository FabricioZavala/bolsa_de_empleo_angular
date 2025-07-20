import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="d-flex justify-content-center align-items-center"
      [style.height]="height"
    >
      <div class="text-center">
        <div
          class="spinner-border"
          [ngClass]="'text-' + color"
          [style.width]="size"
          [style.height]="size"
          role="status"
        >
          <span class="visually-hidden">{{ message }}</span>
        </div>
        <p
          class="mt-3 mb-0"
          [ngClass]="'text-' + textColor"
          *ngIf="showMessage"
        >
          {{ message }}
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .spinner-border {
        animation-duration: 1s;
      }
    `,
  ],
})
export class LoadingComponent {
  @Input() message: string = 'Cargando...';
  @Input() color: string = 'primary';
  @Input() textColor: string = 'muted';
  @Input() size: string = '3rem';
  @Input() height: string = '200px';
  @Input() showMessage: boolean = true;
}
