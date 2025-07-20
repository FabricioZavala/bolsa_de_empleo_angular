import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User, EmployerProfile } from '../../../core/models/user.model';

@Component({
  selector: 'app-employer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="bi bi-building me-2"></i>
          Perfil de la Empresa
        </h2>
        <button class="btn btn-outline-secondary" (click)="goBack()">
          <i class="bi bi-arrow-left me-2"></i>
          Volver al Dashboard
        </button>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <!-- Company Information -->
          <div class="card mb-4">
            <div class="card-header">
              <h5 class="mb-0">
                <i class="bi bi-info-circle me-2"></i>
                Información de la Empresa
              </h5>
            </div>
            <div class="card-body">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="row">
                  <div class="col-md-6 mb-3">
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

                  <div class="col-md-6 mb-3">
                    <label for="industry" class="form-label">Industria *</label>
                    <select
                      class="form-select"
                      id="industry"
                      formControlName="industry"
                      [class.is-invalid]="isFieldInvalid('industry')"
                    >
                      <option value="">Selecciona una industria</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Salud">Salud</option>
                      <option value="Educación">Educación</option>
                      <option value="Manufactura">Manufactura</option>
                      <option value="Comercio">Comercio</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Turismo">Turismo</option>
                      <option value="Otros">Otros</option>
                    </select>
                    <div class="invalid-feedback">Selecciona una industria</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="website" class="form-label">Sitio Web</label>
                    <input
                      type="url"
                      class="form-control"
                      id="website"
                      formControlName="website"
                      placeholder="https://www.ejemplo.com"
                      [class.is-invalid]="isFieldInvalid('website')"
                    />
                    <div class="invalid-feedback">Ingresa una URL válida</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="contactPerson" class="form-label"
                      >Persona de Contacto *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="contactPerson"
                      formControlName="contactPerson"
                      [class.is-invalid]="isFieldInvalid('contactPerson')"
                      placeholder="Nombre del representante"
                    />
                    <div class="invalid-feedback">
                      La persona de contacto es requerida
                    </div>
                  </div>

                  <div class="col-12 mb-3">
                    <label for="description" class="form-label"
                      >Descripción de la Empresa *</label
                    >
                    <textarea
                      class="form-control"
                      id="description"
                      rows="4"
                      formControlName="description"
                      [class.is-invalid]="isFieldInvalid('description')"
                      placeholder="Describe tu empresa, misión, valores y lo que la hace especial..."
                    ></textarea>
                    <div class="invalid-feedback">
                      La descripción es requerida
                    </div>
                    <div class="form-text">
                      Mínimo 50 caracteres. Esta información será visible para
                      los candidatos.
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-end">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    [disabled]="profileForm.invalid || isSubmitting"
                  >
                    <i class="bi bi-save me-2"></i>
                    <span *ngIf="!isSubmitting">Guardar Cambios</span>
                    <span *ngIf="isSubmitting">Guardando...</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <!-- Company Avatar -->
          <div class="card mb-4">
            <div class="card-body text-center">
              <div class="mb-3">
                <div
                  class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white mx-auto"
                  style="width: 120px; height: 120px; border: 3px solid #e9ecef; font-size: 2.5rem;"
                >
                  <i class="bi bi-building-fill"></i>
                </div>
              </div>
              <h5 class="mb-1">{{ getCompanyName() }}</h5>
              <p class="text-muted small">{{ getIndustry() }}</p>
            </div>
          </div>

          <!-- Account Information -->
          <div class="card mb-4">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-person-circle me-2"></i>
                Información de la Cuenta
              </h6>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  [value]="currentUser?.email || ''"
                  readonly
                />
                <div class="form-text">
                  Para cambiar el email, contacta al administrador.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Tipo de Cuenta</label>
                <input
                  type="text"
                  class="form-control"
                  value="Empleador"
                  readonly
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Fecha de Registro</label>
                <input
                  type="text"
                  class="form-control"
                  [value]="currentUser?.createdAt | date : 'dd/MM/yyyy'"
                  readonly
                />
              </div>
            </div>
          </div>

          <!-- Help Card -->
          <div class="card">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-question-circle me-2"></i>
                ¿Necesitas Ayuda?
              </h6>
            </div>
            <div class="card-body">
              <p class="small mb-3">
                Si tienes problemas para completar tu perfil o necesitas
                asistencia, no dudes en contactarnos.
              </p>
              <a href="/contact" class="btn btn-outline-primary btn-sm w-100">
                <i class="bi bi-envelope me-2"></i>
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .form-control:focus,
      .form-select:focus {
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
      }

      .card {
        transition: all 0.2s ease-in-out;
      }

      .card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    `,
  ],
})
export class EmployerProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isSubmitting = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user && user.profile) {
        this.populateForm(user.profile as EmployerProfile);
      }
    });
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      companyName: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      website: [''],
      contactPerson: ['', [Validators.required]],
    });
  }

  private populateForm(profile: EmployerProfile): void {
    this.profileForm.patchValue({
      companyName: profile.companyName || '',
      industry: profile.industry || '',
      description: profile.description || '',
      website: profile.website || '',
      contactPerson: profile.contactPerson || '',
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.profileForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentUser) {
      Object.keys(this.profileForm.controls).forEach((key) => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.profileForm.value;

    const updatedProfile: EmployerProfile = {
      companyName: formValue.companyName,
      industry: formValue.industry,
      description: formValue.description,
      website: formValue.website,
      contactPerson: formValue.contactPerson,
    };

    // Simulate API call
    setTimeout(() => {
      // Update the user profile in localStorage
      const users = JSON.parse(
        localStorage.getItem('uleam_empleos_users') || '[]'
      );
      const userIndex = users.findIndex(
        (u: User) => u.id === this.currentUser!.id
      );

      if (userIndex !== -1) {
        users[userIndex].profile = updatedProfile;
        localStorage.setItem('uleam_empleos_users', JSON.stringify(users));

        // Update current user in auth service
        this.authService.updateCurrentUser({
          ...this.currentUser!,
          profile: updatedProfile,
        });
      }

      this.isSubmitting = false;
      alert('Perfil actualizado exitosamente');
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/employer/dashboard']);
  }

  getCompanyName(): string {
    const profile = this.currentUser?.profile as any;
    return profile?.companyName || 'Mi Empresa';
  }

  getIndustry(): string {
    const profile = this.currentUser?.profile as any;
    return profile?.industry || 'Industria';
  }
}
