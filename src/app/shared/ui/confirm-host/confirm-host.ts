import { Component, inject } from '@angular/core';
import { ConfirmService } from '../../../core/services/confirm.service';

@Component({
  selector: 'app-confirm-host',
  templateUrl: './confirm-host.html',
})
export class ConfirmHost {
  protected readonly confirm = inject(ConfirmService);
}
