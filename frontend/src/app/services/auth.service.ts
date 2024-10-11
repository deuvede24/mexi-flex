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
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/auth/register`, user).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
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
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser = response.user;
      })
    );
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    const loggedIn = !!localStorage.getItem('token');
    console.log("¿Está logueado?", loggedIn);
    return loggedIn;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.id_user === 1; 
  }

  // Obtener el usuario logueado del localStorage
  getUser(): User | null {
    const userString = localStorage.getItem('user');
    console.log("Usuario obtenido del localStorage:", userString);
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentUser = user;
        return user;
      } catch (e) {
        console.error("Error al parsear el usuario del localStorage:", e);
        return null;
      }
    }
    return null;
  }

  // Cerrar sesión
  logout(): void {
    // Llamamos al backend para eliminar la cookie y luego limpiamos el localStorage
    this.httpClient.get(`${this.apiUrl}/auth/logout`, { withCredentials: true }).subscribe({
      next: () => {
        // Eliminamos los datos locales
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear(); // Limpiamos el sessionStorage
        this.currentUser = null;
        // Redirigimos al usuario
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error("Error durante el logout:", err);
      }
    });
  }
}
