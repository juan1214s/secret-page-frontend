import { Component, computed, effect, input, signal } from '@angular/core';
import { ProfileImage } from '../../../../core/models/image.model';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.html',
})
export class ImageGallery {
  readonly images = input.required<ProfileImage[]>();

  protected readonly activeIndex = signal(0);

  protected readonly sortedImages = computed(() => [...this.images()].sort((a, b) => a.order - b.order));

  protected readonly activeImage = computed(() => this.sortedImages()[this.activeIndex()]);

  constructor() {
    effect(() => {
      this.images();
      this.activeIndex.set(0);
    });
  }

  protected select(index: number): void {
    this.activeIndex.set(index);
  }

  protected prev(): void {
    const count = this.sortedImages().length;
    this.activeIndex.update((current) => (current - 1 + count) % count);
  }

  protected next(): void {
    const count = this.sortedImages().length;
    this.activeIndex.update((current) => (current + 1) % count);
  }
}
