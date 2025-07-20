import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmployerGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      this.authService.isAuthenticated() &&
      this.authService.hasRole('employer')
    ) {
      return true;
    } else {
      if (this.authService.hasRole('graduate')) {
        this.router.navigate(['/graduate/dashboard']);
      } else {
        this.router.navigate(['/auth/login']);
      }
      return false;
    }
  }
}
