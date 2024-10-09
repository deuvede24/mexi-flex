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
        console.log("Respuesta de login:", response);
        localStorage.setItem('token', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.currentUser = response.user;
      })
    );
  }

 /* isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }*/
    isLoggedIn(): boolean {
      const loggedIn = !!localStorage.getItem('token');
      console.log("¿Está logueado?", loggedIn);
      return loggedIn;
    }

  // Simplificar para que todos los usuarios sean administradores.
  isAdmin(): boolean {
   // return true;
   const user = this.getUser();
  return user?.id_user === 1; 
  }

 /* getUser(): User | null {
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
          console.error("Error al parsear el usuario del localStorage:", e);
          return null;
        }
      }
      return null;
    }
  }*/
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


  /*getFullName(): string {
    if (this.currentUser) {
      const name = this.currentUser.name || 'Invitado';
      const surname = this.currentUser.surname || '';
      return `${name} ${surname}`.trim();
    }
    return 'Invitado';
  }*/

  /*logout(): void {
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser = null;
    //////////////////////////
  //  this.setGuestRole(); // Asegúrate de que se ejecute para configurar al usuario como "guest"
    this.router.navigate(['/']); // Redirige al home
  }*/

    logout(): void {
      // Llamamos al backend para eliminar la cookie y luego limpiamos el localStorage
      this.httpClient.get(`${this.apiUrl}/auth/logout`, { withCredentials: true }).subscribe({
        next: () => {
          // Eliminamos los datos locales
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          this.currentUser = null;
          // Redirigimos al usuario
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error("Error durante el logout:", err);
        }
      });
    }
    

  setGuestRole(): void {
    const guestUser: User = {
      id_user: 0,
      email: 'guest@example.com',
      role: 'guest',
      // name: 'Guest',
      //surname: 'User'
      username: 'Guest'
    };
    this.currentUser = guestUser;
    localStorage.setItem('user', JSON.stringify(guestUser));
  }
}
