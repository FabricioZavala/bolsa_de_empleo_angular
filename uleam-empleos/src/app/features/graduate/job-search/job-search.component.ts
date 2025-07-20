import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { Job, JobFilter } from '../../../core/models/user.model';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary mb-3">
            <i class="bi bi-search me-2"></i>
            Buscar Empleos
          </h1>
          <p class="text-muted">
            Encuentra oportunidades laborales que se adapten a tu perfil
            profesional.
          </p>
        </div>
      </div>

      <!-- Search Filters -->
      <div class="card mb-4">
        <div class="card-header bg-light">
          <h5 class="mb-0">
            <i class="bi bi-funnel me-2"></i>
            Filtros de Búsqueda
          </h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="searchJobs()" #searchForm="ngForm">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="searchTerm" class="form-label"
                  >Título o palabra clave</label
                >
                <input
                  type="text"
                  class="form-control"
                  id="searchTerm"
                  [(ngModel)]="searchTerm"
                  name="searchTerm"
                  placeholder="Ej: Desarrollador, Analista..."
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="location" class="form-label">Ubicación</label>
                <input
                  type="text"
                  class="form-control"
                  id="location"
                  [(ngModel)]="filters.location"
                  name="location"
                  placeholder="Ej: Manta, Portoviejo..."
                />
              </div>
              <div class="col-md-4 mb-3">
                <label for="area" class="form-label">Área</label>
                <select
                  class="form-select"
                  id="area"
                  [(ngModel)]="filters.area"
                  name="area"
                >
                  <option value="">Todas las áreas</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Administración">Administración</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Educación">Educación</option>
                  <option value="Salud">Salud</option>
                  <option value="Ingeniería">Ingeniería</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label for="modality" class="form-label">Modalidad</label>
                <select
                  class="form-select"
                  id="modality"
                  [(ngModel)]="filters.modality"
                  name="modality"
                >
                  <option value="">Todas las modalidades</option>
                  <option value="presencial">Presencial</option>
                  <option value="remoto">Remoto</option>
                  <option value="hibrido">Híbrido</option>
                </select>
              </div>
              <div class="col-md-4 mb-3">
                <label for="salaryRange" class="form-label"
                  >Rango Salarial</label
                >
                <select
                  class="form-select"
                  id="salaryRange"
                  [(ngModel)]="filters.salaryRange"
                  name="salaryRange"
                >
                  <option value="">Cualquier salario</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="500-800">$500 - $800</option>
                  <option value="800-1200">$800 - $1200</option>
                  <option value="1200-2000">$1200 - $2000</option>
                  <option value="2000+">$2000+</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <button
                  type="submit"
                  class="btn btn-primary me-2"
                  [disabled]="isLoading"
                >
                  <i class="bi bi-search me-2"></i>
                  <span *ngIf="!isLoading">Buscar</span>
                  <span *ngIf="isLoading">Buscando...</span>
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  (click)="clearFilters()"
                >
                  <i class="bi bi-x-circle me-2"></i>
                  Limpiar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="row mb-3" *ngIf="searchPerformed">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <span class="text-primary">{{ filteredJobs.length }}</span>
              empleos encontrados
              <span *ngIf="searchTerm" class="text-muted"
                >para "{{ searchTerm }}"</span
              >
            </h5>
            <div class="btn-group btn-group-sm">
              <button
                class="btn"
                [ngClass]="
                  viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'
                "
                (click)="viewMode = 'grid'"
              >
                <i class="bi bi-grid-3x3-gap"></i>
              </button>
              <button
                class="btn"
                [ngClass]="
                  viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'
                "
                (click)="viewMode = 'list'"
              >
                <i class="bi bi-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="text-muted mt-3">Buscando empleos...</p>
      </div>

      <!-- No Results -->
      <div
        *ngIf="searchPerformed && !isLoading && filteredJobs.length === 0"
        class="text-center py-5"
      >
        <i class="bi bi-search display-1 text-muted mb-3"></i>
        <h3 class="text-muted">No se encontraron empleos</h3>
        <p class="text-muted">Intenta ajustar tus criterios de búsqueda</p>
        <button class="btn btn-primary" (click)="clearFilters()">
          <i class="bi bi-arrow-clockwise me-2"></i>
          Ver todos los empleos
        </button>
      </div>

      <!-- Results Grid View -->
      <div
        *ngIf="!isLoading && filteredJobs.length > 0 && viewMode === 'grid'"
        class="row"
      >
        <div *ngFor="let job of filteredJobs" class="col-md-6 col-lg-4 mb-4">
          <div class="card h-100 shadow-sm border-0 job-card">
            <div class="card-body">
              <div
                class="d-flex justify-content-between align-items-start mb-2"
              >
                <span class="badge bg-primary">{{ job.area }}</span>
                <small class="text-muted">{{
                  getTimeAgo(job.publishDate)
                }}</small>
              </div>
              <h5 class="card-title">{{ job.title }}</h5>
              <p class="card-text text-muted mb-2">
                <i class="bi bi-geo-alt me-1"></i>{{ job.location }}
              </p>
              <p class="card-text text-muted mb-2">
                <i class="bi bi-currency-dollar me-1"></i>{{ job.salary }}
              </p>
              <p class="card-text text-muted mb-3">
                <i class="bi bi-laptop me-1"></i>{{ job.modality }}
              </p>
              <p class="card-text small">
                {{ job.description | slice : 0 : 100
                }}{{ job.description.length > 100 ? '...' : '' }}
              </p>
              <div
                class="d-flex justify-content-between align-items-center mt-3"
              >
                <span class="badge bg-light text-dark">
                  <i class="bi bi-clock me-1"></i>
                  {{ getDaysUntilDeadline(job.deadline) }} días restantes
                </span>
                <a
                  [routerLink]="['/graduate/jobs', job.id]"
                  class="btn btn-primary btn-sm"
                >
                  Ver Detalles
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results List View -->
      <div *ngIf="!isLoading && filteredJobs.length > 0 && viewMode === 'list'">
        <div
          *ngFor="let job of filteredJobs"
          class="card mb-3 shadow-sm border-0 job-card"
        >
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="d-flex flex-wrap align-items-center mb-2">
                  <span class="badge bg-primary me-2 mb-1">{{ job.area }}</span>
                  <span class="badge bg-secondary me-2 mb-1">{{
                    job.modality
                  }}</span>
                  <small class="text-muted"
                    >Publicado {{ getTimeAgo(job.publishDate) }}</small
                  >
                </div>
                <h5 class="card-title mb-2">{{ job.title }}</h5>
                <p class="card-text text-muted mb-2">
                  <i class="bi bi-geo-alt me-1"></i>{{ job.location }}
                  <span class="ms-3">
                    <i class="bi bi-currency-dollar me-1"></i>{{ job.salary }}
                  </span>
                </p>
                <p class="card-text">
                  {{ job.description | slice : 0 : 200
                  }}{{ job.description.length > 200 ? '...' : '' }}
                </p>
              </div>
              <div class="col-md-4 text-md-end">
                <div class="mb-2">
                  <span class="badge bg-light text-dark">
                    <i class="bi bi-clock me-1"></i>
                    {{ getDaysUntilDeadline(job.deadline) }} días restantes
                  </span>
                </div>
                <a
                  [routerLink]="['/graduate/jobs', job.id]"
                  class="btn btn-primary"
                >
                  <i class="bi bi-eye me-2"></i>
                  Ver Detalles
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div
        *ngIf="!isLoading && filteredJobs.length > 0"
        class="text-center mt-4"
      >
        <button class="btn btn-outline-primary" (click)="loadMore()">
          <i class="bi bi-arrow-down-circle me-2"></i>
          Cargar más empleos
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .job-card {
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        cursor: pointer;
      }

      .job-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
      }

      .badge {
        font-size: 0.75em;
      }

      .form-label {
        font-weight: 500;
        color: #495057;
      }

      .btn-group .btn {
        border-radius: 0;
      }

      .btn-group .btn:first-child {
        border-top-left-radius: 0.375rem;
        border-bottom-left-radius: 0.375rem;
      }

      .btn-group .btn:last-child {
        border-top-right-radius: 0.375rem;
        border-bottom-right-radius: 0.375rem;
      }
    `,
  ],
})
export class JobSearchComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  isLoading = false;
  searchPerformed = false;
  viewMode: 'grid' | 'list' = 'grid';

  searchTerm = '';
  filters: JobFilter = {
    area: '',
    location: '',
    modality: undefined,
    salaryRange: '',
  };

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.jobService.getAllJobs().subscribe((jobs: Job[]) => {
      this.jobs = jobs.filter((job) => job.status === 'active');
      this.filteredJobs = [...this.jobs];
      this.isLoading = false;
      this.searchPerformed = true;
    });
  }

  searchJobs(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.filteredJobs = this.jobs.filter((job) => {
        let matches = true;

        // Search term (title or description)
        if (this.searchTerm.trim()) {
          const term = this.searchTerm.toLowerCase().trim();
          matches =
            matches &&
            (job.title.toLowerCase().includes(term) ||
              job.description.toLowerCase().includes(term) ||
              job.requirements.some((req) => req.toLowerCase().includes(term)));
        }

        // Area filter
        if (this.filters.area) {
          matches = matches && job.area === this.filters.area;
        }

        // Location filter
        if (this.filters.location?.trim()) {
          const location = this.filters.location.toLowerCase().trim();
          matches = matches && job.location.toLowerCase().includes(location);
        }

        // Modality filter
        if (this.filters.modality) {
          matches = matches && job.modality === this.filters.modality;
        }

        // Salary range filter
        if (this.filters.salaryRange) {
          matches =
            matches &&
            this.matchesSalaryRange(job.salary, this.filters.salaryRange);
        }

        return matches;
      });

      this.isLoading = false;
      this.searchPerformed = true;
    }, 500); // Simulate search delay
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.filters = {
      area: '',
      location: '',
      modality: undefined,
      salaryRange: '',
    };
    this.filteredJobs = [...this.jobs];
    this.searchPerformed = true;
  }

  loadMore(): void {
    // Simulate loading more jobs
    console.log('Loading more jobs...');
  }

  private matchesSalaryRange(salary: string, range: string): boolean {
    // Extract numeric values from salary string
    const salaryNumbers = salary.match(/\d+/g);
    if (!salaryNumbers || salaryNumbers.length === 0) return false;

    const minSalary = parseInt(salaryNumbers[0]);
    const maxSalary =
      salaryNumbers.length > 1 ? parseInt(salaryNumbers[1]) : minSalary;
    const avgSalary = (minSalary + maxSalary) / 2;

    switch (range) {
      case '0-500':
        return avgSalary <= 500;
      case '500-800':
        return avgSalary >= 500 && avgSalary <= 800;
      case '800-1200':
        return avgSalary >= 800 && avgSalary <= 1200;
      case '1200-2000':
        return avgSalary >= 1200 && avgSalary <= 2000;
      case '2000+':
        return avgSalary >= 2000;
      default:
        return true;
    }
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const publishDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - publishDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'hace 1 día';
    if (diffDays < 7) return `hace ${diffDays} días`;
    if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semana(s)`;
    return `hace ${Math.floor(diffDays / 30)} mes(es)`;
  }

  getDaysUntilDeadline(deadline: Date): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }
}
