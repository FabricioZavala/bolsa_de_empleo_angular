import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GraduateGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      this.authService.isAuthenticated() &&
      this.authService.hasRole('graduate')
    ) {
      return true;
    } else {
      if (this.authService.hasRole('employer')) {
        this.router.navigate(['/employer/dashboard']);
      } else {
        this.router.navigate(['/auth/login']);
      }
      return false;
    }
  }
}
