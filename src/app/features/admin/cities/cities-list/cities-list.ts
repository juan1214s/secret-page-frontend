import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { City } from '../../../../core/models/city.model';
import { Department } from '../../../../core/models/department.model';
import { CitiesApiService } from '../../../../core/services/cities-api.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { DepartmentsApiService } from '../../../../core/services/departments-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconButton } from '../../../../shared/ui/icon-button/icon-button';
import { Modal } from '../../../../shared/ui/modal/modal';

@Component({
  selector: 'app-cities-list',
  imports: [ReactiveFormsModule, FormsModule, IconButton, Modal],
  templateUrl: './cities-list.html',
})
export class CitiesList implements OnInit {
  private readonly citiesApi = inject(CitiesApiService);
  private readonly departmentsApi = inject(DepartmentsApiService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly cities = signal<City[]>([]);
  protected readonly departments = signal<Department[]>([]);
  protected readonly loading = signal(true);
  protected readonly search = signal('');
  protected readonly saving = signal(false);

  protected readonly modalOpen = signal(false);
  protected readonly editing = signal<City | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.cities();
    }
    return this.cities().filter(
      (c) => c.name.toLowerCase().includes(term) || this.departmentName(c).toLowerCase().includes(term),
    );
  });

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
    departmentId: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.departmentsApi.getAll().subscribe((list) => this.departments.set([...list].sort((a, b) => a.name.localeCompare(b.name))));
    this.load();
  }

  protected departmentName(city: City): string {
    return city.department?.name ?? this.departments().find((d) => d.id === city.departmentId)?.name ?? '—';
  }

  private load(): void {
    this.loading.set(true);
    this.citiesApi.getAll().subscribe({
      next: (list) => {
        this.cities.set([...list].sort((a, b) => a.name.localeCompare(b.name)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ name: '', departmentId: '' });
    this.modalOpen.set(true);
  }

  protected openEdit(city: City): void {
    this.editing.set(city);
    this.form.reset({ name: city.name, departmentId: city.departmentId });
    this.modalOpen.set(true);
  }

  protected closeModal(): void {
    this.modalOpen.set(false);
  }

  protected save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const dto = this.form.getRawValue();
    const editing = this.editing();
    const request = editing ? this.citiesApi.update(editing.id, dto) : this.citiesApi.create(dto);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.toast.show(editing ? 'Ciudad actualizada.' : 'Ciudad creada.', 'ok');
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  protected async remove(city: City): Promise<void> {
    const ok = await this.confirm.ask(`Se eliminará "${city.name}". Esto falla si aún tiene perfiles asociados.`, {
      title: 'Eliminar ciudad',
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) {
      return;
    }
    this.citiesApi.delete(city.id).subscribe({
      next: () => {
        this.toast.show('Ciudad eliminada.', 'ok');
        this.load();
      },
    });
  }
}
