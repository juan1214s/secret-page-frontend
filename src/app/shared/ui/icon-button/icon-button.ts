import { Component, input, output } from '@angular/core';

export type IconButtonTone = 'ok' | 'danger' | 'neutral';

@Component({
  selector: 'app-icon-button',
  template: `
    <button
      type="button"
      class="w-[30px] h-[30px] rounded-[7px] border border-line bg-surface flex items-center justify-center transition-colors"
      [class]="hoverClass()"
      [attr.aria-label]="label()"
      [disabled]="disabled()"
      (click)="pressed.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class IconButton {
  readonly label = input.required<string>();
  readonly tone = input<IconButtonTone>('neutral');
  readonly disabled = input(false);
  readonly pressed = output<void>();

  protected hoverClass(): string {
    return {
      ok: 'hover:bg-ok-tint hover:border-ok hover:text-ok',
      danger: 'hover:bg-danger-tint hover:border-danger hover:text-danger',
      neutral: 'hover:bg-surface-sunken text-ink-muted',
    }[this.tone()];
  }
}
