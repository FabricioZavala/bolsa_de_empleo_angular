import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay, switchMap } from 'rxjs/operators';
import { Application, Job } from '../models/user.model';
import { JobService } from './job.service';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private readonly APPLICATIONS_KEY = 'uleam_empleos_applications';

  constructor(private jobService: JobService) {
    this.initializeMockApplications();
  }

  private initializeMockApplications(): void {
    const existingApplications = localStorage.getItem(this.APPLICATIONS_KEY);
    if (!existingApplications) {
      const mockApplications: Application[] = [
        {
          id: 'app1',
          jobId: 'job1',
          graduateId: '1',
          applicationDate: new Date('2024-07-16'),
          status: 'pending',
          coverLetter:
            'Estimados, me dirijo a ustedes para expresar mi interés en la posición de Desarrollador Frontend Angular. Como graduado de Ingeniería en Sistemas de ULEAM, considero que mi experiencia y conocimientos en Angular me convierten en un candidato ideal para este puesto...',
        },
      ];
      localStorage.setItem(
        this.APPLICATIONS_KEY,
        JSON.stringify(mockApplications)
      );
    }
  }

  applyToJob(
    jobId: string,
    graduateId: string,
    coverLetter: string
  ): Observable<Application> {
    return of(null).pipe(
      delay(500),
      switchMap(() => {
        // Verificar si ya aplicó a este empleo
        return this.hasApplied(jobId, graduateId).pipe(
          map((hasApplied) => {
            if (hasApplied) {
              throw new Error('Ya has aplicado a este empleo');
            }

            const applications = this.getApplicationsFromStorage();
            const newApplication: Application = {
              id: this.generateId(),
              jobId,
              graduateId,
              applicationDate: new Date(),
              status: 'pending',
              coverLetter,
            };

            applications.push(newApplication);
            localStorage.setItem(
              this.APPLICATIONS_KEY,
              JSON.stringify(applications)
            );

            // Actualizar el empleo para incluir la aplicación
            this.updateJobApplications(jobId, newApplication);

            return newApplication;
          })
        );
      })
    );
  }

  getApplicationsByGraduate(graduateId: string): Observable<Application[]> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const applications = this.getApplicationsFromStorage();
        return applications.filter((app) => app.graduateId === graduateId);
      })
    );
  }

  getApplicationsByJob(jobId: string): Observable<Application[]> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const applications = this.getApplicationsFromStorage();
        return applications.filter((app) => app.jobId === jobId);
      })
    );
  }

  getApplicationById(id: string): Observable<Application | null> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const applications = this.getApplicationsFromStorage();
        return applications.find((app) => app.id === id) || null;
      })
    );
  }

  updateApplicationStatus(
    id: string,
    status: Application['status']
  ): Observable<Application> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const applications = this.getApplicationsFromStorage();
        const appIndex = applications.findIndex((app) => app.id === id);

        if (appIndex === -1) {
          throw new Error('Aplicación no encontrada');
        }

        applications[appIndex].status = status;
        localStorage.setItem(
          this.APPLICATIONS_KEY,
          JSON.stringify(applications)
        );

        return applications[appIndex];
      })
    );
  }

  hasApplied(jobId: string, graduateId: string): Observable<boolean> {
    return this.getApplicationsByGraduate(graduateId).pipe(
      map((applications) => applications.some((app) => app.jobId === jobId))
    );
  }

  getApplicationStats(graduateId: string): Observable<{
    total: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  }> {
    return this.getApplicationsByGraduate(graduateId).pipe(
      map((applications) => ({
        total: applications.length,
        pending: applications.filter((app) => app.status === 'pending').length,
        reviewed: applications.filter((app) => app.status === 'reviewed')
          .length,
        accepted: applications.filter((app) => app.status === 'accepted')
          .length,
        rejected: applications.filter((app) => app.status === 'rejected')
          .length,
      }))
    );
  }

  getEmployerApplicationStats(employerId: string): Observable<{
    totalApplications: number;
    pendingReview: number;
    reviewed: number;
    accepted: number;
    rejected: number;
  }> {
    return this.jobService.getJobsByEmployer(employerId).pipe(
      switchMap((jobs) => {
        const jobIds = jobs.map((job) => job.id);
        return of(null).pipe(
          map(() => {
            const applications = this.getApplicationsFromStorage();
            const employerApplications = applications.filter((app) =>
              jobIds.includes(app.jobId)
            );

            return {
              totalApplications: employerApplications.length,
              pendingReview: employerApplications.filter(
                (app) => app.status === 'pending'
              ).length,
              reviewed: employerApplications.filter(
                (app) => app.status === 'reviewed'
              ).length,
              accepted: employerApplications.filter(
                (app) => app.status === 'accepted'
              ).length,
              rejected: employerApplications.filter(
                (app) => app.status === 'rejected'
              ).length,
            };
          })
        );
      })
    );
  }

  getApplicationsWithJobDetails(
    graduateId: string
  ): Observable<(Application & { job: Job })[]> {
    return this.getApplicationsByGraduate(graduateId).pipe(
      switchMap((applications) => {
        if (applications.length === 0) {
          return of([]);
        }

        return this.jobService.getAllJobs().pipe(
          map((jobs) => {
            return applications
              .map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return { ...app, job: job! };
              })
              .filter((app) => app.job);
          })
        );
      })
    );
  }

  private updateJobApplications(jobId: string, application: Application): void {
    this.jobService.getJobById(jobId).subscribe((job) => {
      if (job) {
        const updatedApplications = [...job.applications, application];
        this.jobService
          .updateJob(jobId, { applications: updatedApplications })
          .subscribe();
      }
    });
  }

  private getApplicationsFromStorage(): Application[] {
    const applications = localStorage.getItem(this.APPLICATIONS_KEY);
    return applications ? JSON.parse(applications) : [];
  }

  private generateId(): string {
    return (
      'app_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    );
  }

  // Obtener aplicaciones recientes para el empleador
  getRecentApplications(
    employerId: string,
    limit: number = 5
  ): Observable<(Application & { job: Job })[]> {
    return this.jobService.getJobsByEmployer(employerId).pipe(
      switchMap((jobs) => {
        const jobIds = jobs.map((job) => job.id);
        return of(null).pipe(
          map(() => {
            const applications = this.getApplicationsFromStorage();
            const employerApplications = applications
              .filter((app) => jobIds.includes(app.jobId))
              .sort(
                (a, b) =>
                  new Date(b.applicationDate).getTime() -
                  new Date(a.applicationDate).getTime()
              )
              .slice(0, limit);

            return employerApplications
              .map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return { ...app, job: job! };
              })
              .filter((app) => app.job);
          })
        );
      })
    );
  }

  // Eliminar aplicación (si es necesario)
  deleteApplication(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const applications = this.getApplicationsFromStorage();
        const filteredApplications = applications.filter(
          (app) => app.id !== id
        );

        if (filteredApplications.length === applications.length) {
          throw new Error('Aplicación no encontrada');
        }

        localStorage.setItem(
          this.APPLICATIONS_KEY,
          JSON.stringify(filteredApplications)
        );
        return true;
      })
    );
  }
}
