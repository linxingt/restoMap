import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideUser, LucideChevronDown, LucideChevronUp, LucideLogOut, LucideLogIn, LucideUserPlus, LucideHeart, LucideFileText } from '@lucide/angular';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideUser, LucideChevronDown, LucideChevronUp, LucideLogOut, LucideLogIn, LucideUserPlus, LucideHeart, LucideFileText],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  isLoggedIn = signal<boolean>(true);
  logout() {
    this.isLoggedIn.set(false);
  }//att inject(AuthService);

  // Signal pour gérer l'état d'ouverture du dropdown utilisateur
  isDropdownOpen = signal<boolean>(false);

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }
}
