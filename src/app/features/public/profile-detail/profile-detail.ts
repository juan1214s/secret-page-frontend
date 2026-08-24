import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProfilesApiService } from '../../../core/services/profiles-api.service';
import { CommentsApiService } from '../../../core/services/comments-api.service';
import { ProfileClicksApiService } from '../../../core/services/profile-clicks-api.service';
import { Profile } from '../../../core/models/profile.model';
import { ProfileComment } from '../../../core/models/comment.model';
import { ImageGallery } from '../components/image-gallery/image-gallery';

@Component({
  selector: 'app-profile-detail',
  imports: [CommonModule, RouterLink, FormsModule, ImageGallery],
  templateUrl: './profile-detail.html',
})
export class ProfileDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly profilesApi = inject(ProfilesApiService);
  private readonly commentsApi = inject(CommentsApiService);
  private readonly profileClicksApi = inject(ProfileClicksApiService);

  protected readonly profile = signal<Profile | null>(null);
  protected readonly comments = signal<ProfileComment[]>([]);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);

  protected readonly authorName = signal('');
  protected readonly commentText = signal('');
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);

  protected readonly whatsappHref = computed(() => {
    const profile = this.profile();
    if (!profile) {
      return '#';
    }
    const message = `Hola, vi tu perfil "${profile.name}" en el sitio y quiero contactarte.`;
    return `https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(message)}`;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        return;
      }
      this.loadProfile(id);
      this.loadComments(id);
    });
  }

  protected submitComment(): void {
    const profile = this.profile();
    const author = this.authorName().trim();
    const content = this.commentText().trim();
    if (!profile || !author || !content) {
      return;
    }

    this.submitting.set(true);
    this.commentsApi.create({ authorName: author, content, profileId: profile.id }).subscribe({
      next: () => {
        this.authorName.set('');
        this.commentText.set('');
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: () => this.submitting.set(false),
    });
  }

  private loadProfile(id: string): void {
    this.loading.set(true);
    this.notFound.set(false);
    this.profilesApi.getOne(id).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
        // Fire-and-forget: un fallo al registrar el click no debe afectar la vista.
        this.profileClicksApi.register(id).subscribe({ error: () => {} });
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      },
    });
  }

  private loadComments(id: string): void {
    this.commentsApi.getByProfile(id).subscribe({
      next: (comments) => this.comments.set(comments.filter((comment) => comment.approved)),
      error: () => this.comments.set([]),
    });
  }
}
