import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateProfileDto, Profile, UpdateProfileDto } from '../models/profile.model';

const BASE_URL = `${environment.apiUrl}/profiles`;

@Injectable({ providedIn: 'root' })
export class ProfilesApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Profile[]> {
    return this.http.get<Profile[]>(BASE_URL);
  }

  getOne(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${BASE_URL}/${id}`);
  }

  create(dto: CreateProfileDto): Observable<Profile> {
    return this.http.post<Profile>(BASE_URL, dto);
  }

  update(id: string, dto: UpdateProfileDto): Observable<Profile> {
    return this.http.patch<Profile>(`${BASE_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
