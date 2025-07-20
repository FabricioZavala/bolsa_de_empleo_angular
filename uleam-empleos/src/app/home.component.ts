import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobService } from './core/services/job.service';
import { LoadingComponent } from './shared/components/loading.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingComponent],
  template: `
    <div class="container mt-5">
      <!-- Hero Section -->
      <div class="row align-items-center mb-5">
        <div class="col-lg-6">
          <h1 class="display-4 fw-bold text-primary mb-4">
            Encuentra tu próxima oportunidad profesional
          </h1>
          <p class="lead text-secondary mb-4">
            ULEAM Empleos conecta a graduados talentosos con las mejores
            empresas de Ecuador. Inicia tu carrera profesional hoy mismo.
          </p>
          <div class="d-flex gap-3 flex-wrap">
            <a routerLink="/auth/register" class="btn btn-primary btn-lg">
              Comenzar Ahora
            </a>
            <a
              routerLink="/graduate/jobs"
              class="btn btn-outline-primary btn-lg"
            >
              Ver Empleos
            </a>
          </div>
        </div>
        <div class="col-lg-6 text-center">
          <div class="hero-image">
            <i
              class="bi bi-people-fill text-primary"
              style="font-size: 15rem; opacity: 0.7;"
            ></i>
          </div>
        </div>
      </div>

      <!-- Estadísticas -->
      <div class="row mb-5">
        <div class="col-12">
          <h2 class="text-center mb-4">Nuestros Números</h2>
          <div class="row g-4" *ngIf="!isLoading; else loadingStats">
            <div class="col-md-3 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-briefcase-fill text-primary fs-1 mb-3"></i>
                  <h3 class="fw-bold text-primary">
                    {{ stats.totalJobs || 0 }}
                  </h3>
                  <p class="text-secondary mb-0">Empleos Activos</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-people-fill text-primary fs-1 mb-3"></i>
                  <h3 class="fw-bold text-primary">1,200+</h3>
                  <p class="text-secondary mb-0">Graduados ULEAM</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-building text-primary fs-1 mb-3"></i>
                  <h3 class="fw-bold text-primary">85+</h3>
                  <p class="text-secondary mb-0">Empresas Aliadas</p>
                </div>
              </div>
            </div>
            <div class="col-md-3 text-center">
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-graph-up text-primary fs-1 mb-3"></i>
                  <h3 class="fw-bold text-primary">95%</h3>
                  <p class="text-secondary mb-0">Tasa de Empleabilidad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="row mb-5">
        <div class="col-12">
          <h2 class="text-center mb-5">¿Por qué elegir ULEAM Empleos?</h2>
          <div class="row g-4">
            <div class="col-md-4">
              <div class="text-center">
                <div
                  class="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style="width: 80px; height: 80px;"
                >
                  <i class="bi bi-shield-check text-primary fs-2"></i>
                </div>
                <h4 class="fw-bold mb-3">Verificación de Calidad</h4>
                <p class="text-secondary">
                  Todas las ofertas laborales son verificadas para garantizar
                  oportunidades reales y de calidad.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center">
                <div
                  class="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style="width: 80px; height: 80px;"
                >
                  <i class="bi bi-mortarboard text-primary fs-2"></i>
                </div>
                <h4 class="fw-bold mb-3">Talento ULEAM</h4>
                <p class="text-secondary">
                  Plataforma exclusiva para graduados de ULEAM con formación de
                  excelencia.
                </p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="text-center">
                <div
                  class="feature-icon bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style="width: 80px; height: 80px;"
                >
                  <i class="bi bi-rocket text-primary fs-2"></i>
                </div>
                <h4 class="fw-bold mb-3">Proceso Ágil</h4>
                <p class="text-secondary">
                  Sistema optimizado para una búsqueda de empleo rápida y
                  efectiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="row mb-5">
        <div class="col-12">
          <div class="card bg-primary text-white text-center">
            <div class="card-body py-5">
              <h3 class="fw-bold mb-3">
                ¿Listo para comenzar tu carrera profesional?
              </h3>
              <p class="lead mb-4">
                Únete a cientos de graduados ULEAM que ya encontraron su empleo
                ideal
              </p>
              <div class="d-flex gap-3 justify-content-center flex-wrap">
                <a routerLink="/auth/register" class="btn btn-light btn-lg">
                  Registrarse como Graduado
                </a>
                <a
                  routerLink="/auth/register"
                  class="btn btn-outline-light btn-lg"
                >
                  Registrar Empresa
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingStats>
      <div class="col-12">
        <app-loading message="Cargando estadísticas..."></app-loading>
      </div>
    </ng-template>
  `,
  styles: [
    `
      .hero-image {
        animation: float 3s ease-in-out infinite;
      }

      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
        100% {
          transform: translateY(0px);
        }
      }

      .feature-icon {
        transition: transform 0.3s ease;
      }

      .feature-icon:hover {
        transform: scale(1.1);
      }

      .card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
      }

      @media (max-width: 768px) {
        .display-4 {
          font-size: 2.5rem;
        }

        .hero-image i {
          font-size: 8rem !important;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  stats = {
    totalJobs: 0,
    totalApplications: 0,
    totalCandidates: 0,
    totalCompanies: 0,
  };

  isLoading = true;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.jobService.getJobStats().subscribe({
      next: (stats: any) => {
        this.stats.totalJobs = stats.active;
        this.stats.totalApplications = stats.totalApplications;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
