/*import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta al servicio de autenticación es correcta
import { RouterLink, Router } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUserLoggedIn: boolean = false; // Nueva propiedad para almacenar el estado de autenticación

  constructor(public authService: AuthService, private router: Router) { }


  ngOnInit(): void {
    if (!this.authService.currentUser && this.authService.isLoggedIn()) {
      this.authService.getUser(); // Esto también establece el currentUser
    }
    console.log('Current user in HomeComponent:', this.authService.currentUser);
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }



      getUsername(): string {
        return this.authService.currentUser?.username || 'Invitado';
      }
      


  goToRecipes(): void {
    this.router.navigate(['/recipes']);
  }

  goToUserRecipes(): void {
    this.router.navigate(['/recipes-user']);
  }

  goToAccount(): void {
    this.router.navigate(['/account']); 
  }

  setGuestRole(): void {
    this.authService.setGuestRole();
    this.router.navigate(['/recipes']); 
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); 
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}*/


import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que la ruta al servicio de autenticación es correcta
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isUserLoggedIn: boolean = false; // Propiedad para almacenar el estado de autenticación

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isLoggedIn(); // Revisar si el usuario está logueado
    if (!this.authService.currentUser && this.authService.isLoggedIn()) {
      this.authService.getUser(); // Obtener el usuario si no está ya asignado
    }
    console.log('Usuario actual en HomeComponent:', this.authService.currentUser);
  }

  // Verificar si el usuario está logueado
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  // Obtener el nombre de usuario o mostrar "Invitado" si no está logueado
  getUsername(): string {
    return this.authService.currentUser?.username || 'Invitado';
  }

  // Navegar a la vista de recetas
  goToRecipes(): void {
    this.router.navigate(['/recipes']);
  }

  // Navegar a la vista de recetas para usuarios registrados/invitados
  goToUserRecipes(): void {
    this.router.navigate(['/recipes-user']);
  }

  // Navegar a la cuenta del usuario
  goToAccount(): void {
    this.router.navigate(['/account']); // Asumiendo que tienes una ruta '/account'
  }

  // Cerrar sesión
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirigir a la página de inicio
  }

  // Navegar al formulario de login
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Navegar al formulario de registro
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}





