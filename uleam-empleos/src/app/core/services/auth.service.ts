import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, delay } from 'rxjs/operators';
import { User, GraduateProfile, EmployerProfile } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private readonly STORAGE_KEY = 'uleam_empleos_user';
  private readonly USERS_KEY = 'uleam_empleos_users';

  constructor() {
    this.loadCurrentUser();
    this.initializeMockData();
  }

  private loadCurrentUser(): void {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    if (userData) {
      const user = JSON.parse(userData);
      this.currentUserSubject.next(user);
    }
  }

  private initializeMockData(): void {
    const existingUsers = localStorage.getItem(this.USERS_KEY);
    if (!existingUsers) {
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'graduado@uleam.edu.ec',
          password: 'Password123!',
          role: 'graduate',
          createdAt: new Date('2024-01-15'),
          profile: {
            firstName: 'Juan',
            lastName: 'Pérez',
            phone: '+593987654321',
            address: 'Manta, Manabí, Ecuador',
            education: [
              {
                id: 'ed1',
                institution: 'Universidad Laica Eloy Alfaro de Manabí',
                degree: 'Ingeniería',
                fieldOfStudy: 'Sistemas Informáticos',
                startDate: new Date('2020-01-01'),
                endDate: new Date('2024-01-01'),
                current: false,
                description: 'Graduado con honores en Ingeniería de Sistemas',
              },
            ],
            experience: [
              {
                id: 'exp1',
                company: 'TechManta Solutions',
                position: 'Desarrollador Junior',
                location: 'Manta, Ecuador',
                startDate: new Date('2023-06-01'),
                endDate: new Date('2024-01-01'),
                current: false,
                description:
                  'Desarrollo de aplicaciones web con Angular y Node.js',
              },
            ],
            skills: [
              'Angular',
              'TypeScript',
              'Node.js',
              'JavaScript',
              'HTML',
              'CSS',
              'Git',
              'MySQL',
            ],
          } as GraduateProfile,
        },
        {
          id: '2',
          email: 'empresa@techcorp.com',
          password: 'Password123!',
          role: 'employer',
          createdAt: new Date('2024-01-10'),
          profile: {
            companyName: 'TechCorp Ecuador',
            industry: 'Tecnología',
            description:
              'Empresa líder en desarrollo de software y soluciones tecnológicas en Ecuador.',
            website: 'https://techcorp.com.ec',
            contactPerson: 'María González - Directora de RRHH',
          } as EmployerProfile,
        },
      ];
      localStorage.setItem(this.USERS_KEY, JSON.stringify(mockUsers));
    }
  }

  register(userData: {
    email: string;
    password: string;
    role: 'graduate' | 'employer';
    profile: Partial<GraduateProfile | EmployerProfile>;
  }): Observable<User> {
    return of(null).pipe(
      delay(1000), // Simular delay de red
      map(() => {
        const users = this.getUsers();

        // Verificar si el email ya existe
        if (users.some((user) => user.email === userData.email)) {
          throw new Error('El email ya está registrado');
        }

        const newUser: User = {
          id: this.generateId(),
          email: userData.email,
          password: userData.password,
          role: userData.role,
          createdAt: new Date(),
          profile:
            userData.role === 'graduate'
              ? ({
                  firstName: '',
                  lastName: '',
                  phone: '',
                  address: '',
                  education: [],
                  experience: [],
                  skills: [],
                  ...userData.profile,
                } as GraduateProfile)
              : ({
                  companyName: '',
                  industry: '',
                  description: '',
                  website: '',
                  contactPerson: '',
                  ...userData.profile,
                } as EmployerProfile),
        };

        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return newUser;
      })
    );
  }

  login(email: string, password: string): Observable<User> {
    return of(null).pipe(
      delay(1000), // Simular delay de red
      map(() => {
        const users = this.getUsers();
        const user = users.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error('Email o contraseña incorrectos');
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);

        return user;
      })
    );
  }

  logout(): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        localStorage.removeItem(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: 'graduate' | 'employer'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  updateProfile(
    profileData: Partial<GraduateProfile | EmployerProfile>
  ): Observable<User> {
    return of(null).pipe(
      delay(500),
      map(() => {
        const currentUser = this.getCurrentUser();
        if (!currentUser) {
          throw new Error('Usuario no autenticado');
        }

        const updatedUser: User = {
          ...currentUser,
          profile: { ...currentUser.profile, ...profileData },
        };

        // Actualizar en localStorage
        const users = this.getUsers();
        const userIndex = users.findIndex((u) => u.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);

        return updatedUser;
      })
    );
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Método para validar email único durante registro
  isEmailAvailable(email: string): Observable<boolean> {
    return of(null).pipe(
      delay(300),
      map(() => {
        const users = this.getUsers();
        return !users.some((user) => user.email === email);
      })
    );
  }

  // Método para obtener usuario por ID
  getUserById(userId: string): Observable<User | null> {
    return of(null).pipe(
      delay(100),
      map(() => {
        const users = this.getUsers();
        return users.find((user) => user.id === userId) || null;
      })
    );
  }

  // Método para obtener todos los usuarios (para empleadores)
  getAllUsers(): Observable<User[]> {
    return of(null).pipe(
      delay(200),
      map(() => this.getUsers())
    );
  }

  // Método para actualizar el usuario actual
  updateCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }
}
