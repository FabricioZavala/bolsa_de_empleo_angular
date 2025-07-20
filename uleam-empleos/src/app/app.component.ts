import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-navbar></app-navbar>
      <main class="flex-grow-1">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
    </div>
  `,
  styles: [
    `
      .min-vh-100 {
        min-height: 100vh;
      }

      main {
        flex: 1;
      }
    `,
  ],
})
export class AppComponent {
  title = 'ULEAM Empleos';
}
