import { City } from './city.model';
import { ProfileImage } from './image.model';

export interface Profile {
  id: string;
  name: string;
  description?: string;
  whatsappNumber: string;
  cityId: string;
  city?: City;
  images?: ProfileImage[];
  active: boolean;
  isFeatured: boolean;
  priorityScore: number;
  createdAt: string;
}

export interface CreateProfileDto {
  name: string;
  description?: string;
  whatsappNumber: string;
  cityId: string;
}

export interface UpdateProfileDto {
  name?: string;
  description?: string;
  whatsappNumber?: string;
  cityId?: string;
  active?: boolean;
  isFeatured?: boolean;
  priorityScore?: number;
}
