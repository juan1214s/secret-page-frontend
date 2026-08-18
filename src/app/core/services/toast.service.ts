import { Injectable, signal } from '@angular/core';

export type ToastTone = 'info' | 'ok' | 'danger';

export interface Toast {
  id: number;
  tone: ToastTone;
  message: string;
}

let nextId = 1;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  show(message: string, tone: ToastTone = 'info', durationMs = 5000): void {
    const toast: Toast = { id: nextId++, tone, message };
    this.toasts.update((list) => [...list, toast]);
    setTimeout(() => this.dismiss(toast.id), durationMs);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
