import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Profile } from '../../../../core/models/profile.model';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ProfilesApiService } from '../../../../core/services/profiles-api.service';
import { ProfileClicksApiService } from '../../../../core/services/profile-clicks-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconButton } from '../../../../shared/ui/icon-button/icon-button';

@Component({
  selector: 'app-profiles-list',
  imports: [FormsModule, RouterLink, IconButton],
  templateUrl: './profiles-list.html',
})
export class ProfilesList implements OnInit {
  private readonly api = inject(ProfilesApiService);
  private readonly clicksApi = inject(ProfileClicksApiService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly profiles = signal<Profile[]>([]);
  protected readonly loading = signal(true);
  protected readonly search = signal('');
  protected readonly clickCounts = signal<Map<string, number>>(new Map());

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.profiles();
    }
    return this.profiles().filter(
      (p) => p.name.toLowerCase().includes(term) || (p.city?.name ?? '').toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (list) => {
        this.profiles.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.clicksApi.getCounts().subscribe({
      next: (counts) => {
        this.clickCounts.set(new Map(counts.map((entry) => [entry.profileId, entry.count])));
      },
      error: () => {},
    });
  }

  protected clicksFor(profile: Profile): number {
    return this.clickCounts().get(profile.id) ?? 0;
  }

  protected edit(profile: Profile): void {
    this.router.navigate(['/admin/perfiles', profile.id]);
  }

  protected async remove(profile: Profile): Promise<void> {
    const ok = await this.confirm.ask(
      `Se eliminará "${profile.name}" junto con sus imágenes y comentarios. Los archivos en S3 no se borran automáticamente.`,
      { title: 'Eliminar perfil', confirmLabel: 'Eliminar', danger: true },
    );
    if (!ok) {
      return;
    }
    this.api.delete(profile.id).subscribe({
      next: () => {
        this.profiles.update((list) => list.filter((p) => p.id !== profile.id));
        this.toast.show('Perfil eliminado.', 'ok');
      },
    });
  }
}
