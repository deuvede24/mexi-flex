import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      // Si el usuario no está logueado (guest), puede acceder
      return true;
    } else {
      // Si está logueado, lo redirigimos a la vista de usuario
      this.router.navigate(['/recipes/user']);
      return false;
    }
  }
}
