import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateUserDto, PublicUser, UpdateUserDto } from '../models/user.model';

const BASE_URL = `${environment.apiUrl}/users`;

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<PublicUser[]> {
    return this.http.get<PublicUser[]>(BASE_URL);
  }

  getOne(id: string): Observable<PublicUser> {
    return this.http.get<PublicUser>(`${BASE_URL}/${id}`);
  }

  create(dto: CreateUserDto): Observable<PublicUser> {
    return this.http.post<PublicUser>(BASE_URL, dto);
  }

  update(id: string, dto: UpdateUserDto): Observable<PublicUser> {
    return this.http.patch<PublicUser>(`${BASE_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
