export interface ProfileImage {
  id: string;
  url: string;
  key: string;
  isMain: boolean;
  order: number;
  profileId: string;
}

export interface UpdateImageDto {
  isMain?: boolean;
  order?: number;
}
