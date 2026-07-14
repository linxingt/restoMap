import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideUser, LucideChevronDown, LucideChevronUp, LucideLogOut, LucideLogIn, LucideUserPlus, LucideHeart, LucideFileText } from '@lucide/angular';
import { AuthModalService } from '../../core/services/auth-modal-service';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideUser, LucideChevronDown, LucideChevronUp, LucideLogOut, LucideLogIn, LucideUserPlus, LucideHeart, LucideFileText],
  templateUrl: './navbar.html',
})
export class Navbar {

  private authModalService = inject(AuthModalService);
  public authService = inject(AuthService);
  isDropdownOpen = signal<boolean>(false);

  openLoginModal() {
    this.isDropdownOpen.set(false);
    this.authModalService.openLogin();
  }
  openRegisterModal() {
    this.isDropdownOpen.set(false);
    this.authModalService.openRegister();
  }

  logout() {
    this.isDropdownOpen.set(false);
    this.authService.logout();
  }

  toggleDropdown(): void {
    this.isDropdownOpen.update(value => !value);
  }

  getUsernameInitial(): string {
    const username = this.authService.getUsername();
    return username ? username.charAt(0).toUpperCase() : '?';
  }
}

