import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-4">
              <h2 class="mb-0">
                <i class="bi bi-briefcase-fill me-2"></i>
                Iniciar Sesión
              </h2>
              <p class="mb-0 mt-2 opacity-75">Accede a ULEAM Empleos</p>
            </div>

            <div class="card-body p-4">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')"
                    placeholder="tu@email.com"
                  />
                  <div class="invalid-feedback">
                    <small *ngIf="loginForm.get('email')?.errors?.['required']">
                      El email es requerido
                    </small>
                    <small *ngIf="loginForm.get('email')?.errors?.['email']">
                      Ingresa un email válido
                    </small>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <div class="input-group">
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [class.is-invalid]="isFieldInvalid('password')"
                      placeholder="Tu contraseña"
                    />
                    <button
                      class="btn btn-outline-secondary"
                      type="button"
                      (click)="togglePassword()"
                    >
                      <i
                        [class]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"
                      ></i>
                    </button>
                  </div>
                  <div class="invalid-feedback">
                    <small
                      *ngIf="loginForm.get('password')?.errors?.['required']"
                    >
                      La contraseña es requerida
                    </small>
                  </div>
                </div>

                <div class="mb-3 form-check">
                  <input
                    type="checkbox"
                    class="form-check-input"
                    id="rememberMe"
                    formControlName="rememberMe"
                  />
                  <label class="form-check-label" for="rememberMe">
                    Recordarme
                  </label>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="loginForm.invalid || isLoading"
                >
                  <span
                    *ngIf="isLoading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>

                <div class="text-center">
                  <a href="#" class="text-decoration-none small"
                    >¿Olvidaste tu contraseña?</a
                  >
                </div>
              </form>
            </div>

            <div class="card-footer text-center py-3">
              <p class="mb-0">
                ¿No tienes cuenta?
                <a
                  routerLink="/auth/register"
                  class="text-primary text-decoration-none fw-bold"
                >
                  Regístrate aquí
                </a>
              </p>
            </div>
          </div>

          <!-- Demo Credentials -->
          <div class="card mt-3 border-warning">
            <div class="card-header bg-warning bg-opacity-10">
              <h6 class="mb-0 text-warning">
                <i class="bi bi-info-circle me-2"></i>
                Credenciales de Demostración
              </h6>
            </div>
            <div class="card-body py-3">
              <div class="row">
                <div class="col-6">
                  <strong>Graduado:</strong><br />
                  <small class="text-muted">graduado&#64;uleam.edu.ec</small
                  ><br />
                  <small class="text-muted">Password123!</small>
                </div>
                <div class="col-6">
                  <strong>Empleador:</strong><br />
                  <small class="text-muted">empresa&#64;techcorp.com</small
                  ><br />
                  <small class="text-muted">Password123!</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        border-radius: 15px;
        overflow: hidden;
      }

      .card-header {
        border: none;
      }

      .form-control:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(10, 102, 194, 0.25);
      }

      .btn-primary {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        border-radius: 8px;
        padding: 12px;
        font-weight: 600;
      }

      .btn-primary:hover {
        background-color: #085294;
        border-color: #085294;
      }

      .input-group .btn {
        border-left: none;
      }

      @media (max-width: 576px) {
        .container {
          padding: 1rem;
        }

        .card-body {
          padding: 2rem 1.5rem !important;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService
      .login(email, password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          // Redirigir según el rol del usuario
          if (user.role === 'graduate') {
            this.router.navigate(['/graduate/dashboard']);
          } else {
            this.router.navigate(['/employer/dashboard']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al iniciar sesión';
        },
      });
  }
}
