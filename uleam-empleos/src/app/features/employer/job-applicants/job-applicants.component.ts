import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Application,
  Job,
  User,
  GraduateProfile,
} from '../../../core/models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-job-applicants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>
            <i class="bi bi-people me-2"></i>
            Postulantes
          </h2>
          <p class="text-muted mb-0" *ngIf="job">
            {{ job.title }} - {{ applications.length }} postulaciones
          </p>
        </div>
        <a routerLink="/employer/jobs" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left me-2"></i>
          Volver a Ofertas
        </a>
      </div>

      <!-- Job Info Card -->
      <div class="card mb-4" *ngIf="job">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="d-flex flex-wrap align-items-center mb-2">
                <span class="badge bg-primary me-2 mb-1">{{ job.area }}</span>
                <span class="badge bg-secondary me-2 mb-1">{{
                  job.modality
                }}</span>
                <span
                  class="badge me-2 mb-1"
                  [ngClass]="{
                    'bg-success': job.status === 'active',
                    'bg-warning': job.status === 'inactive',
                    'bg-secondary': job.status === 'closed'
                  }"
                >
                  {{ getStatusText(job.status) }}
                </span>
              </div>
              <h5 class="mb-2">{{ job.title }}</h5>
              <p class="text-muted mb-0">
                <i class="bi bi-geo-alt me-2"></i>{{ job.location }} •
                <i class="bi bi-currency-dollar me-2 ms-3"></i
                >{{ job.salary }} •
                <i class="bi bi-calendar-x me-2 ms-3"></i>Vence:
                {{ job.deadline | date : 'dd/MM/yyyy' }}
              </p>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="row text-center">
                <div class="col-3">
                  <div class="text-warning">
                    <strong>{{ getPendingCount() }}</strong>
                    <small class="d-block">Pendientes</small>
                  </div>
                </div>
                <div class="col-3">
                  <div class="text-info">
                    <strong>{{ getReviewedCount() }}</strong>
                    <small class="d-block">Revisadas</small>
                  </div>
                </div>
                <div class="col-3">
                  <div class="text-success">
                    <strong>{{ getAcceptedCount() }}</strong>
                    <small class="d-block">Aceptadas</small>
                  </div>
                </div>
                <div class="col-3">
                  <div class="text-danger">
                    <strong>{{ getRejectedCount() }}</strong>
                    <small class="d-block">Rechazadas</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-4">
              <label for="statusFilter" class="form-label"
                >Filtrar por estado</label
              >
              <select
                class="form-select"
                id="statusFilter"
                [(ngModel)]="statusFilter"
                (change)="applyFilters()"
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="reviewed">Revisada</option>
                <option value="accepted">Aceptado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="sortFilter" class="form-label">Ordenar por</label>
              <select
                class="form-select"
                id="sortFilter"
                [(ngModel)]="sortFilter"
                (change)="applyFilters()"
              >
                <option value="date_desc">Fecha (más reciente)</option>
                <option value="date_asc">Fecha (más antigua)</option>
                <option value="name_asc">Nombre (A-Z)</option>
                <option value="name_desc">Nombre (Z-A)</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="searchFilter" class="form-label">Buscar</label>
              <input
                type="text"
                class="form-control"
                id="searchFilter"
                placeholder="Buscar por nombre..."
                [(ngModel)]="searchFilter"
                (input)="applyFilters()"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-3">Cargando postulaciones...</p>
      </div>

      <!-- No Applications -->
      <div
        *ngIf="!isLoading && applications.length === 0"
        class="text-center py-5"
      >
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h4>No hay postulaciones</h4>
        <p class="text-muted">
          Aún no han llegado postulaciones para esta oferta de empleo.
        </p>
      </div>

      <!-- Applications List -->
      <div class="row" *ngIf="!isLoading && filteredApplications.length > 0">
        <div class="col-12" *ngFor="let appWithProfile of filteredApplications">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <div class="d-flex align-items-start">
                    <!-- Profile Image -->
                    <div class="me-3">
                      <div
                        class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                        style="width: 60px; height: 60px; font-size: 1.5rem;"
                      >
                        {{ getInitials(appWithProfile.graduateProfile) }}
                      </div>
                    </div>

                    <!-- Application Info -->
                    <div class="flex-grow-1">
                      <div class="d-flex flex-wrap align-items-center mb-2">
                        <span
                          class="badge me-2 mb-1"
                          [ngClass]="{
                            'bg-warning':
                              appWithProfile.application.status === 'pending',
                            'bg-info':
                              appWithProfile.application.status === 'reviewed',
                            'bg-success':
                              appWithProfile.application.status === 'accepted',
                            'bg-danger':
                              appWithProfile.application.status === 'rejected'
                          }"
                        >
                          {{
                            getApplicationStatusText(
                              appWithProfile.application.status
                            )
                          }}
                        </span>
                        <small class="text-muted mb-1">
                          Postulado el
                          {{
                            appWithProfile.application.applicationDate
                              | date : 'dd/MM/yyyy HH:mm'
                          }}
                        </small>
                      </div>

                      <h5 class="mb-1">
                        {{ appWithProfile.graduateProfile?.firstName }}
                        {{ appWithProfile.graduateProfile?.lastName }}
                      </h5>

                      <div class="row text-muted mb-2">
                        <div
                          class="col-sm-6"
                          *ngIf="appWithProfile.graduateProfile?.phone"
                        >
                          <i class="bi bi-telephone me-2"></i>
                          {{ appWithProfile.graduateProfile?.phone }}
                        </div>
                        <div
                          class="col-sm-6"
                          *ngIf="appWithProfile.graduateProfile?.address"
                        >
                          <i class="bi bi-geo-alt me-2"></i>
                          {{ appWithProfile.graduateProfile?.address }}
                        </div>
                      </div>

                      <!-- Cover Letter Preview -->
                      <div class="mb-2">
                        <h6 class="mb-1">
                          <i class="bi bi-file-text me-2"></i>
                          Carta de presentación
                        </h6>
                        <p
                          class="text-muted mb-0"
                          [class.collapsed]="!appWithProfile.showFullCover"
                          style="white-space: pre-line;"
                        >
                          <span *ngIf="!appWithProfile.showFullCover">
                            {{
                              appWithProfile.application.coverLetter.substring(
                                0,
                                200
                              )
                            }}
                            <span
                              *ngIf="
                                appWithProfile.application.coverLetter.length >
                                200
                              "
                              >...</span
                            >
                          </span>
                          <span *ngIf="appWithProfile.showFullCover">
                            {{ appWithProfile.application.coverLetter }}
                          </span>
                        </p>
                        <button
                          *ngIf="
                            appWithProfile.application.coverLetter.length > 200
                          "
                          class="btn btn-link btn-sm p-0"
                          (click)="
                            appWithProfile.showFullCover =
                              !appWithProfile.showFullCover
                          "
                        >
                          {{
                            appWithProfile.showFullCover
                              ? 'Ver menos'
                              : 'Ver más'
                          }}
                        </button>
                      </div>

                      <!-- Skills -->
                      <div
                        *ngIf="appWithProfile.graduateProfile?.skills?.length"
                      >
                        <h6 class="mb-1">Habilidades</h6>
                        <div class="d-flex flex-wrap">
                          <span
                            *ngFor="
                              let skill of appWithProfile.graduateProfile?.skills?.slice(
                                0,
                                5
                              )
                            "
                            class="badge bg-light text-dark me-1 mb-1"
                          >
                            {{ skill }}
                          </span>
                          <span
                            *ngIf="
                              (appWithProfile.graduateProfile?.skills?.length ||
                                0) > 5
                            "
                            class="badge bg-secondary me-1 mb-1"
                          >
                            +{{
                              (appWithProfile.graduateProfile?.skills?.length ||
                                0) - 5
                            }}
                            más
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-md-4 text-md-end">
                  <div class="d-flex flex-column h-100 justify-content-between">
                    <!-- Status Actions -->
                    <div class="mb-3">
                      <div class="d-grid gap-2">
                        <!-- Mark as Reviewed -->
                        <button
                          *ngIf="
                            appWithProfile.application.status === 'pending'
                          "
                          class="btn btn-outline-info btn-sm"
                          (click)="
                            updateApplicationStatus(
                              appWithProfile.application,
                              'reviewed'
                            )
                          "
                        >
                          <i class="bi bi-eye me-2"></i>
                          Marcar como Revisada
                        </button>

                        <!-- Accept -->
                        <button
                          *ngIf="
                            appWithProfile.application.status !== 'accepted'
                          "
                          class="btn btn-success btn-sm"
                          (click)="
                            updateApplicationStatus(
                              appWithProfile.application,
                              'accepted'
                            )
                          "
                        >
                          <i class="bi bi-check-circle me-2"></i>
                          Aceptar
                        </button>

                        <!-- Reject -->
                        <button
                          *ngIf="
                            appWithProfile.application.status !== 'rejected'
                          "
                          class="btn btn-outline-danger btn-sm"
                          (click)="
                            updateApplicationStatus(
                              appWithProfile.application,
                              'rejected'
                            )
                          "
                        >
                          <i class="bi bi-x-circle me-2"></i>
                          Rechazar
                        </button>

                        <!-- Contact Info for Accepted -->
                        <div
                          *ngIf="
                            appWithProfile.application.status === 'accepted'
                          "
                          class="alert alert-success p-2 small"
                        >
                          <i class="bi bi-check-circle me-1"></i>
                          <strong>Candidato Aceptado</strong>
                          <div class="mt-1">
                            Contacta al graduado para coordinar la entrevista o
                            siguiente paso.
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- View Profile -->
                    <div>
                      <button
                        class="btn btn-outline-primary btn-sm w-100"
                        (click)="viewProfile(appWithProfile)"
                      >
                        <i class="bi bi-person me-2"></i>
                        Ver Perfil Completo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <nav *ngIf="totalPages > 1" aria-label="Paginación">
        <ul class="pagination justify-content-center">
          <li class="page-item" [class.disabled]="currentPage === 1">
            <button class="page-link" (click)="goToPage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li
            class="page-item"
            *ngFor="let page of getPageNumbers()"
            [class.active]="page === currentPage"
          >
            <button class="page-link" (click)="goToPage(page)">
              {{ page }}
            </button>
          </li>
          <li class="page-item" [class.disabled]="currentPage === totalPages">
            <button class="page-link" (click)="goToPage(currentPage + 1)">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>

    <!-- Profile Modal -->
    <div
      class="modal fade"
      [class.show]="showProfileModal"
      [style.display]="showProfileModal ? 'block' : 'none'"
      tabindex="-1"
      *ngIf="showProfileModal"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-person-circle me-2"></i>
              Perfil del Candidato
            </h5>
            <button
              type="button"
              class="btn-close"
              (click)="showProfileModal = false"
            ></button>
          </div>
          <div class="modal-body" *ngIf="selectedProfile">
            <div class="row">
              <div class="col-md-4 text-center">
                <div
                  class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style="width: 120px; height: 120px; font-size: 2rem;"
                >
                  {{ getInitials(selectedProfile.graduateProfile) }}
                </div>
                <h5>
                  {{ selectedProfile.graduateProfile?.firstName }}
                  {{ selectedProfile.graduateProfile?.lastName }}
                </h5>
                <div
                  class="badge"
                  [ngClass]="{
                    'bg-warning':
                      selectedProfile.application.status === 'pending',
                    'bg-info':
                      selectedProfile.application.status === 'reviewed',
                    'bg-success':
                      selectedProfile.application.status === 'accepted',
                    'bg-danger':
                      selectedProfile.application.status === 'rejected'
                  }"
                >
                  {{
                    getApplicationStatusText(selectedProfile.application.status)
                  }}
                </div>
              </div>
              <div class="col-md-8">
                <div
                  class="mb-3"
                  *ngIf="selectedProfile.graduateProfile?.phone"
                >
                  <h6><i class="bi bi-telephone me-2"></i>Contacto</h6>
                  <p class="mb-1">
                    {{ selectedProfile.graduateProfile?.phone }}
                  </p>
                  <p
                    class="text-muted small mb-0"
                    *ngIf="selectedProfile.graduateProfile?.address"
                  >
                    {{ selectedProfile.graduateProfile?.address }}
                  </p>
                </div>

                <div
                  class="mb-3"
                  *ngIf="selectedProfile.graduateProfile?.education?.length"
                >
                  <h6><i class="bi bi-mortarboard me-2"></i>Educación</h6>
                  <div
                    *ngFor="
                      let edu of selectedProfile.graduateProfile?.education
                    "
                    class="mb-2"
                  >
                    <strong>{{ edu.degree }}</strong>
                    <div class="text-muted small">
                      {{ edu.institution }} ({{
                        edu.startDate | date : 'yyyy'
                      }}
                      -
                      {{
                        edu.current
                          ? 'Presente'
                          : (edu.endDate | date : 'yyyy')
                      }})
                    </div>
                  </div>
                </div>

                <div
                  class="mb-3"
                  *ngIf="selectedProfile.graduateProfile?.experience?.length"
                >
                  <h6><i class="bi bi-briefcase me-2"></i>Experiencia</h6>
                  <div
                    *ngFor="
                      let exp of selectedProfile.graduateProfile?.experience
                    "
                    class="mb-2"
                  >
                    <strong>{{ exp.position }}</strong>
                    <div class="text-muted small">
                      {{ exp.company }} ({{ exp.startDate | date : 'yyyy' }} -
                      {{
                        exp.current
                          ? 'Presente'
                          : (exp.endDate | date : 'yyyy')
                      }})
                    </div>
                    <p class="small mb-0">{{ exp.description }}</p>
                  </div>
                </div>

                <div *ngIf="selectedProfile.graduateProfile?.skills?.length">
                  <h6><i class="bi bi-gear me-2"></i>Habilidades</h6>
                  <div class="d-flex flex-wrap">
                    <span
                      *ngFor="
                        let skill of selectedProfile.graduateProfile?.skills
                      "
                      class="badge bg-primary me-1 mb-1"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            <div>
              <h6><i class="bi bi-file-text me-2"></i>Carta de Presentación</h6>
              <p style="white-space: pre-line;">
                {{ selectedProfile.application.coverLetter }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="showProfileModal = false"
            >
              Cerrar
            </button>
            <button
              *ngIf="selectedProfile?.application?.status !== 'accepted'"
              type="button"
              class="btn btn-success"
              (click)="
                updateApplicationStatus(
                  selectedProfile?.application!,
                  'accepted'
                );
                showProfileModal = false
              "
            >
              <i class="bi bi-check-circle me-2"></i>
              Aceptar Candidato
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" *ngIf="showProfileModal"></div>
  `,
  styles: [
    `
      .badge {
        font-weight: 500;
      }

      .card {
        transition: all 0.2s ease-in-out;
      }

      .card:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }

      .modal.show {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .collapsed {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `,
  ],
})
export class JobApplicantsComponent implements OnInit {
  job: Job | null = null;
  applications: Application[] = [];
  filteredApplications: {
    application: Application;
    graduateProfile: GraduateProfile | null;
    showFullCover: boolean;
  }[] = [];

  isLoading = true;

  // Filters
  statusFilter = '';
  sortFilter = 'date_desc';
  searchFilter = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Modal
  showProfileModal = false;
  selectedProfile: {
    application: Application;
    graduateProfile: GraduateProfile | null;
  } | null = null;

  constructor(
    private route: ActivatedRoute,
    private applicationService: ApplicationService,
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadJobAndApplications();
  }

  private loadJobAndApplications(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    if (!jobId) return;

    forkJoin([
      this.jobService.getJobById(jobId),
      this.applicationService.getApplicationsByJob(jobId),
    ]).subscribe({
      next: ([job, applications]) => {
        this.job = job;
        this.applications = applications;
        this.loadGraduateProfiles();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private loadGraduateProfiles(): void {
    if (this.applications.length === 0) {
      this.isLoading = false;
      this.applyFilters();
      return;
    }

    // Get graduate profiles for each application
    const profileRequests = this.applications.map((app) =>
      this.authService.getUserById(app.graduateId)
    );

    forkJoin(profileRequests).subscribe({
      next: (users) => {
        this.filteredApplications = this.applications.map((app, index) => ({
          application: app,
          graduateProfile: (users[index]?.profile as GraduateProfile) || null,
          showFullCover: false,
        }));
        this.isLoading = false;
        this.applyFilters();
      },
      error: () => {
        this.filteredApplications = this.applications.map((app) => ({
          application: app,
          graduateProfile: null,
          showFullCover: false,
        }));
        this.isLoading = false;
        this.applyFilters();
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.filteredApplications];

    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(
        (item) => item.application.status === this.statusFilter
      );
    }

    // Search filter
    if (this.searchFilter.trim()) {
      const searchTerm = this.searchFilter.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const fullName =
          `${item.graduateProfile?.firstName} ${item.graduateProfile?.lastName}`.toLowerCase();
        return fullName.includes(searchTerm);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortFilter) {
        case 'date_asc':
          return (
            new Date(a.application.applicationDate).getTime() -
            new Date(b.application.applicationDate).getTime()
          );
        case 'date_desc':
          return (
            new Date(b.application.applicationDate).getTime() -
            new Date(a.application.applicationDate).getTime()
          );
        case 'name_asc':
          const nameA =
            `${a.graduateProfile?.firstName} ${a.graduateProfile?.lastName}`.toLowerCase();
          const nameB =
            `${b.graduateProfile?.firstName} ${b.graduateProfile?.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        case 'name_desc':
          const nameA2 =
            `${a.graduateProfile?.firstName} ${a.graduateProfile?.lastName}`.toLowerCase();
          const nameB2 =
            `${b.graduateProfile?.firstName} ${b.graduateProfile?.lastName}`.toLowerCase();
          return nameB2.localeCompare(nameA2);
        default:
          return 0;
      }
    });

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredApplications = filtered.slice(startIndex, endIndex);
  }

  getPendingCount(): number {
    return this.applications.filter((app) => app.status === 'pending').length;
  }

  getReviewedCount(): number {
    return this.applications.filter((app) => app.status === 'reviewed').length;
  }

  getAcceptedCount(): number {
    return this.applications.filter((app) => app.status === 'accepted').length;
  }

  getRejectedCount(): number {
    return this.applications.filter((app) => app.status === 'rejected').length;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Activo',
      inactive: 'Inactivo',
      closed: 'Cerrado',
    };
    return statusMap[status] || status;
  }

  getApplicationStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      reviewed: 'Revisada',
      accepted: 'Aceptado',
      rejected: 'Rechazado',
    };
    return statusMap[status] || status;
  }

  getInitials(profile: GraduateProfile | null): string {
    if (!profile) return 'U';
    const firstInitial = profile.firstName?.charAt(0) || '';
    const lastInitial = profile.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase() || 'U';
  }

  updateApplicationStatus(
    application: Application,
    newStatus: 'pending' | 'reviewed' | 'accepted' | 'rejected'
  ): void {
    this.applicationService
      .updateApplicationStatus(application.id, newStatus)
      .subscribe({
        next: (updatedApp) => {
          // Update local data
          const appIndex = this.applications.findIndex(
            (a) => a.id === application.id
          );
          if (appIndex !== -1) {
            this.applications[appIndex] = updatedApp;
          }

          const filteredIndex = this.filteredApplications.findIndex(
            (a) => a.application.id === application.id
          );
          if (filteredIndex !== -1) {
            this.filteredApplications[filteredIndex].application = updatedApp;
          }
        },
        error: () => {
          alert('Error al actualizar el estado de la postulación');
        },
      });
  }

  viewProfile(appWithProfile: {
    application: Application;
    graduateProfile: GraduateProfile | null;
  }): void {
    this.selectedProfile = appWithProfile;
    this.showProfileModal = true;
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
