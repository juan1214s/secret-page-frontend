import { Profile } from './profile.model';

export interface ProfileComment {
  id: string;
  authorName: string;
  content: string;
  approved: boolean;
  profileId: string;
  profile?: Profile;
  createdAt: string;
}

export interface UpdateCommentDto {
  approved: boolean;
}
