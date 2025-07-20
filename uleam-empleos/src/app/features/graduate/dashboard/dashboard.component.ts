import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Application, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-graduate-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary mb-3">
            <i class="bi bi-house-door me-2"></i>
            Panel de Graduado
          </h1>
          <p class="text-muted">
            Bienvenido de vuelta, {{ getUserFirstName() }}. Aquí tienes un
            resumen de tu actividad.
          </p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-primary">
            <div class="card-body text-center">
              <i class="bi bi-briefcase display-6 text-primary mb-2"></i>
              <h5 class="card-title">Empleos Disponibles</h5>
              <h2 class="text-primary mb-0">{{ jobStats.total }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-success">
            <div class="card-body text-center">
              <i
                class="bi bi-file-earmark-text display-6 text-success mb-2"
              ></i>
              <h5 class="card-title">Mis Postulaciones</h5>
              <h2 class="text-success mb-0">{{ applicationStats.total }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-warning">
            <div class="card-body text-center">
              <i class="bi bi-clock-history display-6 text-warning mb-2"></i>
              <h5 class="card-title">En Proceso</h5>
              <h2 class="text-warning mb-0">{{ applicationStats.pending }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-info">
            <div class="card-body text-center">
              <i class="bi bi-check-circle display-6 text-info mb-2"></i>
              <h5 class="card-title">Revisadas</h5>
              <h2 class="text-info mb-0">{{ applicationStats.reviewed }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-lightning me-2"></i>
                Acciones Rápidas
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 mb-2">
                  <a routerLink="/graduate/jobs" class="btn btn-primary w-100">
                    <i class="bi bi-search me-2"></i>
                    Buscar Empleos
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a
                    routerLink="/graduate/applications"
                    class="btn btn-success w-100"
                  >
                    <i class="bi bi-file-earmark-text me-2"></i>
                    Mis Postulaciones
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a routerLink="/graduate/profile" class="btn btn-info w-100">
                    <i class="bi bi-person-gear me-2"></i>
                    Mi Perfil
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <button
                    (click)="refreshData()"
                    class="btn btn-outline-secondary w-100"
                    [disabled]="isLoading"
                  >
                    <i class="bi bi-arrow-clockwise me-2"></i>
                    <span *ngIf="!isLoading">Actualizar</span>
                    <span *ngIf="isLoading">Cargando...</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-clock-history me-2"></i>
                Postulaciones Recientes
              </h5>
            </div>
            <div class="card-body">
              <div
                *ngIf="recentApplications.length === 0"
                class="text-center py-4"
              >
                <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                <p class="text-muted">No tienes postulaciones recientes.</p>
                <a routerLink="/graduate/jobs" class="btn btn-primary">
                  <i class="bi bi-search me-2"></i>
                  Explorar Empleos
                </a>
              </div>
              <div *ngIf="recentApplications.length > 0">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>Empresa</th>
                        <th>Posición</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let application of recentApplications">
                        <td>
                          <i class="bi bi-building me-2 text-muted"></i>
                          {{ getCompanyName(application.jobId) }}
                        </td>
                        <td>
                          <strong>{{
                            getJobDetails(application.jobId)?.title || 'N/A'
                          }}</strong>
                        </td>
                        <td>
                          <small class="text-muted">{{
                            application.applicationDate | date : 'dd/MM/yyyy'
                          }}</small>
                        </td>
                        <td>
                          <span
                            class="badge"
                            [ngClass]="{
                              'bg-warning': application.status === 'pending',
                              'bg-info': application.status === 'reviewed',
                              'bg-success': application.status === 'accepted',
                              'bg-danger': application.status === 'rejected'
                            }"
                          >
                            {{ getStatusText(application.status) }}
                          </span>
                        </td>
                        <td>
                          <a
                            [routerLink]="['/graduate/jobs', application.jobId]"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="bi bi-eye me-1"></i>Ver
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="text-center mt-3">
                  <a
                    routerLink="/graduate/applications"
                    class="btn btn-outline-primary"
                  >
                    Ver Todas las Postulaciones
                    <i class="bi bi-arrow-right ms-2"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommended Jobs -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-star me-2"></i>
                Empleos Recomendados
              </h5>
            </div>
            <div class="card-body">
              <div
                *ngIf="recommendedJobs.length === 0"
                class="text-center py-4"
              >
                <i class="bi bi-search display-4 text-muted mb-3"></i>
                <p class="text-muted">
                  No hay empleos recomendados disponibles en este momento.
                </p>
              </div>
              <div *ngIf="recommendedJobs.length > 0" class="row">
                <div
                  *ngFor="let job of recommendedJobs"
                  class="col-md-6 col-lg-4 mb-3"
                >
                  <div class="card h-100 border-0 shadow-sm">
                    <div class="card-body">
                      <div class="d-flex align-items-center mb-2">
                        <i class="bi bi-building me-2 text-primary"></i>
                        <small class="text-muted">{{
                          getCompanyName(job.id)
                        }}</small>
                      </div>
                      <h6 class="card-title">{{ job.title }}</h6>
                      <p class="text-muted small mb-2">
                        <i class="bi bi-geo-alt me-1"></i>{{ job.location }}
                      </p>
                      <p class="text-muted small mb-2">
                        <i class="bi bi-currency-dollar me-1"></i
                        >{{ job.salary }}
                      </p>
                      <div class="mb-3">
                        <span class="badge bg-light text-dark me-1 mb-1">
                          {{ job.area }}
                        </span>
                        <span class="badge bg-secondary">
                          {{ job.modality }}
                        </span>
                      </div>
                      <a
                        [routerLink]="['/graduate/jobs', job.id]"
                        class="btn btn-primary btn-sm w-100"
                      >
                        <i class="bi bi-eye me-2"></i>Ver Detalles
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div *ngIf="recommendedJobs.length > 0" class="text-center mt-3">
                <a routerLink="/graduate/jobs" class="btn btn-outline-primary">
                  Ver Más Empleos
                  <i class="bi bi-arrow-right ms-2"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class GraduateDashboardComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;

  jobStats = {
    total: 0,
    new: 0,
  };

  applicationStats = {
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  recentApplications: Application[] = [];
  recommendedJobs: Job[] = [];
  allJobs: Job[] = [];

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardData();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user?.id) {
        this.loadApplications();
      }
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    // Load jobs
    this.jobService.getAllJobs().subscribe((jobs: Job[]) => {
      this.allJobs = jobs;
      this.jobStats.total = jobs.length;
      this.jobStats.new = jobs.filter((job: Job) => {
        const postDate = new Date(job.publishDate);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return postDate >= weekAgo;
      }).length;

      // Get recommended jobs (first 6)
      this.recommendedJobs = jobs.slice(0, 6);
    });
  }

  private loadApplications(): void {
    if (this.currentUser?.id) {
      this.applicationService
        .getApplicationsByGraduate(this.currentUser.id)
        .subscribe((applications: Application[]) => {
          this.applicationStats.total = applications.length;
          this.applicationStats.pending = applications.filter(
            (app) => app.status === 'pending'
          ).length;
          this.applicationStats.reviewed = applications.filter(
            (app) => app.status === 'reviewed'
          ).length;
          this.applicationStats.accepted = applications.filter(
            (app) => app.status === 'accepted'
          ).length;
          this.applicationStats.rejected = applications.filter(
            (app) => app.status === 'rejected'
          ).length;

          // Get recent applications (last 5)
          this.recentApplications = applications
            .sort(
              (a, b) =>
                new Date(b.applicationDate).getTime() -
                new Date(a.applicationDate).getTime()
            )
            .slice(0, 5);

          this.isLoading = false;
        });
    }
  }

  refreshData(): void {
    this.loadDashboardData();
    this.loadApplications();
  }

  getUserFirstName(): string {
    if (this.currentUser?.role === 'graduate') {
      const profile = this.currentUser.profile as any;
      return profile?.firstName || 'Usuario';
    }
    return 'Usuario';
  }

  getJobDetails(jobId: string): Job | undefined {
    return this.allJobs.find((job) => job.id === jobId);
  }

  getCompanyName(jobId: string): string {
    return 'Empresa Privada'; // Simplified for now
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
}
