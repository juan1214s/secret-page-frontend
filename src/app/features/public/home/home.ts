import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ProfilesApiService } from '../../../core/services/profiles-api.service';
import { Profile } from '../../../core/models/profile.model';
import { ProfileCard } from '../components/profile-card/profile-card';

import headerContent from '../../../content/header.content.json';
import testimonialsContent from '../../../content/testimonials.content.json';
import aboutContent from '../../../content/about.content.json';
import commitmentContent from '../../../content/commitment.content.json';
import servicesContent from '../../../content/services.content.json';
import profilesContent from '../../../content/profiles.content.json';
import faqContent from '../../../content/faq.content.json';
import contactContent from '../../../content/contact.content.json';

import {
  AboutContent,
  CommitmentContent,
  ContactContent,
  FaqContent,
  HeaderContent,
  ProfilesContent,
  ServicesContent,
  TestimonialsContent,
} from '../../../core/models/content.model';

const PAGE_SIZE = 6;

@Component({
  selector: 'app-home',
  imports: [ProfileCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly profilesApi = inject(ProfilesApiService);

  protected readonly header: HeaderContent = headerContent;
  protected readonly testimonials: TestimonialsContent = testimonialsContent;
  protected readonly about: AboutContent = aboutContent;
  protected readonly commitment: CommitmentContent = commitmentContent;
  protected readonly services: ServicesContent = servicesContent;
  protected readonly profilesContent: ProfilesContent = profilesContent;
  protected readonly faq: FaqContent = faqContent;
  protected readonly contact: ContactContent = contactContent;

  protected readonly openFaqIndex = signal<number | null>(null);

  protected readonly profiles = signal<Profile[]>([]);
  protected readonly visibleCount = signal(PAGE_SIZE);
  protected readonly loading = signal(true);
  protected readonly loadError = signal(false);

  protected readonly visibleProfiles = computed(() => this.profiles().slice(0, this.visibleCount()));
  protected readonly hasMore = computed(() => this.visibleCount() < this.profiles().length);

  protected readonly whatsappHref = computed(
    () => `https://wa.me/${this.contact.whatsappNumber}?text=${encodeURIComponent(this.contact.whatsappMessage)}`,
  );

  ngOnInit(): void {
    this.profilesApi.getAll().subscribe({
      next: (profiles) => {
        this.profiles.set(
          profiles
            .filter((profile) => profile.active)
            .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.priorityScore - a.priorityScore),
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  protected showMore(): void {
    this.visibleCount.update((count) => count + PAGE_SIZE);
  }

  protected toggleFaq(index: number): void {
    this.openFaqIndex.update((current) => (current === index ? null : index));
  }

  protected stars(rating: number): number[] {
    return Array.from({ length: rating });
  }

  protected emptyStars(rating: number): number[] {
    return Array.from({ length: Math.max(0, 5 - rating) });
  }
}
