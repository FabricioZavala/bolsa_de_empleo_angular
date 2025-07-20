import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="bi bi-person-circle me-2"></i>
          Mi Perfil
        </h2>
        <div>
          <button
            class="btn btn-outline-primary me-2"
            (click)="toggleEditMode()"
            [disabled]="isSaving"
          >
            <i
              class="bi"
              [ngClass]="isEditing ? 'bi-x-lg' : 'bi-pencil'"
              class="me-2"
            ></i>
            {{ isEditing ? 'Cancelar' : 'Editar' }}
          </button>
          <button
            *ngIf="isEditing"
            class="btn btn-success"
            (click)="saveProfile()"
            [disabled]="isSaving || !profileForm.valid"
          >
            <i class="bi bi-check-lg me-2"></i>
            <span *ngIf="!isSaving">Guardar</span>
            <span *ngIf="isSaving">Guardando...</span>
          </button>
        </div>
      </div>

      <div class="row" *ngIf="currentUser">
        <!-- Profile Image and Basic Info -->
        <div class="col-lg-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <!-- Profile Image -->
              <div class="mb-3">
                <div class="position-relative d-inline-block">
                  <div
                    class="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white"
                    style="width: 150px; height: 150px; border: 4px solid #e9ecef; font-size: 3rem;"
                  >
                    <i class="bi bi-person-fill"></i>
                  </div>
                </div>
              </div>

              <!-- Basic Info -->
              <h4 class="mb-1">
                {{ profileData.name }} {{ profileData.lastName }}
              </h4>
              <p class="text-muted mb-3">{{ profileData.email }}</p>

              <!-- Status Badge -->
              <span class="badge bg-success fs-6 mb-3">
                <i class="bi bi-mortarboard me-2"></i>
                Graduado ULEAM
              </span>

              <!-- Stats -->
              <div class="row text-center mt-3">
                <div class="col-4">
                  <div class="border-end">
                    <h5 class="mb-0 text-primary">{{ applicationCount }}</h5>
                    <small class="text-muted">Postulaciones</small>
                  </div>
                </div>
                <div class="col-4">
                  <div class="border-end">
                    <h5 class="mb-0 text-success">{{ acceptedCount }}</h5>
                    <small class="text-muted">Aceptadas</small>
                  </div>
                </div>
                <div class="col-4">
                  <h5 class="mb-0 text-info">{{ profileScore }}</h5>
                  <small class="text-muted">Puntuación</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card mt-3">
            <div class="card-header">
              <h6 class="mb-0">
                <i class="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h6>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <a
                  routerLink="/graduate/jobs"
                  class="list-group-item list-group-item-action"
                >
                  <i class="bi bi-search me-3 text-primary"></i>
                  Buscar Empleos
                </a>
                <a
                  routerLink="/graduate/applications"
                  class="list-group-item list-group-item-action"
                >
                  <i class="bi bi-file-text me-3 text-info"></i>
                  Ver Mis Postulaciones
                </a>
                <button
                  class="list-group-item list-group-item-action text-danger"
                  (click)="logout()"
                >
                  <i class="bi bi-box-arrow-right me-3"></i>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="col-lg-8">
          <form #profileForm="ngForm">
            <!-- Personal Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-person me-2"></i>
                  Información Personal
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="name" class="form-label">Nombres</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      [(ngModel)]="profileData.name"
                      name="name"
                      [readonly]="!isEditing"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="lastName" class="form-label">Apellidos</label>
                    <input
                      type="text"
                      class="form-control"
                      id="lastName"
                      [(ngModel)]="profileData.lastName"
                      name="lastName"
                      [readonly]="!isEditing"
                      required
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      [(ngModel)]="profileData.email"
                      name="email"
                      readonly
                    />
                    <div class="form-text">El email no se puede cambiar</div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="phone" class="form-label">Teléfono</label>
                    <input
                      type="tel"
                      class="form-control"
                      id="phone"
                      [(ngModel)]="profileData.phone"
                      name="phone"
                      [readonly]="!isEditing"
                      placeholder="+593 99 123 4567"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="birthDate" class="form-label"
                      >Fecha de Nacimiento</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="birthDate"
                      [(ngModel)]="profileData.birthDate"
                      name="birthDate"
                      [readonly]="!isEditing"
                    />
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="address" class="form-label">Dirección</label>
                    <input
                      type="text"
                      class="form-control"
                      id="address"
                      [(ngModel)]="profileData.address"
                      name="address"
                      [readonly]="!isEditing"
                      placeholder="Ciudad, Provincia"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Academic Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-mortarboard me-2"></i>
                  Información Académica
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="career" class="form-label">Carrera</label>
                    <select
                      class="form-select"
                      id="career"
                      [(ngModel)]="profileData.career"
                      name="career"
                      [disabled]="!isEditing"
                      required
                    >
                      <option value="">Selecciona tu carrera</option>
                      <option value="Ingeniería en Sistemas">
                        Ingeniería en Sistemas
                      </option>
                      <option value="Ingeniería Civil">Ingeniería Civil</option>
                      <option value="Administración de Empresas">
                        Administración de Empresas
                      </option>
                      <option value="Contabilidad y Auditoría">
                        Contabilidad y Auditoría
                      </option>
                      <option value="Derecho">Derecho</option>
                      <option value="Medicina">Medicina</option>
                      <option value="Enfermería">Enfermería</option>
                      <option value="Psicología">Psicología</option>
                      <option value="Educación">Educación</option>
                      <option value="Arquitectura">Arquitectura</option>
                      <option value="Diseño Gráfico">Diseño Gráfico</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="graduationYear" class="form-label"
                      >Año de Graduación</label
                    >
                    <select
                      class="form-select"
                      id="graduationYear"
                      [(ngModel)]="profileData.graduationYear"
                      name="graduationYear"
                      [disabled]="!isEditing"
                      required
                    >
                      <option value="">Selecciona el año</option>
                      <option
                        *ngFor="let year of getYearOptions()"
                        [value]="year"
                      >
                        {{ year }}
                      </option>
                    </select>
                  </div>
                  <div class="col-12 mb-3">
                    <label for="academicAchievements" class="form-label"
                      >Logros Académicos</label
                    >
                    <textarea
                      class="form-control"
                      id="academicAchievements"
                      rows="3"
                      [(ngModel)]="profileData.academicAchievements"
                      name="academicAchievements"
                      [readonly]="!isEditing"
                      placeholder="Menciona tus logros académicos más destacados..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Professional Information -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-briefcase me-2"></i>
                  Información Profesional
                </h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="currentStatus" class="form-label"
                      >Estado Actual</label
                    >
                    <select
                      class="form-select"
                      id="currentStatus"
                      [(ngModel)]="profileData.currentStatus"
                      name="currentStatus"
                      [disabled]="!isEditing"
                    >
                      <option value="">Selecciona tu estado</option>
                      <option value="Buscando empleo">Buscando empleo</option>
                      <option value="Empleado">Empleado</option>
                      <option value="Emprendedor">Emprendedor</option>
                      <option value="Estudiando posgrado">
                        Estudiando posgrado
                      </option>
                      <option value="Freelancer">Freelancer</option>
                    </select>
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="preferredLocation" class="form-label"
                      >Ubicación Preferida</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="preferredLocation"
                      [(ngModel)]="profileData.preferredLocation"
                      name="preferredLocation"
                      [readonly]="!isEditing"
                      placeholder="Ciudad o región de preferencia"
                    />
                  </div>
                  <div class="col-12 mb-3">
                    <label for="skills" class="form-label">Habilidades</label>
                    <textarea
                      class="form-control"
                      id="skills"
                      rows="3"
                      [(ngModel)]="profileData.skills"
                      name="skills"
                      [readonly]="!isEditing"
                      placeholder="Lista tus habilidades principales separadas por comas..."
                    ></textarea>
                    <div class="form-text">
                      Ejemplo: JavaScript, Python, Trabajo en equipo, Liderazgo
                    </div>
                  </div>
                  <div class="col-12 mb-3">
                    <label for="experience" class="form-label"
                      >Experiencia Laboral</label
                    >
                    <textarea
                      class="form-control"
                      id="experience"
                      rows="4"
                      [(ngModel)]="profileData.experience"
                      name="experience"
                      [readonly]="!isEditing"
                      placeholder="Describe tu experiencia laboral, prácticas profesionales o proyectos relevantes..."
                    ></textarea>
                  </div>
                  <div class="col-12">
                    <label for="careerGoals" class="form-label"
                      >Objetivos Profesionales</label
                    >
                    <textarea
                      class="form-control"
                      id="careerGoals"
                      rows="3"
                      [(ngModel)]="profileData.careerGoals"
                      name="careerGoals"
                      [readonly]="!isEditing"
                      placeholder="Describe tus objetivos y metas profesionales a corto y largo plazo..."
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Alert -->
    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div class="toast" [class.show]="showSuccessToast" role="alert">
        <div class="toast-header bg-success text-white">
          <i class="bi bi-check-circle me-2"></i>
          <strong class="me-auto">Éxito</strong>
          <button
            type="button"
            class="btn-close btn-close-white"
            (click)="showSuccessToast = false"
          ></button>
        </div>
        <div class="toast-body">
          Tu perfil ha sido actualizado correctamente.
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .card {
        transition: all 0.2s ease-in-out;
      }

      .form-control:read-only,
      .form-select:disabled {
        background-color: #f8f9fa;
        border-color: #e9ecef;
      }

      .list-group-item:hover {
        background-color: #f8f9fa;
      }

      .border-end:last-child {
        border-right: none !important;
      }

      .toast.show {
        opacity: 1;
      }

      .toast {
        opacity: 0;
        transition: opacity 0.15s linear;
      }
    `,
  ],
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileForm', { static: false }) profileForm!: NgForm;

  currentUser: User | null = null;
  profileData: any = {};
  originalProfileData: any = {};
  isEditing = false;
  isSaving = false;
  showSuccessToast = false;

  // Stats
  applicationCount = 0;
  acceptedCount = 0;
  profileScore = 85;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.initializeProfileData();
        this.loadUserStats();
      }
    });
  }

  private initializeProfileData(): void {
    if (this.currentUser && this.currentUser.role === 'graduate') {
      const graduateProfile = this.currentUser.profile as any;
      this.profileData = {
        name: graduateProfile.firstName || '',
        lastName: graduateProfile.lastName || '',
        email: this.currentUser.email || '',
        phone: graduateProfile.phone || '',
        birthDate: graduateProfile.birthDate || '',
        address: graduateProfile.address || '',
        career: graduateProfile.career || '',
        graduationYear: graduateProfile.graduationYear || '',
        academicAchievements: graduateProfile.academicAchievements || '',
        currentStatus: graduateProfile.currentStatus || 'Buscando empleo',
        preferredLocation: graduateProfile.preferredLocation || '',
        skills: graduateProfile.skills?.join(', ') || '',
        experience:
          graduateProfile.experience
            ?.map((exp: any) => exp.description)
            .join('\n') || '',
        careerGoals: graduateProfile.careerGoals || '',
        profileImage: graduateProfile.profileImage || '',
        profileVisible: graduateProfile.profileVisible !== false,
        allowContactByEmployers:
          graduateProfile.allowContactByEmployers !== false,
        receiveJobAlerts: graduateProfile.receiveJobAlerts !== false,
      };
      this.originalProfileData = { ...this.profileData };
    }
  }

  private loadUserStats(): void {
    // Simulate loading stats from services
    // In a real app, you would call ApplicationService here
    this.applicationCount = 5;
    this.acceptedCount = 2;
    this.profileScore = this.calculateProfileScore();
  }

  private calculateProfileScore(): number {
    let score = 0;
    const fields = [
      'name',
      'lastName',
      'phone',
      'career',
      'graduationYear',
      'skills',
      'experience',
      'careerGoals',
    ];

    fields.forEach((field) => {
      if (this.profileData[field] && this.profileData[field].trim()) {
        score += 10;
      }
    });

    if (this.profileData.profileImage) score += 10;
    if (this.profileData.academicAchievements) score += 10;

    return Math.min(100, score);
  }

  toggleEditMode(): void {
    if (this.isEditing) {
      // Cancel editing - restore original data
      this.profileData = { ...this.originalProfileData };
    }
    this.isEditing = !this.isEditing;
  }

  saveProfile(): void {
    if (!this.currentUser) return;

    this.isSaving = true;

    // Simulate API call
    setTimeout(() => {
      // Update the current user with new data
      // In a real app, this would call an API to update the user
      // For now, we just simulate the update

      this.originalProfileData = { ...this.profileData };
      this.isEditing = false;
      this.isSaving = false;
      this.showSuccessToast = true;

      // Hide toast after 3 seconds
      setTimeout(() => {
        this.showSuccessToast = false;
      }, 3000);

      // Recalculate profile score
      this.profileScore = this.calculateProfileScore();
    }, 1000);
  }

  getInitials(): string {
    if (!this.currentUser || this.currentUser.role !== 'graduate') return 'U';
    const graduateProfile = this.currentUser.profile as any;
    const firstInitial = graduateProfile.firstName?.charAt(0) || '';
    const lastInitial = graduateProfile.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  }

  getYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
    for (let year = currentYear; year >= currentYear - 10; year--) {
      years.push(year);
    }
    return years;
  }

  changePhoto(): void {
    // In a real app, this would open a file picker
    const photoUrls = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    ];

    const randomIndex = Math.floor(Math.random() * photoUrls.length);
    this.profileData.profileImage = photoUrls[randomIndex];
  }

  logout(): void {
    this.authService.logout();
  }
}
