import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { City } from '../../../../core/models/city.model';
import { ProfileImage } from '../../../../core/models/image.model';
import { CitiesApiService } from '../../../../core/services/cities-api.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ImagesApiService } from '../../../../core/services/images-api.service';
import { ProfilesApiService } from '../../../../core/services/profiles-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconButton } from '../../../../shared/ui/icon-button/icon-button';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;
const WHATSAPP_PATTERN = /^(\+57)?3\d{9}$/;

@Component({
  selector: 'app-profile-form',
  imports: [ReactiveFormsModule, RouterLink, IconButton],
  templateUrl: './profile-form.html',
})
export class ProfileForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profilesApi = inject(ProfilesApiService);
  private readonly citiesApi = inject(CitiesApiService);
  private readonly imagesApi = inject(ImagesApiService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  protected readonly profileId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = !!this.profileId;

  protected readonly cities = signal<City[]>([]);
  protected readonly images = signal<ProfileImage[]>([]);
  protected readonly loading = signal(this.isEditMode);
  protected readonly saving = signal(false);
  protected readonly uploading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    description: ['', [Validators.maxLength(1000)]],
    whatsappNumber: ['', [Validators.required, Validators.pattern(WHATSAPP_PATTERN)]],
    cityId: ['', [Validators.required]],
    active: [true],
    isFeatured: [false],
    priorityScore: [0, [Validators.min(0), Validators.max(100)]],
  });

  ngOnInit(): void {
    this.citiesApi.getAll().subscribe((list) => this.cities.set([...list].sort((a, b) => a.name.localeCompare(b.name))));

    if (this.isEditMode && this.profileId) {
      this.profilesApi.getOne(this.profileId).subscribe({
        next: (profile) => {
          this.form.patchValue(profile);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
      this.loadImages(this.profileId);
    }
  }

  private loadImages(profileId: string): void {
    this.imagesApi.getByProfile(profileId).subscribe((list) => this.images.set(list));
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const value = this.form.getRawValue();

    if (this.isEditMode && this.profileId) {
      this.profilesApi.update(this.profileId, value).subscribe({
        next: () => {
          this.saving.set(false);
          this.toast.show('Perfil actualizado.', 'ok');
        },
        error: () => this.saving.set(false),
      });
      return;
    }

    const { name, description, whatsappNumber, cityId } = value;
    this.profilesApi.create({ name, description, whatsappNumber, cityId }).subscribe({
      next: (created) => {
        this.saving.set(false);
        this.toast.show('Perfil creado. Ahora puedes destacarlo y agregar imágenes.', 'ok');
        this.router.navigate(['/admin/perfiles', created.id]);
      },
      error: () => this.saving.set(false),
    });
  }

  protected triggerUpload(): void {
    this.fileInput?.nativeElement.click();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !this.profileId) {
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      this.toast.show('Solo se aceptan imágenes JPEG, PNG o WEBP.', 'danger');
      return;
    }
    if (file.size > MAX_BYTES) {
      this.toast.show('La imagen supera el máximo de 5 MB.', 'danger');
      return;
    }
    this.uploading.set(true);
    this.imagesApi.upload(file, this.profileId).subscribe({
      next: (image) => {
        this.images.update((list) => [...list, image]);
        this.uploading.set(false);
        this.toast.show('Imagen subida.', 'ok');
      },
      error: () => this.uploading.set(false),
    });
  }

  protected setMain(image: ProfileImage): void {
    this.imagesApi.update(image.id, { isMain: true }).subscribe(() => {
      if (this.profileId) {
        this.loadImages(this.profileId);
      }
    });
  }

  protected async removeImage(image: ProfileImage): Promise<void> {
    const ok = await this.confirm.ask('Se eliminará esta imagen del perfil.', {
      title: 'Eliminar imagen',
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) {
      return;
    }
    this.imagesApi.delete(image.id).subscribe({
      next: () => {
        this.images.update((list) => list.filter((i) => i.id !== image.id));
        this.toast.show('Imagen eliminada.', 'ok');
      },
    });
  }
}
