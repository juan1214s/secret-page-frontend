import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Department } from '../../../../core/models/department.model';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { DepartmentsApiService } from '../../../../core/services/departments-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconButton } from '../../../../shared/ui/icon-button/icon-button';
import { Modal } from '../../../../shared/ui/modal/modal';

@Component({
  selector: 'app-departments-list',
  imports: [ReactiveFormsModule, FormsModule, IconButton, Modal],
  templateUrl: './departments-list.html',
})
export class DepartmentsList implements OnInit {
  private readonly api = inject(DepartmentsApiService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly departments = signal<Department[]>([]);
  protected readonly loading = signal(true);
  protected readonly search = signal('');
  protected readonly saving = signal(false);

  protected readonly modalOpen = signal(false);
  protected readonly editing = signal<Department | null>(null);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.departments();
    }
    return this.departments().filter((d) => d.name.toLowerCase().includes(term));
  });

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (list) => {
        this.departments.set([...list].sort((a, b) => a.name.localeCompare(b.name)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ name: '' });
    this.modalOpen.set(true);
  }

  protected openEdit(dept: Department): void {
    this.editing.set(dept);
    this.form.reset({ name: dept.name });
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
    const request = editing ? this.api.update(editing.id, dto) : this.api.create(dto);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.toast.show(editing ? 'Departamento actualizado.' : 'Departamento creado.', 'ok');
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  protected async remove(dept: Department): Promise<void> {
    const ok = await this.confirm.ask(`Se eliminará "${dept.name}". Esto falla si aún tiene ciudades asociadas.`, {
      title: 'Eliminar departamento',
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) {
      return;
    }
    this.api.delete(dept.id).subscribe({
      next: () => {
        this.toast.show('Departamento eliminado.', 'ok');
        this.load();
      },
    });
  }
}
