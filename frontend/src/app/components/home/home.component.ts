import { Component, OnInit } from '@angular/core';
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

 
    getFullName(): string {
      if (this.authService.currentUser) {
        const name = this.authService.currentUser.name || '';
        const surname = this.authService.currentUser.surname || '';
        
        // Si ambos, nombre y apellido, están vacíos, mostramos "Invitado"
        if (!name && !surname) {
          return 'Invitado';
        }
        
        return `${name} ${surname}`.trim();
      }
      return 'Invitado';
    }


  goToRecipes(): void {
    this.router.navigate(['/recipes']);
  }

  goToAccount(): void {
    this.router.navigate(['/account']); // Asumiendo que tienes una ruta '/account'
  }

  setGuestRole(): void {
    this.authService.setGuestRole();
    this.router.navigate(['/recipes']); // Redirigir a la lista de recetas o la ruta que decidas
  }

  logout(): void {
    this.authService.logout();
    //window.location.reload(); // Recargar la página para restablecer el estado
    this.router.navigate(['/']); // Redirigir a la página de inicio
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}





