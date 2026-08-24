import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-profile-card',
  imports: [RouterLink],
  templateUrl: './profile-card.html',
})
export class ProfileCard {
  readonly profile = input.required<Profile>();

  protected readonly imageUrl = computed(() => {
    const images = this.profile().images ?? [];
    return images.find((image) => image.isMain)?.url ?? images[0]?.url;
  });
}
