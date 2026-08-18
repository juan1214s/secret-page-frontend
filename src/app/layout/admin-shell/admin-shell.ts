import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { ToastService } from '../../core/services/toast.service';

interface NavEntry {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-admin-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-shell.html',
})
export class AdminShell {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  protected readonly currentUser = this.auth.currentUser;

  protected readonly nav: NavEntry[] = [
    { path: 'comentarios', label: 'Comentarios', icon: 'comments' },
    { path: 'perfiles', label: 'Perfiles', icon: 'profiles' },
    { path: 'ciudades', label: 'Ciudades', icon: 'cities' },
    { path: 'departamentos', label: 'Departamentos', icon: 'departments' },
    { path: 'usuarios', label: 'Usuarios', icon: 'users' },
  ];

  protected async onLogout(): Promise<void> {
    const ok = await this.confirm.ask('Vas a cerrar tu sesión en este panel.', {
      title: 'Cerrar sesión',
      confirmLabel: 'Cerrar sesión',
    });
    if (!ok) {
      return;
    }
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => {
        this.toast.show('No se pudo cerrar sesión en el servidor, pero se limpió la sesión local.', 'info');
        this.router.navigate(['/admin/login']);
      },
    });
  }
}
