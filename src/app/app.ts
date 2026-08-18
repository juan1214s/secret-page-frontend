import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmHost } from './shared/ui/confirm-host/confirm-host';
import { ToastHost } from './shared/ui/toast-host/toast-host';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastHost, ConfirmHost],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
