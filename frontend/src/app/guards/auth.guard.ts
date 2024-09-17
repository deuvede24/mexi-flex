import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {}
  
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
      const isLoggedIn = this.authService.isLoggedIn();
  
      if (isLoggedIn) {
        return true;
      } else {
        this.notificationService.showError('Debe iniciar sesión para acceder a esta página.');
        this.router.navigate(['/']);
        return false;
      }
    }
  }