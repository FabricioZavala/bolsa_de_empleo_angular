import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-4">
              <h2 class="mb-0">
                <i class="bi bi-person-plus-fill me-2"></i>
                Crear Cuenta
              </h2>
              <p class="mb-0 mt-2 opacity-75">Únete a ULEAM Empleos</p>
            </div>

            <div class="card-body p-4">
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [class.is-invalid]="isFieldInvalid('email')"
                    [class.is-valid]="isFieldValid('email')"
                    placeholder="tu@email.com"
                  />
                  <div class="invalid-feedback">
                    <small
                      *ngIf="registerForm.get('email')?.errors?.['required']"
                    >
                      El email es requerido
                    </small>
                    <small *ngIf="registerForm.get('email')?.errors?.['email']">
                      Ingresa un email válido
                    </small>
                    <small
                      *ngIf="registerForm.get('email')?.errors?.['emailTaken']"
                    >
                      Este email ya está registrado
                    </small>
                  </div>
                  <div class="valid-feedback">Email disponible</div>
                </div>

                <!-- Role Selection -->
                <div class="mb-3">
                  <label class="form-label">Tipo de Usuario *</label>
                  <div class="row g-2">
                    <div class="col-6">
                      <div class="form-check h-100">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="graduate"
                          value="graduate"
                          formControlName="role"
                        />
                        <label class="form-check-label w-100" for="graduate">
                          <div
                            class="border rounded p-3 text-center h-100 d-flex flex-column justify-content-center"
                            [class.border-primary]="
                              registerForm.get('role')?.value === 'graduate'
                            "
                            [class.bg-primary]="
                              registerForm.get('role')?.value === 'graduate'
                            "
                            [class.text-white]="
                              registerForm.get('role')?.value === 'graduate'
                            "
                          >
                            <i class="bi bi-mortarboard fs-2 mb-2"></i>
                            <strong>Graduado</strong>
                            <small class="d-block mt-1">Buscar empleo</small>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div class="col-6">
                      <div class="form-check h-100">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="employer"
                          value="employer"
                          formControlName="role"
                        />
                        <label class="form-check-label w-100" for="employer">
                          <div
                            class="border rounded p-3 text-center h-100 d-flex flex-column justify-content-center"
                            [class.border-primary]="
                              registerForm.get('role')?.value === 'employer'
                            "
                            [class.bg-primary]="
                              registerForm.get('role')?.value === 'employer'
                            "
                            [class.text-white]="
                              registerForm.get('role')?.value === 'employer'
                            "
                          >
                            <i class="bi bi-building fs-2 mb-2"></i>
                            <strong>Empleador</strong>
                            <small class="d-block mt-1">Publicar empleos</small>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div
                    class="text-danger small mt-1"
                    *ngIf="isFieldInvalid('role')"
                  >
                    Selecciona el tipo de usuario
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña *</label>
                  <div class="input-group">
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [class.is-invalid]="isFieldInvalid('password')"
                      placeholder="Mínimo 8 caracteres"
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
                  <div class="password-strength mt-1">
                    <div class="progress" style="height: 3px;">
                      <div
                        class="progress-bar"
                        [style.width.%]="passwordStrength"
                        [class]="getPasswordStrengthClass()"
                      ></div>
                    </div>
                    <small class="text-muted">{{
                      getPasswordStrengthText()
                    }}</small>
                  </div>
                  <div
                    class="invalid-feedback"
                    *ngIf="isFieldInvalid('password')"
                  >
                    <div
                      *ngIf="registerForm.get('password')?.errors?.['required']"
                    >
                      La contraseña es requerida
                    </div>
                    <div
                      *ngIf="registerForm.get('password')?.errors?.['minlength']"
                    >
                      La contraseña debe tener mínimo 8 caracteres
                    </div>
                    <div
                      *ngIf="registerForm.get('password')?.errors?.['pattern']"
                    >
                      La contraseña debe contener al menos: una mayúscula, una
                      minúscula, un número
                    </div>
                  </div>
                  <!-- Requirements always visible -->
                  <div class="form-text">
                    <small class="text-muted">
                      Requisitos: Al menos 8 caracteres, una mayúscula, una
                      minúscula y un número
                    </small>
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-3">
                  <label for="confirmPassword" class="form-label"
                    >Confirmar Contraseña *</label
                  >
                  <input
                    type="password"
                    class="form-control"
                    id="confirmPassword"
                    formControlName="confirmPassword"
                    [class.is-invalid]="isFieldInvalid('confirmPassword')"
                    placeholder="Repite tu contraseña"
                  />
                  <div class="invalid-feedback">
                    <small
                      *ngIf="registerForm.get('confirmPassword')?.errors?.['required']"
                    >
                      Confirma tu contraseña
                    </small>
                    <small
                      *ngIf="registerForm.get('confirmPassword')?.errors?.['passwordMismatch']"
                    >
                      Las contraseñas no coinciden
                    </small>
                  </div>
                </div>

                <!-- Profile Fields -->
                <div *ngIf="registerForm.get('role')?.value === 'graduate'">
                  <hr />
                  <h6 class="text-primary mb-3">Información Personal</h6>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="firstName" class="form-label"
                        >Nombres *</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="firstName"
                        formControlName="firstName"
                        [class.is-invalid]="isFieldInvalid('firstName')"
                      />
                      <div class="invalid-feedback">
                        Los nombres son requeridos
                      </div>
                    </div>
                    <div class="col-md-6">
                      <label for="lastName" class="form-label"
                        >Apellidos *</label
                      >
                      <input
                        type="text"
                        class="form-control"
                        id="lastName"
                        formControlName="lastName"
                        [class.is-invalid]="isFieldInvalid('lastName')"
                      />
                      <div class="invalid-feedback">
                        Los apellidos son requeridos
                      </div>
                    </div>
                  </div>
                </div>

                <div *ngIf="registerForm.get('role')?.value === 'employer'">
                  <hr />
                  <h6 class="text-primary mb-3">Información de la Empresa</h6>
                  <div class="mb-3">
                    <label for="companyName" class="form-label"
                      >Nombre de la Empresa *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="companyName"
                      formControlName="companyName"
                      [class.is-invalid]="isFieldInvalid('companyName')"
                    />
                    <div class="invalid-feedback">
                      El nombre de la empresa es requerido
                    </div>
                  </div>
                </div>

                <!-- Terms and Conditions -->
                <div class="mb-3">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="acceptTerms"
                      formControlName="acceptTerms"
                      [class.is-invalid]="isFieldInvalid('acceptTerms')"
                    />
                    <label class="form-check-label" for="acceptTerms">
                      Acepto los
                      <a href="#" class="text-primary"
                        >términos y condiciones</a
                      >
                      y la
                      <a href="#" class="text-primary"
                        >política de privacidad</a
                      >
                      *
                    </label>
                    <div class="invalid-feedback">
                      Debes aceptar los términos y condiciones
                    </div>
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  <i class="bi bi-exclamation-triangle me-2"></i>
                  {{ errorMessage }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  [disabled]="registerForm.invalid || isLoading"
                >
                  <span
                    *ngIf="isLoading"
                    class="spinner-border spinner-border-sm me-2"
                  ></span>
                  {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
                </button>
              </form>
            </div>

            <div class="card-footer text-center py-3">
              <p class="mb-0">
                ¿Ya tienes cuenta?
                <a
                  routerLink="/auth/login"
                  class="text-primary text-decoration-none fw-bold"
                >
                  Inicia sesión aquí
                </a>
              </p>
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

      .form-check-label .border {
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .form-check-label .border:hover {
        border-color: var(--primary-color) !important;
      }

      .form-control:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 0.2rem rgba(10, 102, 194, 0.25);
      }

      .password-strength .progress-bar.bg-danger {
        background-color: #dc3545 !important;
      }

      .password-strength .progress-bar.bg-warning {
        background-color: #ffc107 !important;
      }

      .password-strength .progress-bar.bg-success {
        background-color: #198754 !important;
      }

      .form-check-input[type='radio'] {
        display: none;
      }
    `,
  ],
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  passwordStrength = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailValidator.bind(this)],
        ],
        role: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        firstName: [''],
        lastName: [''],
        companyName: [''],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Add conditional validators based on role
    this.registerForm.get('role')?.valueChanges.subscribe((role) => {
      this.updateValidators(role);
    });

    // Monitor password for strength
    this.registerForm.get('password')?.valueChanges.subscribe((password) => {
      this.calculatePasswordStrength(password);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  emailValidator(control: AbstractControl) {
    if (!control.value) return null;

    return this.authService.isEmailAvailable(control.value).pipe(
      debounceTime(300),
      takeUntil(this.destroy$),
      map((isAvailable: boolean) => (isAvailable ? null : { emailTaken: true }))
    );
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    if (confirmPassword.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }

    return null;
  }

  updateValidators(role: string): void {
    const firstNameControl = this.registerForm.get('firstName');
    const lastNameControl = this.registerForm.get('lastName');
    const companyNameControl = this.registerForm.get('companyName');

    // Clear all validators first
    firstNameControl?.clearValidators();
    lastNameControl?.clearValidators();
    companyNameControl?.clearValidators();

    if (role === 'graduate') {
      firstNameControl?.setValidators([Validators.required]);
      lastNameControl?.setValidators([Validators.required]);
    } else if (role === 'employer') {
      companyNameControl?.setValidators([Validators.required]);
    }

    // Update validity
    firstNameControl?.updateValueAndValidity();
    lastNameControl?.updateValueAndValidity();
    companyNameControl?.updateValueAndValidity();
  }

  calculatePasswordStrength(password: string): void {
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;

    // Lowercase check
    if (/[a-z]/.test(password)) strength += 25;

    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 25;

    // Number check
    if (/\d/.test(password)) strength += 12.5;

    // Special character check
    if (/[@$!%*?&]/.test(password)) strength += 12.5;

    this.passwordStrength = Math.min(100, strength);
  }

  getPasswordStrengthClass(): string {
    if (this.passwordStrength < 40) return 'bg-danger';
    if (this.passwordStrength < 70) return 'bg-warning';
    return 'bg-success';
  }

  getPasswordStrengthText(): string {
    if (this.passwordStrength < 40) return 'Débil';
    if (this.passwordStrength < 70) return 'Media';
    return 'Fuerte';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.valid && (field.dirty || field.touched));
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      Object.keys(this.registerForm.controls).forEach((key) => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = this.registerForm.value;
    const userData = {
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      profile:
        formValue.role === 'graduate'
          ? {
              firstName: formValue.firstName,
              lastName: formValue.lastName,
              phone: '',
              address: '',
              education: [],
              experience: [],
              skills: [],
            }
          : {
              companyName: formValue.companyName,
              industry: '',
              description: '',
              website: '',
              contactPerson: '',
            },
    };

    this.authService
      .register(userData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.isLoading = false;
          this.router.navigate(['/auth/login'], {
            queryParams: {
              message:
                'Cuenta creada exitosamente. Inicia sesión para continuar.',
            },
          });
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'Error al crear la cuenta';
        },
      });
  }
}
