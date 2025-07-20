import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-briefcase-fill me-2"></i>
          ULEAM Empleos
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item" *ngIf="!currentUser">
              <a
                class="nav-link"
                routerLink="/"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Inicio
              </a>
            </li>
            <li class="nav-item" *ngIf="!currentUser">
              <a class="nav-link" routerLink="/contact"> Contacto </a>
            </li>

            <!-- Menú para Graduados -->
            <ng-container *ngIf="currentUser?.role === 'graduate'">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/graduate/dashboard"
                  routerLinkActive="active"
                >
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/graduate/jobs"
                  routerLinkActive="active"
                >
                  Buscar Empleos
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/graduate/applications"
                  routerLinkActive="active"
                >
                  Mis Postulaciones
                </a>
              </li>
            </ng-container>

            <!-- Menú para Empleadores -->
            <ng-container *ngIf="currentUser?.role === 'employer'">
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/employer/dashboard"
                  routerLinkActive="active"
                >
                  Dashboard
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/employer/jobs"
                  routerLinkActive="active"
                >
                  Mis Empleos
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  routerLink="/employer/post-job"
                  routerLinkActive="active"
                >
                  Publicar Empleo
                </a>
              </li>
            </ng-container>
          </ul>

          <ul class="navbar-nav">
            <ng-container *ngIf="!currentUser">
              <li class="nav-item">
                <a class="nav-link" routerLink="/auth/login">
                  Iniciar Sesión
                </a>
              </li>
              <li class="nav-item">
                <a class="btn btn-primary ms-2" routerLink="/auth/register">
                  Registrarse
                </a>
              </li>
            </ng-container>

            <ng-container *ngIf="currentUser">
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <i class="bi bi-person-circle me-1"></i>
                  {{ getUserDisplayName() }}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      class="dropdown-item"
                      [routerLink]="
                        currentUser.role === 'graduate'
                          ? '/graduate/profile'
                          : '/employer/profile'
                      "
                    >
                      <i class="bi bi-person me-2"></i>
                      Mi Perfil
                    </a>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <button class="dropdown-item" (click)="logout()">
                      <i class="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            </ng-container>
          </ul>
        </div>
      </div>
    </nav>
  `,
  styles: [
    `
      .navbar-brand {
        color: var(--primary-color) !important;
        font-size: 1.5rem;
      }

      .nav-link.active {
        color: var(--primary-color) !important;
        font-weight: 600;
      }

      .dropdown-toggle::after {
        margin-left: 0.5rem;
      }

      .dropdown-item:hover {
        background-color: #f8f9fa;
      }

      .navbar-toggler {
        border: none;
      }

      .navbar-toggler:focus {
        box-shadow: none;
      }

      @media (max-width: 991px) {
        .navbar-nav {
          text-align: center;
        }

        .nav-item {
          margin: 0.25rem 0;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getUserDisplayName(): string {
    if (!this.currentUser) return '';

    if (this.currentUser.role === 'graduate') {
      const profile = this.currentUser.profile as any;
      return profile.firstName || this.currentUser.email.split('@')[0];
    } else {
      const profile = this.currentUser.profile as any;
      return profile.companyName || this.currentUser.email.split('@')[0];
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
