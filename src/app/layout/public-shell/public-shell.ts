import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import footerContent from '../../content/footer.content.json';
import { FooterContent } from '../../core/models/content.model';

@Component({
  selector: 'app-public-shell',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './public-shell.html',
})
export class PublicShell {
  protected readonly footer: FooterContent = footerContent;
}
