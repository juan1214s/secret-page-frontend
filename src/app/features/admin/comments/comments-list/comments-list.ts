import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ProfileComment } from '../../../../core/models/comment.model';
import { CommentsApiService } from '../../../../core/services/comments-api.service';
import { ConfirmService } from '../../../../core/services/confirm.service';
import { ToastService } from '../../../../core/services/toast.service';
import { IconButton } from '../../../../shared/ui/icon-button/icon-button';

type Tab = 'pending' | 'approved' | 'all';

@Component({
  selector: 'app-comments-list',
  imports: [FormsModule, IconButton],
  templateUrl: './comments-list.html',
})
export class CommentsList implements OnInit {
  private readonly api = inject(CommentsApiService);
  private readonly confirm = inject(ConfirmService);
  private readonly toast = inject(ToastService);

  protected readonly comments = signal<ProfileComment[]>([]);
  protected readonly loading = signal(true);
  protected readonly search = signal('');
  protected readonly tab = signal<Tab>('pending');
  protected readonly busyId = signal<string | null>(null);

  protected readonly pendingCount = computed(() => this.comments().filter((c) => !c.approved).length);
  protected readonly oldestPendingLabel = computed(() => {
    const pending = this.comments().filter((c) => !c.approved);
    if (pending.length === 0) {
      return '—';
    }
    const oldest = pending.reduce((a, b) => (new Date(a.createdAt) < new Date(b.createdAt) ? a : b));
    return this.relativeAge(oldest.createdAt);
  });

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const byTab = this.comments().filter((c) => {
      if (this.tab() === 'pending') return !c.approved;
      if (this.tab() === 'approved') return c.approved;
      return true;
    });
    const bySearch = term
      ? byTab.filter(
          (c) =>
            c.authorName.toLowerCase().includes(term) ||
            c.content.toLowerCase().includes(term) ||
            (c.profile?.name ?? '').toLowerCase().includes(term),
        )
      : byTab;
    return [...bySearch].sort((a, b) => (a.approved === b.approved ? 0 : a.approved ? 1 : -1));
  });

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    // GET /comments does not eager-load `profile` (only GET /comments/pending does),
    // so pending comments would otherwise show no profile info. Fetch both and
    // backfill `profile` on any comment the "all" list returned without one.
    forkJoin({
      all: this.api.getAll(),
      pending: this.api.getPending(),
    }).subscribe({
      next: ({ all, pending }) => {
        const profileById = new Map(pending.map((c) => [c.id, c.profile]));
        this.comments.set(all.map((c) => (c.profile ? c : { ...c, profile: profileById.get(c.id) ?? c.profile })));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected setTab(tab: Tab): void {
    this.tab.set(tab);
  }

  protected approve(comment: ProfileComment): void {
    this.setApproval(comment, true);
  }

  protected revoke(comment: ProfileComment): void {
    this.setApproval(comment, false);
  }

  private setApproval(comment: ProfileComment, approved: boolean): void {
    this.busyId.set(comment.id);
    this.api.moderate(comment.id, { approved }).subscribe({
      next: (updated) => {
        // PATCH /comments/:id doesn't eager-load `profile` either — keep the one we already have.
        this.comments.update((list) =>
          list.map((c) => (c.id === updated.id ? { ...updated, profile: updated.profile ?? c.profile } : c)),
        );
        this.busyId.set(null);
        this.toast.show(approved ? 'Comentario aprobado.' : 'Aprobación revocada.', 'ok');
      },
      error: () => this.busyId.set(null),
    });
  }

  protected async remove(comment: ProfileComment): Promise<void> {
    const ok = await this.confirm.ask(`Se eliminará el comentario de "${comment.authorName}".`, {
      title: 'Eliminar comentario',
      confirmLabel: 'Eliminar',
      danger: true,
    });
    if (!ok) {
      return;
    }
    this.api.delete(comment.id).subscribe({
      next: () => {
        this.comments.update((list) => list.filter((c) => c.id !== comment.id));
        this.toast.show('Comentario eliminado.', 'ok');
      },
    });
  }

  protected relativeAge(iso: string): string {
    const ms = Date.now() - new Date(iso).getTime();
    const days = Math.floor(ms / 86_400_000);
    if (days >= 1) return `hace ${days}d`;
    const hours = Math.floor(ms / 3_600_000);
    if (hours >= 1) return `hace ${hours}h`;
    const minutes = Math.max(1, Math.floor(ms / 60_000));
    return `hace ${minutes}min`;
  }
}
