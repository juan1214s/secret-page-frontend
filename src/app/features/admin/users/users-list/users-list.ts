import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicUser } from '../../../../core/models/user.model';
import { AuthService } from '../../../../core/services/auth.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ToastService } from '../../../../core/services/toast.service';
import { UsersApiService } from '../../../../core/services/users-api.service';
import { IconButton } from '../../../../shared/ui/icon-button/icon-button';
import { Modal } from '../../../../shared/ui/modal/modal';

@Component({
  selector: 'app-users-list',
  imports: [ReactiveFormsModule, FormsModule, IconButton, Modal],
  templateUrl: './users-list.html',
})
export class UsersList implements OnInit {
  private readonly api = inject(UsersApiService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  protected readonly users = signal<PublicUser[]>([]);
  protected readonly loading = signal(true);
  protected readonly search = signal('');
  protected readonly saving = signal(false);

  protected readonly modalOpen = signal(false);
  protected readonly editing = signal<PublicUser | null>(null);
  protected readonly myUserId = computed(() => this.auth.currentUser()?.sub);

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.users();
    }
    return this.users().filter((u) => u.email.toLowerCase().includes(term));
  });

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.maxLength(100)]],
    role: ['user' as 'admin' | 'user', [Validators.required]],
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: (list) => {
        this.users.set([...list].sort((a, b) => a.email.localeCompare(b.email)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected openCreate(): void {
    this.editing.set(null);
    this.form.reset({ email: '', password: '', role: 'user' });
    this.form.controls.password.addValidators(Validators.required);
    this.form.controls.password.updateValueAndValidity();
    this.modalOpen.set(true);
  }

  protected openEdit(user: PublicUser): void {
    this.editing.set(user);
    this.form.controls.password.clearValidators();
    this.form.controls.password.addValidators([Validators.minLength(8), Validators.maxLength(100)]);
    this.form.reset({ email: user.email, password: '', role: user.role });
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
    const editing = this.editing();
    const { email, role, password } = this.form.getRawValue();

    const request = editing ? this.api.update(editing.id, { email, role }) : this.api.create({ email, role, password });

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.modalOpen.set(false);
        this.toast.show(editing ? 'Usuario actualizado.' : 'Usuario creado.', 'ok');
        this.load();
      },
      error: () => this.saving.set(false),
    });
  }

  protected async remove(user: PublicUser): Promise<void> {
    const ok = await this.confirm.ask(`Se eliminará la cuenta de "${user.email}".`, {
      title: 'Eliminar usuario',
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) {
      return;
    }
    this.api.delete(user.id).subscribe({
      next: () => {
        this.toast.show('Usuario eliminado.', 'ok');
        this.load();
      },
    });
  }
}
