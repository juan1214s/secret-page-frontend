import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileImage, UpdateImageDto } from '../models/image.model';

const BASE_URL = `${environment.apiUrl}/images`;

@Injectable({ providedIn: 'root' })
export class ImagesApiService {
  constructor(private readonly http: HttpClient) {}

  getByProfile(profileId: string): Observable<ProfileImage[]> {
    return this.http.get<ProfileImage[]>(`${BASE_URL}/profile/${profileId}`);
  }

  getOne(id: string): Observable<ProfileImage> {
    return this.http.get<ProfileImage>(`${BASE_URL}/${id}`);
  }

  upload(file: File, profileId: string): Observable<ProfileImage> {
    const form = new FormData();
    form.append('file', file);
    form.append('profileId', profileId);
    return this.http.post<ProfileImage>(`${BASE_URL}/upload`, form);
  }

  update(id: string, dto: UpdateImageDto): Observable<ProfileImage> {
    return this.http.patch<ProfileImage>(`${BASE_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
