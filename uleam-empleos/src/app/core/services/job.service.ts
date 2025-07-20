import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Job, JobFilter, Application } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly JOBS_KEY = 'uleam_empleos_jobs';

  constructor() {
    this.initializeMockJobs();
  }

  private initializeMockJobs(): void {
    const existingJobs = localStorage.getItem(this.JOBS_KEY);
    if (!existingJobs) {
      // Inicializar con array vacío - sin datos estáticos
      const mockJobs: Job[] = [];
      localStorage.setItem(this.JOBS_KEY, JSON.stringify(mockJobs));
    }
  }

  getAllJobs(): Observable<Job[]> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const jobs = localStorage.getItem(this.JOBS_KEY);
        return jobs ? JSON.parse(jobs) : [];
      })
    );
  }

  getJobById(id: string): Observable<Job | null> {
    return this.getAllJobs().pipe(
      map((jobs) => jobs.find((job) => job.id === id) || null)
    );
  }

  getJobsByEmployer(employerId: string): Observable<Job[]> {
    return this.getAllJobs().pipe(
      map((jobs) => jobs.filter((job) => job.employerId === employerId))
    );
  }

  searchJobs(filters: JobFilter): Observable<Job[]> {
    return this.getAllJobs().pipe(
      map((jobs) => {
        return jobs.filter((job) => {
          if (filters.area && job.area !== filters.area) return false;
          if (
            filters.location &&
            !job.location.toLowerCase().includes(filters.location.toLowerCase())
          )
            return false;
          if (filters.modality && job.modality !== filters.modality)
            return false;
          if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            return (
              job.title.toLowerCase().includes(keyword) ||
              job.description.toLowerCase().includes(keyword) ||
              job.requirements.some((req) =>
                req.toLowerCase().includes(keyword)
              )
            );
          }
          return true;
        });
      })
    );
  }

  createJob(
    jobData: Omit<Job, 'id' | 'applications' | 'publishDate'>
  ): Observable<Job> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const jobs = this.getJobsFromStorage();
        const newJob: Job = {
          ...jobData,
          id: this.generateId(),
          applications: [],
          publishDate: new Date(),
        };

        jobs.push(newJob);
        localStorage.setItem(this.JOBS_KEY, JSON.stringify(jobs));

        return newJob;
      })
    );
  }

  updateJob(id: string, jobData: Partial<Job>): Observable<Job> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const jobs = this.getJobsFromStorage();
        const jobIndex = jobs.findIndex((job) => job.id === id);

        if (jobIndex === -1) {
          throw new Error('Empleo no encontrado');
        }

        jobs[jobIndex] = { ...jobs[jobIndex], ...jobData };
        localStorage.setItem(this.JOBS_KEY, JSON.stringify(jobs));

        return jobs[jobIndex];
      })
    );
  }

  deleteJob(id: string): Observable<boolean> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const jobs = this.getJobsFromStorage();
        const filteredJobs = jobs.filter((job) => job.id !== id);

        if (filteredJobs.length === jobs.length) {
          throw new Error('Empleo no encontrado');
        }

        localStorage.setItem(this.JOBS_KEY, JSON.stringify(filteredJobs));
        return true;
      })
    );
  }

  getActiveJobs(): Observable<Job[]> {
    return this.getAllJobs().pipe(
      map((jobs) =>
        jobs.filter(
          (job) =>
            job.status === 'active' && new Date(job.deadline) > new Date()
        )
      )
    );
  }

  getJobStats(employerId?: string): Observable<{
    total: number;
    active: number;
    closed: number;
    totalApplications: number;
  }> {
    return this.getAllJobs().pipe(
      map((jobs) => {
        const filteredJobs = employerId
          ? jobs.filter((job) => job.employerId === employerId)
          : jobs;

        return {
          total: filteredJobs.length,
          active: filteredJobs.filter((job) => job.status === 'active').length,
          closed: filteredJobs.filter((job) => job.status === 'closed').length,
          totalApplications: filteredJobs.reduce(
            (total, job) => total + job.applications.length,
            0
          ),
        };
      })
    );
  }

  private getJobsFromStorage(): Job[] {
    const jobs = localStorage.getItem(this.JOBS_KEY);
    return jobs ? JSON.parse(jobs) : [];
  }

  private generateId(): string {
    return (
      'job_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
    );
  }

  // Métodos para obtener opciones de filtros
  getJobAreas(): Observable<string[]> {
    return this.getAllJobs().pipe(
      map((jobs) => {
        const areas = jobs.map((job) => job.area);
        return [...new Set(areas)].sort();
      })
    );
  }

  getJobLocations(): Observable<string[]> {
    return this.getAllJobs().pipe(
      map((jobs) => {
        const locations = jobs.map((job) => job.location);
        return [...new Set(locations)].sort();
      })
    );
  }
}
