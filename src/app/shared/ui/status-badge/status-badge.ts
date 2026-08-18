import { Component, input } from '@angular/core';

export type StatusTone = 'ok' | 'warn' | 'off' | 'danger';

@Component({
  selector: 'app-status-badge',
  template: `
    <span class="inline-flex items-center gap-[7px] text-[12.5px] font-semibold" [class]="textClass()">
      <i class="inline-block w-[7px] h-[7px] rounded-full" [class]="dotClass()"></i>
      {{ label() }}
    </span>
  `,
})
export class StatusBadge {
  readonly label = input.required<string>();
  readonly tone = input<StatusTone>('off');

  protected dotClass(): string {
    return { ok: 'bg-ok', warn: 'bg-warn', off: 'bg-off', danger: 'bg-danger' }[this.tone()];
  }

  protected textClass(): string {
    return {
      ok: 'text-ok',
      warn: 'text-[#8A5F0E]',
      off: 'text-ink-muted',
      danger: 'text-danger',
    }[this.tone()];
  }
}
