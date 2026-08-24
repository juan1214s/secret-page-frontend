import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileClickCount } from '../models/profile-click.model';

const BASE_URL = `${environment.apiUrl}/profile-clicks`;

@Injectable({ providedIn: 'root' })
export class ProfileClicksApiService {
  constructor(private readonly http: HttpClient) {}

  register(profileId: string): Observable<unknown> {
    return this.http.post(BASE_URL, { profileId });
  }

  getCounts(): Observable<ProfileClickCount[]> {
    return this.http.get<ProfileClickCount[]>(`${BASE_URL}/counts`);
  }

  getCount(profileId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${BASE_URL}/profile/${profileId}/count`);
  }
}
