import { Component } from '@angular/core';
import termsContent from '../../../content/terms.content.json';
import { TermsContent } from '../../../core/models/content.model';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.html',
})
export class Terms {
  protected readonly content: TermsContent = termsContent;
}
