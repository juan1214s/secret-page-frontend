import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    @if (open()) {
      <div class="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(18,24,32,0.4)] px-4" (click)="closed.emit()">
        <div
          class="w-full max-w-[440px] rounded-xl bg-surface border border-line p-6 shadow-[0_12px_32px_rgba(18,24,32,0.18)] max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()"
        >
          <div class="flex items-start justify-between gap-4 mb-5">
            <h2 class="text-[16px] font-bold m-0">{{ title() }}</h2>
            <button type="button" class="text-ink-muted hover:text-ink" (click)="closed.emit()" aria-label="Cerrar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class Modal {
  readonly open = input.required<boolean>();
  readonly title = input.required<string>();
  readonly closed = output<void>();
}
