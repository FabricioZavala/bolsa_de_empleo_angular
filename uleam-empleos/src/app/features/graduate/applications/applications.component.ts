import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, Job, User } from '../../../core/models/user.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i class="bi bi-file-text me-2"></i>
          Mis Postulaciones
        </h2>
        <a routerLink="/graduate/jobs" class="btn btn-primary">
          <i class="bi bi-search me-2"></i>
          Buscar Empleos
        </a>
      </div>

      <!-- Summary Cards -->
      <div class="row mb-4">
        <div class="col-md-3">
          <div class="card bg-primary text-white">
            <div class="card-body text-center">
              <i class="bi bi-file-text display-4 mb-2"></i>
              <h5 class="card-title">{{ applications.length }}</h5>
              <p class="card-text">Total Postulaciones</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-warning text-white">
            <div class="card-body text-center">
              <i class="bi bi-clock display-4 mb-2"></i>
              <h5 class="card-title">{{ getPendingCount() }}</h5>
              <p class="card-text">Pendientes</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-success text-white">
            <div class="card-body text-center">
              <i class="bi bi-check-circle display-4 mb-2"></i>
              <h5 class="card-title">{{ getAcceptedCount() }}</h5>
              <p class="card-text">Aceptadas</p>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card bg-danger text-white">
            <div class="card-body text-center">
              <i class="bi bi-x-circle display-4 mb-2"></i>
              <h5 class="card-title">{{ getRejectedCount() }}</h5>
              <p class="card-text">Rechazadas</p>
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
              <label for="dateFilter" class="form-label"
                >Filtrar por fecha</label
              >
              <select
                class="form-select"
                id="dateFilter"
                [(ngModel)]="dateFilter"
                (change)="applyFilters()"
              >
                <option value="">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Últimos 3 meses</option>
              </select>
            </div>
            <div class="col-md-4">
              <label for="searchFilter" class="form-label"
                >Buscar por título</label
              >
              <input
                type="text"
                class="form-control"
                id="searchFilter"
                placeholder="Buscar empleos..."
                [(ngModel)]="searchFilter"
                (input)="applyFilters()"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Applications List -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-3">Cargando tus postulaciones...</p>
      </div>

      <div
        *ngIf="!isLoading && filteredApplications.length === 0"
        class="text-center py-5"
      >
        <i class="bi bi-inbox display-1 text-muted mb-3"></i>
        <h4>No tienes postulaciones</h4>
        <p class="text-muted mb-4">
          <span *ngIf="hasFilters()"
            >No se encontraron postulaciones con los filtros aplicados.</span
          >
          <span *ngIf="!hasFilters()"
            >Aún no te has postulado a ningún empleo.</span
          >
        </p>
        <a routerLink="/graduate/jobs" class="btn btn-primary">
          <i class="bi bi-search me-2"></i>
          Buscar Empleos
        </a>
      </div>

      <div class="row" *ngIf="!isLoading && filteredApplications.length > 0">
        <div class="col-12" *ngFor="let item of filteredApplications">
          <div class="card mb-3">
            <div class="card-body">
              <div class="row">
                <div class="col-md-8">
                  <div class="d-flex flex-wrap align-items-center mb-2">
                    <span
                      class="badge me-2 mb-1"
                      [ngClass]="{
                        'bg-warning': item.application.status === 'pending',
                        'bg-info': item.application.status === 'reviewed',
                        'bg-success': item.application.status === 'accepted',
                        'bg-danger': item.application.status === 'rejected'
                      }"
                    >
                      {{ getStatusText(item.application.status) }}
                    </span>
                    <span class="badge bg-secondary me-2 mb-1" *ngIf="item.job">
                      {{ item.job.area }}
                    </span>
                    <small class="text-muted mb-1">
                      Postulado el
                      {{
                        item.application.applicationDate | date : 'dd/MM/yyyy'
                      }}
                    </small>
                  </div>

                  <h5 class="mb-2">
                    <a
                      [routerLink]="['/graduate/jobs', item.application.jobId]"
                      class="text-decoration-none"
                    >
                      {{ item.job?.title || 'Empleo no disponible' }}
                    </a>
                  </h5>

                  <div class="row text-muted mb-3" *ngIf="item.job">
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-geo-alt me-2"></i>
                      {{ item.job.location }}
                    </div>
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-currency-dollar me-2"></i>
                      {{ item.job.salary }}
                    </div>
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-briefcase me-2"></i>
                      {{ item.job.modality }}
                    </div>
                    <div class="col-sm-6 mb-1">
                      <i class="bi bi-calendar-x me-2"></i>
                      Vence: {{ item.job.deadline | date : 'dd/MM/yyyy' }}
                    </div>
                  </div>

                  <!-- Cover Letter Preview -->
                  <div
                    class="collapse"
                    [id]="'coverLetter' + item.application.id"
                  >
                    <div class="card card-body bg-light">
                      <h6>
                        <i class="bi bi-file-text me-2"></i>
                        Carta de presentación
                      </h6>
                      <p class="mb-0" style="white-space: pre-line;">
                        {{ item.application.coverLetter }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-md-4 text-md-end">
                  <div class="d-flex flex-column h-100 justify-content-between">
                    <!-- Status Info -->
                    <div class="mb-3">
                      <div
                        *ngIf="item.application.status === 'pending'"
                        class="text-warning"
                      >
                        <i class="bi bi-clock-history me-2"></i>
                        <small>En revisión</small>
                      </div>
                      <div
                        *ngIf="item.application.status === 'reviewed'"
                        class="text-info"
                      >
                        <i class="bi bi-eye me-2"></i>
                        <small>Revisada por el empleador</small>
                      </div>
                      <div
                        *ngIf="item.application.status === 'accepted'"
                        class="text-success"
                      >
                        <i class="bi bi-check-circle me-2"></i>
                        <small>¡Felicidades! Fuiste seleccionado</small>
                      </div>
                      <div
                        *ngIf="item.application.status === 'rejected'"
                        class="text-danger"
                      >
                        <i class="bi bi-x-circle me-2"></i>
                        <small>No fuiste seleccionado</small>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="d-grid gap-2">
                      <a
                        [routerLink]="[
                          '/graduate/jobs',
                          item.application.jobId
                        ]"
                        class="btn btn-outline-primary btn-sm"
                      >
                        <i class="bi bi-eye me-2"></i>
                        Ver Empleo
                      </a>

                      <button
                        class="btn btn-outline-secondary btn-sm"
                        type="button"
                        [attr.data-bs-toggle]="'collapse'"
                        [attr.data-bs-target]="
                          '#coverLetter' + item.application.id
                        "
                        [attr.aria-expanded]="false"
                        [attr.aria-controls]="
                          'coverLetter' + item.application.id
                        "
                      >
                        <i class="bi bi-file-text me-2"></i>
                        Ver Carta
                      </button>

                      <!-- Contact Info for Accepted Applications -->
                      <button
                        *ngIf="item.application.status === 'accepted'"
                        class="btn btn-success btn-sm"
                        (click)="showContactInfo(item)"
                      >
                        <i class="bi bi-telephone me-2"></i>
                        Contacto
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

    <!-- Contact Modal -->
    <div
      class="modal fade"
      [class.show]="showContactModal"
      [style.display]="showContactModal ? 'block' : 'none'"
      tabindex="-1"
      *ngIf="showContactModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-telephone me-2"></i>
              Información de Contacto
            </h5>
            <button
              type="button"
              class="btn-close"
              (click)="showContactModal = false"
            ></button>
          </div>
          <div class="modal-body" *ngIf="selectedApplication">
            <div class="alert alert-success">
              <i class="bi bi-check-circle me-2"></i>
              ¡Felicidades! Has sido seleccionado para el puesto de
              <strong>{{ selectedApplication.job?.title }}</strong>
            </div>

            <h6>Contacta al empleador:</h6>
            <div class="card bg-light">
              <div class="card-body">
                <p class="mb-2">
                  <i class="bi bi-envelope me-2"></i>
                  <strong>Email:</strong> empleador&#64;empresa.com
                </p>
                <p class="mb-2">
                  <i class="bi bi-telephone me-2"></i>
                  <strong>Teléfono:</strong> +593 99 123 4567
                </p>
                <p class="mb-0">
                  <i class="bi bi-clock me-2"></i>
                  <strong>Horario de contacto:</strong> Lunes a Viernes, 8:00 AM
                  - 5:00 PM
                </p>
              </div>
            </div>

            <div class="alert alert-info mt-3">
              <i class="bi bi-info-circle me-2"></i>
              Te recomendamos contactar al empleador en un plazo de 48 horas
              para coordinar la entrevista o siguiente paso.
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="showContactModal = false"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" *ngIf="showContactModal"></div>
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

      .page-link:focus {
        box-shadow: none;
      }

      .bg-light .card-body {
        background-color: #f8f9fa !important;
      }
    `,
  ],
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  filteredApplications: { application: Application; job: Job | null }[] = [];
  isLoading = true;
  currentUser: User | null = null;

  // Filters
  statusFilter = '';
  dateFilter = '';
  searchFilter = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Modal
  showContactModal = false;
  selectedApplication: { application: Application; job: Job | null } | null =
    null;

  constructor(
    private applicationService: ApplicationService,
    private jobService: JobService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user) {
        this.loadApplications();
      }
    });
  }

  private loadApplications(): void {
    if (!this.currentUser?.id) return;

    this.applicationService
      .getApplicationsByGraduate(this.currentUser.id)
      .subscribe({
        next: (applications) => {
          this.applications = applications.sort(
            (a, b) =>
              new Date(b.applicationDate).getTime() -
              new Date(a.applicationDate).getTime()
          );
          this.loadJobDetails();
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  private loadJobDetails(): void {
    if (this.applications.length === 0) {
      this.isLoading = false;
      this.applyFilters();
      return;
    }

    const jobRequests = this.applications.map((app) =>
      this.jobService.getJobById(app.jobId)
    );

    forkJoin(jobRequests).subscribe({
      next: (jobs) => {
        this.filteredApplications = this.applications.map((app, index) => ({
          application: app,
          job: jobs[index] || null,
        }));
        this.isLoading = false;
        this.applyFilters();
      },
      error: () => {
        this.filteredApplications = this.applications.map((app) => ({
          application: app,
          job: null,
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

    // Date filter
    if (this.dateFilter) {
      const now = new Date();
      filtered = filtered.filter((item) => {
        const appDate = new Date(item.application.applicationDate);
        switch (this.dateFilter) {
          case 'today':
            return appDate.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return appDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(
              now.getFullYear(),
              now.getMonth() - 1,
              now.getDate()
            );
            return appDate >= monthAgo;
          case 'quarter':
            const quarterAgo = new Date(
              now.getFullYear(),
              now.getMonth() - 3,
              now.getDate()
            );
            return appDate >= quarterAgo;
          default:
            return true;
        }
      });
    }

    // Search filter
    if (this.searchFilter.trim()) {
      const searchTerm = this.searchFilter.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.job?.title.toLowerCase().includes(searchTerm) ||
          item.job?.area.toLowerCase().includes(searchTerm) ||
          item.job?.location.toLowerCase().includes(searchTerm)
      );
    }

    // Pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.filteredApplications = filtered.slice(startIndex, endIndex);
  }

  hasFilters(): boolean {
    return !!(this.statusFilter || this.dateFilter || this.searchFilter.trim());
  }

  getPendingCount(): number {
    return this.applications.filter((app) => app.status === 'pending').length;
  }

  getAcceptedCount(): number {
    return this.applications.filter((app) => app.status === 'accepted').length;
  }

  getRejectedCount(): number {
    return this.applications.filter((app) => app.status === 'rejected').length;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      pending: 'Pendiente',
      reviewed: 'Revisada',
      accepted: 'Aceptado',
      rejected: 'Rechazado',
    };
    return statusMap[status] || status;
  }

  showContactInfo(item: { application: Application; job: Job | null }): void {
    this.selectedApplication = item;
    this.showContactModal = true;
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
