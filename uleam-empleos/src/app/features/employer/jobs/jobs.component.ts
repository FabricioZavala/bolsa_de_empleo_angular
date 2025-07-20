import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Application, User } from '../../../core/models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-employer-jobs',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="bi bi-briefcase me-2"></i>
          Mis Ofertas de Empleo
        </h2>
        <a routerLink="/employer/post-job" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>
          Nueva Oferta
        </a>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <i class="bi bi-briefcase display-4 mb-2"></i>
              <h5 class="card-title">{{ jobs.length }}</h5>
              <p class="card-text">Total Ofertas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <i class="bi bi-check-circle display-4 mb-2"></i>
              <h5 class="card-title">{{ getActiveJobsCount() }}</h5>
              <p class="card-text">Activas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-info text-white">
            <div class="card-body text-center">
              <i class="bi bi-people display-4 mb-2"></i>
              <h5 class="card-title">{{ getTotalApplicationsCount() }}</h5>
              <p class="card-text">Postulaciones</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <i class="bi bi-clock display-4 mb-2"></i>
              <h5 class="card-title">{{ getPendingApplicationsCount() }}</h5>
              <p class="card-text">Pendientes</p>
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
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="areaFilter" class="form-label"
                >Filtrar por área</label
              >
              <select
                class="form-select"
                id="areaFilter"
                [(ngModel)]="areaFilter"
                (change)="applyFilters()"
              >
                <option value="">Todas las áreas</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Administración">Administración</option>
                <option value="Ventas">Ventas</option>
                <option value="Marketing">Marketing</option>
                <option value="Finanzas">Finanzas</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Construcción">Construcción</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="searchFilter" class="form-label">Buscar</label>
              <input
                type="text"
                class="form-control"
                id="searchFilter"
                placeholder="Buscar por título..."
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
        <p class="text-muted mt-3">Cargando tus ofertas de empleo...</p>
      </div>

      <!-- No Jobs -->
      <div
        *ngIf="!isLoading && filteredJobs.length === 0"
        class="text-center py-5"
      >
        <i class="bi bi-briefcase display-1 text-muted mb-3"></i>
        <h4>No tienes ofertas de empleo</h4>
        <p class="text-muted mb-4">
          <span *ngIf="hasFilters()"
            >No se encontraron ofertas con los filtros aplicados.</span
          >
          <span *ngIf="!hasFilters()"
            >Comienza creando tu primera oferta de empleo.</span
          >
        </p>
        <a routerLink="/employer/post-job" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>
          Crear Primera Oferta
        </a>
      </div>

      <!-- Jobs List -->
      <div class="row" *ngIf="!isLoading && filteredJobs.length > 0">
        <div class="col-12" *ngFor="let jobWithApps of filteredJobs">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <div class="d-flex flex-wrap align-items-center mb-2">
                    <span
                      class="badge me-2 mb-1"
                      [ngClass]="{
                        'bg-success': jobWithApps.job.status === 'active',
                        'bg-warning': jobWithApps.job.status === 'inactive',
                        'bg-secondary': jobWithApps.job.status === 'closed'
                      }"
                    >
                      {{ getStatusText(jobWithApps.job.status) }}
                    </span>
                    <span class="badge bg-primary me-2 mb-1">{{
                      jobWithApps.job.area
                    }}</span>
                    <span class="badge bg-info me-2 mb-1">{{
                      jobWithApps.job.modality
                    }}</span>
                    <small class="text-muted mb-1">
                      Publicado:
                      {{ jobWithApps.job.publishDate | date : 'dd/MM/yyyy' }}
                    </small>
                  </div>

                  <h5 class="mb-2">{{ jobWithApps.job.title }}</h5>

                  <div class="row text-muted mb-3">
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-geo-alt me-2"></i>
                      {{ jobWithApps.job.location }}
                    </div>
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-currency-dollar me-2"></i>
                      {{ jobWithApps.job.salary }}
                    </div>
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-people me-2"></i>
                      {{ jobWithApps.applications.length }} postulaciones
                    </div>
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-calendar-x me-2"></i>
                      Vence:
                      {{ jobWithApps.job.deadline | date : 'dd/MM/yyyy' }}
                    </div>
                  </div>

                  <p class="text-muted mb-2">
                    {{ jobWithApps.job.description.substring(0, 150) }}...
                  </p>

                  <!-- Application Stats -->
                  <div class="row">
                    <div class="col-6 col-md-3">
                      <small class="text-warning">
                        <i class="bi bi-clock me-1"></i>
                        {{
                          getApplicationsByStatus(
                            jobWithApps.applications,
                            'pending'
                          ).length
                        }}
                        Pendientes
                      </small>
                    </div>
                    <div class="col-6 col-md-3">
                      <small class="text-info">
                        <i class="bi bi-eye me-1"></i>
                        {{
                          getApplicationsByStatus(
                            jobWithApps.applications,
                            'reviewed'
                          ).length
                        }}
                        Revisadas
                      </small>
                    </div>
                    <div class="col-6 col-md-3">
                      <small class="text-success">
                        <i class="bi bi-check-circle me-1"></i>
                        {{
                          getApplicationsByStatus(
                            jobWithApps.applications,
                            'accepted'
                          ).length
                        }}
                        Aceptadas
                      </small>
                    </div>
                    <div class="col-6 col-md-3">
                      <small class="text-danger">
                        <i class="bi bi-x-circle me-1"></i>
                        {{
                          getApplicationsByStatus(
                            jobWithApps.applications,
                            'rejected'
                          ).length
                        }}
                        Rechazadas
                      </small>
                    </div>
                  </div>
                </div>

                <div class="col-md-4 text-md-end">
                  <div class="d-flex flex-column h-100 justify-content-between">
                    <!-- Days remaining -->
                    <div class="mb-3">
                      <div
                        *ngIf="
                          getDaysUntilDeadline(jobWithApps.job.deadline) > 0
                        "
                        class="text-muted"
                      >
                        <i class="bi bi-calendar-event me-2"></i>
                        <small
                          >{{
                            getDaysUntilDeadline(jobWithApps.job.deadline)
                          }}
                          días restantes</small
                        >
                      </div>
                      <div
                        *ngIf="
                          getDaysUntilDeadline(jobWithApps.job.deadline) <= 0
                        "
                        class="text-danger"
                      >
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <small>Oferta vencida</small>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="d-grid gap-2">
                      <a
                        [routerLink]="[
                          '/employer/applicants',
                          jobWithApps.job.id
                        ]"
                        class="btn btn-primary btn-sm"
                      >
                        <i class="bi bi-people me-2"></i>
                        Ver Postulaciones ({{
                          jobWithApps.applications.length
                        }})
                      </a>

                      <div class="dropdown">
                        <button
                          class="btn btn-outline-secondary btn-sm dropdown-toggle w-100"
                          type="button"
                          [id]="'dropdownMenuButton' + jobWithApps.job.id"
                          data-bs-toggle="dropdown"
                        >
                          <i class="bi bi-gear me-2"></i>
                          Estado
                        </button>
                        <ul class="dropdown-menu w-100">
                          <li>
                            <button
                              class="dropdown-item"
                              (click)="
                                changeJobStatus(jobWithApps.job, 'active')
                              "
                              [class.active]="
                                jobWithApps.job.status === 'active'
                              "
                            >
                              <i
                                class="bi bi-check-circle me-2 text-success"
                              ></i>
                              Activar
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              (click)="
                                changeJobStatus(jobWithApps.job, 'inactive')
                              "
                              [class.active]="
                                jobWithApps.job.status === 'inactive'
                              "
                            >
                              <i
                                class="bi bi-pause-circle me-2 text-warning"
                              ></i>
                              Pausar
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              (click)="
                                changeJobStatus(jobWithApps.job, 'closed')
                              "
                              [class.active]="
                                jobWithApps.job.status === 'closed'
                              "
                            >
                              <i class="bi bi-x-circle me-2 text-secondary"></i>
                              Cerrar
                            </button>
                          </li>
                          <li><hr class="dropdown-divider" /></li>
                          <li>
                            <button
                              class="dropdown-item text-danger"
                              (click)="deleteJob(jobWithApps.job)"
                            >
                              <i class="bi bi-trash me-2"></i>
                              Eliminar
                            </button>
                          </li>
                        </ul>
                      </div>
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

    <!-- Delete Confirmation Modal -->
    <div
      class="modal fade"
      [class.show]="showDeleteModal"
      [style.display]="showDeleteModal ? 'block' : 'none'"
      tabindex="-1"
      *ngIf="showDeleteModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Confirmar Eliminación
            </h5>
            <button
              type="button"
              class="btn-close"
              (click)="showDeleteModal = false"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              ¿Estás seguro de que deseas eliminar la oferta de empleo
              <strong>"{{ jobToDelete?.title }}"</strong>?
            </p>
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Esta acción no se puede deshacer y se eliminarán todas las
              postulaciones asociadas.
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="showDeleteModal = false"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              (click)="confirmDelete()"
            >
              <i class="bi bi-trash me-2"></i>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" *ngIf="showDeleteModal"></div>
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

      .dropdown-item.active {
        background-color: #e9ecef;
      }
    `,
  ],
})
export class EmployerJobsComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: { job: Job; applications: Application[] }[] = [];
  isLoading = true;
  currentUser: User | null = null;

  // Filters
  statusFilter = '';
  areaFilter = '';
  searchFilter = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Delete modal
  showDeleteModal = false;
  jobToDelete: Job | null = null;

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user && user.role === 'employer') {
        this.loadJobs();
      }
    });
  }

  private loadJobs(): void {
    if (!this.currentUser?.id) return;

    this.jobService.getJobsByEmployer(this.currentUser.id).subscribe({
      next: (jobs) => {
        this.jobs = jobs.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
        this.loadApplicationsForJobs();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private loadApplicationsForJobs(): void {
    if (this.jobs.length === 0) {
      this.isLoading = false;
      this.applyFilters();
      return;
    }

    const applicationRequests = this.jobs.map((job) =>
      this.applicationService.getApplicationsByJob(job.id)
    );

    forkJoin(applicationRequests).subscribe({
      next: (applicationsArrays) => {
        this.filteredJobs = this.jobs.map((job, index) => ({
          job,
          applications: applicationsArrays[index] || [],
        }));
        this.isLoading = false;
        this.applyFilters();
      },
      error: () => {
        this.filteredJobs = this.jobs.map((job) => ({
          job,
          applications: [],
        }));
        this.isLoading = false;
        this.applyFilters();
      },
    });
  }

  applyFilters(): void {
    let filtered = [...this.filteredJobs];

    // Status filter
    if (this.statusFilter) {
      filtered = filtered.filter(
        (item) => item.job.status === this.statusFilter
      );
    }

    // Area filter
    if (this.areaFilter) {
      filtered = filtered.filter((item) => item.job.area === this.areaFilter);
    }

    // Search filter
    if (this.searchFilter.trim()) {
      const searchTerm = this.searchFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.job.title.toLowerCase().includes(searchTerm) ||
          item.job.description.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredJobs = filtered.slice(startIndex, endIndex);
  }

  hasFilters(): boolean {
    return !!(this.statusFilter || this.areaFilter || this.searchFilter.trim());
  }

  getActiveJobsCount(): number {
    return this.jobs.filter((job) => job.status === 'active').length;
  }

  getTotalApplicationsCount(): number {
    return this.filteredJobs.reduce(
      (total, item) => total + item.applications.length,
      0
    );
  }

  getPendingApplicationsCount(): number {
    return this.filteredJobs.reduce(
      (total, item) =>
        total +
        this.getApplicationsByStatus(item.applications, 'pending').length,
      0
    );
  }

  getApplicationsByStatus(
    applications: Application[],
    status: string
  ): Application[] {
    return applications.filter((app) => app.status === status);
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Activo',
      inactive: 'Inactivo',
      closed: 'Cerrado',
    };
    return statusMap[status] || status;
  }

  getDaysUntilDeadline(deadline: Date): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  changeJobStatus(job: Job, newStatus: 'active' | 'inactive' | 'closed'): void {
    const updatedJob: Job = { ...job, status: newStatus };
    this.jobService.updateJob(updatedJob.id, updatedJob).subscribe({
      next: () => {
        // Update local data
        const index = this.jobs.findIndex((j) => j.id === job.id);
        if (index !== -1) {
          this.jobs[index] = updatedJob;
          this.applyFilters();
        }
      },
      error: () => {
        alert('Error al actualizar el estado del empleo');
      },
    });
  }

  deleteJob(job: Job): void {
    this.jobToDelete = job;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.jobToDelete) return;

    this.jobService.deleteJob(this.jobToDelete.id).subscribe({
      next: () => {
        // Remove from local array
        this.jobs = this.jobs.filter((j) => j.id !== this.jobToDelete!.id);
        this.filteredJobs = this.filteredJobs.filter(
          (item) => item.job.id !== this.jobToDelete!.id
        );

        this.showDeleteModal = false;
        this.jobToDelete = null;
        this.applyFilters();
      },
      error: () => {
        alert('Error al eliminar el empleo');
        this.showDeleteModal = false;
        this.jobToDelete = null;
      },
    });
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
