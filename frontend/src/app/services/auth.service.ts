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

  login(user: Login): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/auth/login`, user, { withCredentials: true }).pipe(
      tap((response: AuthResponse) => {
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser = response.user;
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  // Simplificar para que todos los usuarios sean administradores.
  isAdmin(): boolean {
    return true;
  }

  getUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    } else {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          this.currentUser = user;
          return user;
        } catch (e) {
          return null;
        }
      }
      return null;
    }
  }


  getFullName(): string {
    if (this.currentUser) {
      const name = this.currentUser.name || 'Invitado';
      const surname = this.currentUser.surname || '';
      return `${name} ${surname}`.trim();
    }
    return 'Invitado';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
  }

  setGuestRole(): void {
    const guestUser: User = {
      id_user: 0,
      email: 'guest@example.com',
      role: 'guest',
      name: 'Guest',
      surname: 'User'
    };
    this.currentUser = guestUser;
    localStorage.setItem('user', JSON.stringify(guestUser));
  }
}
