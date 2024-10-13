import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, Login, AuthResponse } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private httpClient = inject(HttpClient);
  private router: Router;
  currentUser: User | null = null;

  constructor(router: Router) {
    this.router = router;
  }

  // Registrar un usuario
  register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/auth/register`, user, { withCredentials: true }).pipe(
      tap((response: AuthResponse) => {
       // localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser = response.user;
        this.router.navigate(['/']);
      })
    );
  }

  // Iniciar sesión de un usuario
  login(user: Login): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/auth/login`, user, { withCredentials: true }).pipe(
      tap((response: AuthResponse) => {
        console.log("Respuesta de login:", response);
      //  localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser = response.user;
      })
    );
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }

  // Obtener el usuario logueado del localStorage
 /* getUser(): User | null {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  }*/

      // Obtener el usuario logueado en la sesión actual
  getUser(): User | null {
    return this.currentUser;  // No usamos localStorage, solo el estado actual en memoria
  }


  // Cerrar sesión
  logout(): void {
    this.httpClient.get(`${this.apiUrl}/auth/logout`, { withCredentials: true }).subscribe({
      next: () => {
       // localStorage.removeItem('user');
        this.currentUser = null;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Error durante el logout:", err);
      }
    });
  }
}
