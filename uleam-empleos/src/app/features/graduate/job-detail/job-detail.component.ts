import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../../core/services/job.service';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Job, Application, User } from '../../../core/models/user.model';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="container py-4" *ngIf="job">
      <!-- Back Button -->
      <div class="row mb-3">
        <div class="col-12">
          <button class="btn btn-outline-secondary" (click)="goBack()">
            <i class="bi bi-arrow-left me-2"></i>
            Volver a la búsqueda
          </button>
        </div>
      </div>

      <!-- Job Header -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <div class="d-flex flex-wrap align-items-center mb-3">
                <span class="badge bg-primary me-2 mb-1">{{ job.area }}</span>
                <span class="badge bg-secondary me-2 mb-1">{{
                  job.modality
                }}</span>
                <span class="badge bg-info me-2 mb-1">
                  <i class="bi bi-clock me-1"></i>
                  {{ getDaysUntilDeadline(job.deadline) }} días restantes
                </span>
              </div>
              <h1 class="mb-3">{{ job.title }}</h1>
              <div class="row text-muted mb-3">
                <div class="col-sm-6 mb-2">
                  <i class="bi bi-geo-alt me-2"></i>
                  <strong>Ubicación:</strong> {{ job.location }}
                </div>
                <div class="col-sm-6 mb-2">
                  <i class="bi bi-currency-dollar me-2"></i>
                  <strong>Salario:</strong> {{ job.salary }}
                </div>
                <div class="col-sm-6 mb-2">
                  <i class="bi bi-calendar me-2"></i>
                  <strong>Publicado:</strong>
                  {{ job.publishDate | date : 'dd/MM/yyyy' }}
                </div>
                <div class="col-sm-6 mb-2">
                  <i class="bi bi-calendar-x me-2"></i>
                  <strong>Fecha límite:</strong>
                  {{ job.deadline | date : 'dd/MM/yyyy' }}
                </div>
              </div>
            </div>
            <div class="col-md-4 text-md-end">
              <div class="mb-3">
                <h5 class="text-muted mb-2">Estado de la oferta</h5>
                <span
                  class="badge"
                  [ngClass]="{
                    'bg-success': job.status === 'active',
                    'bg-warning': job.status === 'inactive',
                    'bg-secondary': job.status === 'closed'
                  }"
                  style="font-size: 1rem; padding: 0.5rem 1rem;"
                >
                  {{ getStatusText(job.status) }}
                </span>
              </div>

              <!-- Application Status -->
              <div *ngIf="applicationStatus" class="mb-3">
                <h6 class="text-muted mb-2">Tu postulación</h6>
                <span
                  class="badge"
                  [ngClass]="{
                    'bg-warning': applicationStatus === 'pending',
                    'bg-info': applicationStatus === 'reviewed',
                    'bg-success': applicationStatus === 'accepted',
                    'bg-danger': applicationStatus === 'rejected'
                  }"
                  style="font-size: 0.9rem; padding: 0.4rem 0.8rem;"
                >
                  {{ getApplicationStatusText(applicationStatus) }}
                </span>
              </div>

              <!-- Apply Button -->
              <div *ngIf="canApply()">
                <button
                  class="btn btn-primary btn-lg w-100"
                  (click)="showApplicationModal = true"
                  [disabled]="isApplying"
                >
                  <i class="bi bi-send me-2"></i>
                  <span *ngIf="!isApplying">Postularme</span>
                  <span *ngIf="isApplying">Enviando...</span>
                </button>
              </div>

              <!-- Already Applied -->
              <div *ngIf="hasApplied()">
                <button class="btn btn-success btn-lg w-100" disabled>
                  <i class="bi bi-check-circle me-2"></i>
                  Ya te postulaste
                </button>
                <small class="text-muted d-block mt-2">
                  Postulación enviada el {{ getApplicationDate() }}
                </small>
              </div>

              <!-- Job Closed -->
              <div *ngIf="job.status !== 'active'">
                <button class="btn btn-secondary btn-lg w-100" disabled>
                  <i class="bi bi-x-circle me-2"></i>
                  Oferta cerrada
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Description -->
      <div class="row">
        <div class="col-lg-8 mb-4">
          <!-- Description -->
          <div class="card mb-4">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-file-text me-2"></i>
                Descripción del Empleo
              </h5>
            </div>
            <div class="card-body">
              <p class="card-text" style="white-space: pre-line;">
                {{ job.description }}
              </p>
            </div>
          </div>

          <!-- Requirements -->
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-list-check me-2"></i>
                Requisitos
              </h5>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li *ngFor="let requirement of job.requirements" class="mb-2">
                  <i class="bi bi-check-circle text-success me-2"></i>
                  {{ requirement }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
          <!-- Company Info -->
          <div class="card mb-4">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-building me-2"></i>
                Información de la Empresa
              </h5>
            </div>
            <div class="card-body">
              <h6>Empresa Privada</h6>
              <p class="text-muted small">
                Esta empresa valora el talento joven y ofrece oportunidades de
                crecimiento profesional.
              </p>
              <hr />
              <p class="mb-1">
                <i class="bi bi-people me-2 text-muted"></i>
                <strong>{{ job.applications.length }}</strong> postulaciones
              </p>
              <p class="mb-0">
                <i class="bi bi-eye me-2 text-muted"></i>
                <strong>Área:</strong> {{ job.area }}
              </p>
            </div>
          </div>

          <!-- Related Jobs -->
          <div class="card">
            <div class="card-header bg-light">
              <h5 class="mb-0">
                <i class="bi bi-briefcase me-2"></i>
                Empleos Similares
              </h5>
            </div>
            <div class="card-body">
              <div
                *ngIf="relatedJobs.length === 0"
                class="text-center text-muted"
              >
                <i class="bi bi-info-circle me-2"></i>
                No hay empleos similares disponibles
              </div>
              <div
                *ngFor="let relatedJob of relatedJobs"
                class="border-bottom pb-3 mb-3"
              >
                <h6 class="mb-1">
                  <a
                    [routerLink]="['/graduate/jobs', relatedJob.id]"
                    class="text-decoration-none"
                  >
                    {{ relatedJob.title }}
                  </a>
                </h6>
                <p class="text-muted small mb-1">
                  <i class="bi bi-geo-alt me-1"></i>{{ relatedJob.location }}
                </p>
                <p class="text-muted small mb-0">
                  <i class="bi bi-currency-dollar me-1"></i
                  >{{ relatedJob.salary }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Modal -->
    <div
      class="modal fade"
      [class.show]="showApplicationModal"
      [style.display]="showApplicationModal ? 'block' : 'none'"
      tabindex="-1"
      *ngIf="showApplicationModal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="bi bi-send me-2"></i>
              Postular a {{ job?.title }}
            </h5>
            <button
              type="button"
              class="btn-close"
              (click)="showApplicationModal = false"
            ></button>
          </div>
          <form (ngSubmit)="submitApplication()" #applicationForm="ngForm">
            <div class="modal-body">
              <div class="mb-3">
                <label for="coverLetter" class="form-label"
                  >Carta de presentación</label
                >
                <textarea
                  class="form-control"
                  id="coverLetter"
                  rows="6"
                  [(ngModel)]="coverLetter"
                  name="coverLetter"
                  placeholder="Escribe una breve carta de presentación explicando por qué eres el candidato ideal para este puesto..."
                  required
                ></textarea>
                <div class="form-text">
                  Explica tu experiencia relevante y por qué te interesa este
                  puesto.
                </div>
              </div>
              <div class="alert alert-info">
                <i class="bi bi-info-circle me-2"></i>
                Al postularte, tu perfil e información de contacto serán
                enviados al empleador.
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                (click)="showApplicationModal = false"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                [disabled]="isApplying || !coverLetter.trim()"
              >
                <i class="bi bi-send me-2"></i>
                <span *ngIf="!isApplying">Enviar Postulación</span>
                <span *ngIf="isApplying">Enviando...</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Backdrop -->
    <div class="modal-backdrop fade show" *ngIf="showApplicationModal"></div>

    <!-- Job Not Found -->
    <div *ngIf="!job && !isLoading" class="text-center py-5">
      <i class="bi bi-exclamation-triangle display-1 text-warning mb-3"></i>
      <h3>Empleo no encontrado</h3>
      <p class="text-muted">
        El empleo que buscas no existe o ha sido eliminado.
      </p>
      <a routerLink="/graduate/jobs" class="btn btn-primary">
        <i class="bi bi-arrow-left me-2"></i>
        Volver a empleos
      </a>
    </div>

    <!-- Loading -->
    <div *ngIf="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="text-muted mt-3">Cargando detalles del empleo...</p>
    </div>
  `,
  styles: [
    `
      .badge {
        font-weight: 500;
      }

      .card-header {
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      }

      .modal.show {
        background-color: rgba(0, 0, 0, 0.5);
      }

      .list-unstyled li {
        display: flex;
        align-items: flex-start;
      }

      .list-unstyled li i {
        margin-top: 0.25rem;
        flex-shrink: 0;
      }
    `,
  ],
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  relatedJobs: Job[] = [];
  isLoading = true;
  isApplying = false;
  showApplicationModal = false;
  coverLetter = '';
  currentUser: User | null = null;
  applicationStatus: string | null = null;
  userApplication: Application | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    private applicationService: ApplicationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadJob();
  }

  private loadCurrentUser(): void {
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      if (user && this.job) {
        this.checkApplicationStatus();
      }
    });
  }

  private loadJob(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.jobService.getJobById(jobId).subscribe({
        next: (job) => {
          this.job = job;
          this.isLoading = false;
          if (this.currentUser) {
            this.checkApplicationStatus();
          }
          this.loadRelatedJobs();
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
  }

  private checkApplicationStatus(): void {
    if (this.currentUser?.id && this.job?.id) {
      this.applicationService
        .getApplicationsByGraduate(this.currentUser.id)
        .subscribe((applications) => {
          this.userApplication =
            applications.find((app) => app.jobId === this.job!.id) || null;
          this.applicationStatus = this.userApplication?.status || null;
        });
    }
  }

  private loadRelatedJobs(): void {
    if (this.job) {
      this.jobService
        .searchJobs({
          area: this.job.area,
        })
        .subscribe((jobs) => {
          this.relatedJobs = jobs
            .filter((j) => j.id !== this.job!.id && j.status === 'active')
            .slice(0, 3);
        });
    }
  }

  canApply(): boolean {
    return !!(
      this.job?.status === 'active' &&
      this.currentUser &&
      this.currentUser.role === 'graduate' &&
      !this.hasApplied() &&
      this.getDaysUntilDeadline(this.job.deadline) > 0
    );
  }

  hasApplied(): boolean {
    return !!this.userApplication;
  }

  getApplicationDate(): string {
    return this.userApplication?.applicationDate
      ? new Date(this.userApplication.applicationDate).toLocaleDateString(
          'es-ES'
        )
      : '';
  }

  submitApplication(): void {
    if (!this.currentUser?.id || !this.job?.id || !this.coverLetter.trim()) {
      return;
    }

    this.isApplying = true;

    this.applicationService
      .applyToJob(this.job.id, this.currentUser.id, this.coverLetter.trim())
      .subscribe({
        next: () => {
          this.isApplying = false;
          this.showApplicationModal = false;
          this.coverLetter = '';
          this.checkApplicationStatus();

          // Show success message (you could implement a toast service)
          alert('¡Postulación enviada exitosamente!');
        },
        error: () => {
          this.isApplying = false;
          alert('Error al enviar la postulación. Intenta nuevamente.');
        },
      });
  }

  goBack(): void {
    this.router.navigate(['/graduate/jobs']);
  }

  getDaysUntilDeadline(deadline: Date): number {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
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
