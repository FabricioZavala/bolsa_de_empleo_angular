import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-post-job',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="bi bi-plus-circle me-2"></i>
          Publicar Nueva Oferta de Empleo
        </h2>
        <button class="btn btn-outline-secondary" (click)="goBack()">
          <i class="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>

      <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
        <div class="row">
          <!-- Main Information -->
          <div class="col-lg-8">
            <!-- Basic Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-info-circle me-2"></i>
                  Información Básica
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-12 mb-3">
                    <label for="title" class="form-label"
                      >Título del Empleo *</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      formControlName="title"
                      [class.is-invalid]="isFieldInvalid('title')"
                      placeholder="Ej: Desarrollador Frontend Angular"
                    />
                    <div class="invalid-feedback">El título es requerido</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="area" class="form-label">Área *</label>
                    <select
                      class="form-select"
                      id="area"
                      formControlName="area"
                      [class.is-invalid]="isFieldInvalid('area')"
                    >
                      <option value="">Selecciona un área</option>
                      <option value="Tecnología">Tecnología</option>
                      <option value="Administración">Administración</option>
                      <option value="Ventas">Ventas</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finanzas">Finanzas</option>
                      <option value="Salud">Salud</option>
                      <option value="Educación">Educación</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Turismo">Turismo</option>
                      <option value="Recursos Humanos">Recursos Humanos</option>
                    </select>
                    <div class="invalid-feedback">Selecciona un área</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="modality" class="form-label">Modalidad *</label>
                    <select
                      class="form-select"
                      id="modality"
                      formControlName="modality"
                      [class.is-invalid]="isFieldInvalid('modality')"
                    >
                      <option value="">Selecciona modalidad</option>
                      <option value="presencial">Presencial</option>
                      <option value="remoto">Remoto</option>
                      <option value="hibrido">Híbrido</option>
                    </select>
                    <div class="invalid-feedback">Selecciona una modalidad</div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="location" class="form-label">Ubicación *</label>
                    <input
                      type="text"
                      class="form-control"
                      id="location"
                      formControlName="location"
                      [class.is-invalid]="isFieldInvalid('location')"
                      placeholder="Ej: Manta, Manabí"
                    />
                    <div class="invalid-feedback">
                      La ubicación es requerida
                    </div>
                  </div>

                  <div class="col-md-6 mb-3">
                    <label for="salary" class="form-label">Salario *</label>
                    <select
                      class="form-select"
                      id="salary"
                      formControlName="salary"
                      [class.is-invalid]="isFieldInvalid('salary')"
                    >
                      <option value="">Selecciona rango salarial</option>
                      <option value="$400 - $600">$400 - $600</option>
                      <option value="$600 - $800">$600 - $800</option>
                      <option value="$800 - $1000">$800 - $1000</option>
                      <option value="$1000 - $1500">$1000 - $1500</option>
                      <option value="$1500 - $2000">$1500 - $2000</option>
                      <option value="$2000+">$2000+</option>
                      <option value="A convenir">A convenir</option>
                    </select>
                    <div class="invalid-feedback">
                      Selecciona un rango salarial
                    </div>
                  </div>

                  <div class="col-12">
                    <label for="description" class="form-label"
                      >Descripción del Empleo *</label
                    >
                    <textarea
                      class="form-control"
                      id="description"
                      rows="6"
                      formControlName="description"
                      [class.is-invalid]="isFieldInvalid('description')"
                      placeholder="Describe las responsabilidades, el ambiente de trabajo, y otros detalles relevantes del puesto..."
                    ></textarea>
                    <div class="invalid-feedback">
                      La descripción es requerida
                    </div>
                    <div class="form-text">
                      Mínimo 100 caracteres. Sé específico sobre las
                      responsabilidades y expectativas.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="card mb-4">
              <div
                class="card-header d-flex justify-content-between align-items-center"
              >
                <h5 class="mb-0">
                  <i class="bi bi-list-check me-2"></i>
                  Requisitos del Puesto
                </h5>
                <button
                  type="button"
                  class="btn btn-sm btn-primary"
                  (click)="addRequirement()"
                >
                  <i class="bi bi-plus me-1"></i>
                  Agregar
                </button>
              </div>
              <div class="card-body">
                <div formArrayName="requirements">
                  <div
                    *ngFor="
                      let requirement of requirements.controls;
                      let i = index
                    "
                    class="input-group mb-2"
                  >
                    <span class="input-group-text">{{ i + 1 }}.</span>
                    <input
                      type="text"
                      class="form-control"
                      [formControlName]="i"
                      placeholder="Ej: Título universitario en área afín"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      (click)="removeRequirement(i)"
                      [disabled]="requirements.length <= 1"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="form-text">
                  Agrega los requisitos específicos que debe cumplir el
                  candidato ideal.
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-lg-4">
            <!-- Publication Settings -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-calendar me-2"></i>
                  Configuración de Publicación
                </h5>
              </div>
              <div class="card-body">
                <div class="mb-3">
                  <label for="deadline" class="form-label"
                    >Fecha Límite de Postulación *</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    id="deadline"
                    formControlName="deadline"
                    [class.is-invalid]="isFieldInvalid('deadline')"
                    [min]="getMinDate()"
                  />
                  <div class="invalid-feedback">
                    Selecciona una fecha válida (mínimo mañana)
                  </div>
                </div>

                <div class="mb-3">
                  <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    <small>
                      La oferta será visible para todos los graduados una vez
                      publicada.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview Card -->
            <div class="card">
              <div class="card-header">
                <h6 class="mb-0">
                  <i class="bi bi-eye me-2"></i>
                  Vista Previa
                </h6>
              </div>
              <div class="card-body">
                <div
                  class="text-center text-muted"
                  *ngIf="!jobForm.get('title')?.value"
                >
                  <i class="bi bi-card-text display-4 mb-3"></i>
                  <p>Completa el formulario para ver la vista previa</p>
                </div>

                <div *ngIf="jobForm.get('title')?.value">
                  <div class="d-flex flex-wrap mb-2">
                    <span
                      class="badge bg-primary me-1 mb-1"
                      *ngIf="jobForm.get('area')?.value"
                    >
                      {{ jobForm.get('area')?.value }}
                    </span>
                    <span
                      class="badge bg-secondary me-1 mb-1"
                      *ngIf="jobForm.get('modality')?.value"
                    >
                      {{ jobForm.get('modality')?.value }}
                    </span>
                  </div>

                  <h6>
                    {{ jobForm.get('title')?.value || 'Título del empleo' }}
                  </h6>

                  <div class="small text-muted mb-2">
                    <div *ngIf="jobForm.get('location')?.value">
                      <i class="bi bi-geo-alt me-1"></i>
                      {{ jobForm.get('location')?.value }}
                    </div>
                    <div *ngIf="jobForm.get('salary')?.value">
                      <i class="bi bi-currency-dollar me-1"></i>
                      {{ jobForm.get('salary')?.value }}
                    </div>
                  </div>

                  <p
                    class="small text-muted mb-0"
                    *ngIf="jobForm.get('description')?.value"
                  >
                    {{
                      (jobForm.get('description')?.value || '').substring(
                        0,
                        100
                      )
                    }}
                    <span
                      *ngIf="
                        (jobForm.get('description')?.value || '').length > 100
                      "
                      >...</span
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="row mt-4">
          <div class="col-12">
            <div class="d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-outline-secondary"
                (click)="goBack()"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="jobForm.invalid || isSubmitting"
              >
                <i class="bi bi-upload me-2"></i>
                <span *ngIf="!isSubmitting">Publicar Oferta</span>
                <span *ngIf="isSubmitting">Publicando...</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Success Modal -->
    <div
      class="modal fade"
      [class.show]="showSuccessModal"
      [style.display]="showSuccessModal ? 'block' : 'none'"
      tabindex="-1"
      *ngIf="showSuccessModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">
              <i class="bi bi-check-circle me-2"></i>
              ¡Oferta Publicada!
            </h5>
          </div>
          <div class="modal-body text-center">
            <i class="bi bi-check-circle-fill text-success display-1 mb-3"></i>
            <h4>¡Excelente!</h4>
            <p class="mb-3">
              Tu oferta de empleo ha sido publicada exitosamente y ya está
              visible para todos los graduados.
            </p>
            <div class="d-grid gap-2">
              <button class="btn btn-primary" (click)="goToJobsList()">
                <i class="bi bi-list me-2"></i>
                Ver Mis Ofertas
              </button>
              <button class="btn btn-outline-primary" (click)="createAnother()">
                <i class="bi bi-plus-circle me-2"></i>
                Crear Otra Oferta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" *ngIf="showSuccessModal"></div>
  `,
  styles: [
    `
      .card {
        transition: all 0.2s ease-in-out;
      }

      .modal.show {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .badge {
        font-weight: 500;
      }

      .input-group .btn {
        z-index: 0;
      }

      .form-control:focus,
      .form-select:focus {
        box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
      }
    `,
  ],
})
export class PostJobComponent implements OnInit {
  jobForm!: FormGroup;
  isSubmitting = false;
  showSuccessModal = false;
  currentUser: User | null = null;

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
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
    });
  }

  private initializeForm(): void {
    this.jobForm = this.fb.group({
      title: ['', [Validators.required]],
      area: ['', [Validators.required]],
      modality: ['', [Validators.required]],
      location: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(100)]],
      requirements: this.fb.array([this.fb.control('', [Validators.required])]),
      deadline: ['', [Validators.required, this.dateValidator]],
    });
  }

  get requirements(): FormArray {
    return this.jobForm.get('requirements') as FormArray;
  }

  addRequirement(): void {
    this.requirements.push(this.fb.control('', [Validators.required]));
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  getMinDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  dateValidator(control: any) {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return selectedDate >= tomorrow ? null : { invalidDate: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.jobForm.invalid || !this.currentUser?.id) {
      Object.keys(this.jobForm.controls).forEach((key) => {
        this.jobForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    const formValue = this.jobForm.value;

    const jobData: Omit<Job, 'id' | 'applications' | 'publishDate'> = {
      title: formValue.title || '',
      description: formValue.description || '',
      requirements: formValue.requirements.filter(
        (req: string) => req.trim() !== ''
      ),
      salary: formValue.salary || '',
      location: formValue.location || '',
      modality: formValue.modality || 'presencial',
      deadline: new Date(formValue.deadline),
      employerId: this.currentUser.id,
      area: formValue.area || '',
      status: 'active',
    };

    this.jobService.createJob(jobData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccessModal = true;
      },
      error: () => {
        this.isSubmitting = false;
        alert('Error al publicar la oferta de empleo');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/employer/jobs']);
  }

  goToJobsList(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/employer/jobs']);
  }

  createAnother(): void {
    this.showSuccessModal = false;
    this.jobForm.reset();
    this.initializeForm();
    window.scrollTo(0, 0);
  }
}
