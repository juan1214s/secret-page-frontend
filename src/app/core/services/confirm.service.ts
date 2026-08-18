import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  danger: boolean;
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  readonly request = signal<ConfirmRequest | null>(null);

  ask(message: string, opts: { title?: string; confirmLabel?: string; danger?: boolean } = {}): Promise<boolean> {
    return new Promise((resolve) => {
      this.request.set({
        title: opts.title ?? 'Confirmar acción',
        message,
        confirmLabel: opts.confirmLabel ?? 'Confirmar',
        danger: opts.danger ?? false,
        resolve,
      });
    });
  }

  resolve(value: boolean): void {
    this.request()?.resolve(value);
    this.request.set(null);
  }
}
