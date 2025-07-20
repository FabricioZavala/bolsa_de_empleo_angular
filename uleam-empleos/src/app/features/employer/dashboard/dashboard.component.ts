import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Application, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-employer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <h1 class="text-primary mb-3">
            <i class="bi bi-building me-2"></i>
            Panel de Empleador
          </h1>
          <p class="text-muted">
            Bienvenido, {{ getCompanyName() }}. Gestiona tus ofertas de empleo y
            candidatos.
          </p>
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-primary">
            <div class="card-body text-center">
              <i class="bi bi-briefcase display-6 text-primary mb-2"></i>
              <h5 class="card-title">Empleos Publicados</h5>
              <h2 class="text-primary mb-0">{{ jobStats.total }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-success">
            <div class="card-body text-center">
              <i class="bi bi-people display-6 text-success mb-2"></i>
              <h5 class="card-title">Total Postulaciones</h5>
              <h2 class="text-success mb-0">{{ applicationStats.total }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-warning">
            <div class="card-body text-center">
              <i class="bi bi-eye display-6 text-warning mb-2"></i>
              <h5 class="card-title">Nuevas</h5>
              <h2 class="text-warning mb-0">{{ applicationStats.pending }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-3 mb-3">
          <div class="card h-100 border-info">
            <div class="card-body text-center">
              <i class="bi bi-check-circle display-6 text-info mb-2"></i>
              <h5 class="card-title">Activos</h5>
              <h2 class="text-info mb-0">{{ jobStats.active }}</h2>
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
                  <a
                    routerLink="/employer/post-job"
                    class="btn btn-primary w-100"
                  >
                    <i class="bi bi-plus-circle me-2"></i>
                    Publicar Empleo
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a routerLink="/employer/jobs" class="btn btn-success w-100">
                    <i class="bi bi-briefcase me-2"></i>
                    Mis Empleos
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a
                    routerLink="/employer/jobs"
                    class="btn btn-outline-info w-100"
                  >
                    <i class="bi bi-people me-2"></i>
                    Gestionar Empleos
                  </a>
                </div>
                <div class="col-md-3 mb-2">
                  <a
                    routerLink="/employer/profile"
                    class="btn btn-outline-primary w-100"
                  >
                    <i class="bi bi-person-circle me-2"></i>
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

      <!-- My Jobs -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div
              class="card-header bg-light d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i class="bi bi-briefcase me-2"></i>
                Mis Empleos Recientes
              </h5>
              <a
                routerLink="/employer/jobs"
                class="btn btn-outline-primary btn-sm"
              >
                Ver Todos
              </a>
            </div>
            <div class="card-body">
              <div *ngIf="myJobs.length === 0" class="text-center py-4">
                <i class="bi bi-briefcase display-4 text-muted mb-3"></i>
                <p class="text-muted">No has publicado empleos aún.</p>
                <a routerLink="/employer/post-job" class="btn btn-primary">
                  <i class="bi bi-plus-circle me-2"></i>
                  Publicar tu Primer Empleo
                </a>
              </div>
              <div *ngIf="myJobs.length > 0">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>Título</th>
                        <th>Ubicación</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Postulaciones</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let job of myJobs">
                        <td>
                          <strong>{{ job.title }}</strong>
                          <br />
                          <small class="text-muted">{{ job.area }}</small>
                        </td>
                        <td>
                          <i class="bi bi-geo-alt me-1 text-muted"></i>
                          {{ job.location }}
                          <br />
                          <small class="text-muted">{{ job.modality }}</small>
                        </td>
                        <td>
                          <small class="text-muted">{{
                            job.publishDate | date : 'dd/MM/yyyy'
                          }}</small>
                        </td>
                        <td>
                          <span
                            class="badge"
                            [ngClass]="{
                              'bg-success': job.status === 'active',
                              'bg-warning': job.status === 'inactive',
                              'bg-secondary': job.status === 'closed'
                            }"
                          >
                            {{ getStatusText(job.status) }}
                          </span>
                        </td>
                        <td>
                          <span class="badge bg-primary">{{
                            job.applications.length
                          }}</span>
                        </td>
                        <td>
                          <a
                            [routerLink]="['/employer/applicants', job.id]"
                            class="btn btn-outline-primary btn-sm"
                          >
                            <i class="bi bi-people"></i> Ver Candidatos
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div
              class="card-header bg-light d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i class="bi bi-people me-2"></i>
                Postulaciones Recientes
              </h5>
              <a
                routerLink="/employer/jobs"
                class="btn btn-outline-primary btn-sm"
              >
                Ver Todas
              </a>
            </div>
            <div class="card-body">
              <div
                *ngIf="recentApplications.length === 0"
                class="text-center py-4"
              >
                <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                <p class="text-muted">No hay postulaciones recientes.</p>
              </div>
              <div *ngIf="recentApplications.length > 0">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead class="table-light">
                      <tr>
                        <th>Candidato</th>
                        <th>Empleo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let application of recentApplications">
                        <td>
                          <i class="bi bi-person me-2 text-muted"></i>
                          <strong
                            >Candidato #{{ application.graduateId }}</strong
                          >
                        </td>
                        <td>
                          <strong>{{ getJobTitle(application.jobId) }}</strong>
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
                            {{ getApplicationStatusText(application.status) }}
                          </span>
                        </td>
                        <td>
                          <a
                            [routerLink]="[
                              '/employer/applicants',
                              application.jobId
                            ]"
                            class="btn btn-sm btn-outline-primary"
                          >
                            <i class="bi bi-eye me-1"></i>Ver
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: [],
})
export class EmployerDashboardComponent implements OnInit {
  currentUser: User | null = null;
  isLoading = false;

  jobStats = {
    total: 0,
    active: 0,
    inactive: 0,
    closed: 0,
  };

  applicationStats = {
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  myJobs: Job[] = [];
  recentApplications: Application[] = [];

  constructor(
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user?.id) {
        this.loadDashboardData();
      }
    });
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    if (this.currentUser?.id) {
      // Load my jobs
      this.jobService
        .getJobsByEmployer(this.currentUser.id)
        .subscribe((jobs: Job[]) => {
          this.myJobs = jobs.slice(0, 5); // Show only 5 recent jobs
          this.jobStats.total = jobs.length;
          this.jobStats.active = jobs.filter(
            (job) => job.status === 'active'
          ).length;
          this.jobStats.inactive = jobs.filter(
            (job) => job.status === 'inactive'
          ).length;
          this.jobStats.closed = jobs.filter(
            (job) => job.status === 'closed'
          ).length;

          // Load applications for all my jobs
          this.loadApplicationsForJobs(jobs);
        });
    }
  }

  private loadApplicationsForJobs(jobs: Job[]): void {
    if (jobs.length === 0) {
      this.isLoading = false;
      return;
    }

    // Get all applications for my jobs
    const allApplications: Application[] = [];
    let loadedJobs = 0;

    jobs.forEach((job) => {
      this.applicationService
        .getApplicationsByJob(job.id)
        .subscribe((applications: Application[]) => {
          allApplications.push(...applications);
          loadedJobs++;

          if (loadedJobs === jobs.length) {
            // All jobs loaded, calculate stats
            this.applicationStats.total = allApplications.length;
            this.applicationStats.pending = allApplications.filter(
              (app) => app.status === 'pending'
            ).length;
            this.applicationStats.reviewed = allApplications.filter(
              (app) => app.status === 'reviewed'
            ).length;
            this.applicationStats.accepted = allApplications.filter(
              (app) => app.status === 'accepted'
            ).length;
            this.applicationStats.rejected = allApplications.filter(
              (app) => app.status === 'rejected'
            ).length;

            // Get recent applications (last 5)
            this.recentApplications = allApplications
              .sort(
                (a, b) =>
                  new Date(b.applicationDate).getTime() -
                  new Date(a.applicationDate).getTime()
              )
              .slice(0, 5);

            this.isLoading = false;
          }
        });
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  getCompanyName(): string {
    if (this.currentUser?.role === 'employer') {
      const profile = this.currentUser.profile as any;
      return profile?.companyName || 'Mi Empresa';
    }
    return 'Mi Empresa';
  }

  getJobTitle(jobId: string): string {
    const job = this.myJobs.find((j) => j.id === jobId);
    return job?.title || 'Empleo';
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
}
