import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import ageGateContent from '../../content/agegate.content.json';
import footerContent from '../../content/footer.content.json';
import topbarContent from '../../content/topbar.content.json';
import { AgeGateContent, FooterContent, TopBarContent } from '../../core/models/content.model';

const AGE_VERIFIED_KEY = 'age-verified';

@Component({
  selector: 'app-public-shell',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './public-shell.html',
})
export class PublicShell {
  protected readonly footer: FooterContent = footerContent;
  protected readonly topbar: TopBarContent = topbarContent;
  protected readonly ageGate: AgeGateContent = ageGateContent;

  protected readonly ageVerified = signal(this.readStoredVerification());

  protected confirmAge(): void {
    try {
      localStorage.setItem(AGE_VERIFIED_KEY, 'true');
    } catch {
      /* storage unavailable, ignore */
    }
    this.ageVerified.set(true);
  }

  protected rejectAge(): void {
    window.location.href = 'https://www.google.com';
  }

  private readStoredVerification(): boolean {
    try {
      return localStorage.getItem(AGE_VERIFIED_KEY) === 'true';
    } catch {
      return false;
    }
  }
}
