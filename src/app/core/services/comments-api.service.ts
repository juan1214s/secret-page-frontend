import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProfileComment, UpdateCommentDto } from '../models/comment.model';

const BASE_URL = `${environment.apiUrl}/comments`;

export interface CreateCommentDto {
  authorName: string;
  content: string;
  profileId: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ProfileComment[]> {
    return this.http.get<ProfileComment[]>(BASE_URL);
  }

  getPending(): Observable<ProfileComment[]> {
    return this.http.get<ProfileComment[]>(`${BASE_URL}/pending`);
  }

  getByProfile(profileId: string): Observable<ProfileComment[]> {
    return this.http.get<ProfileComment[]>(`${BASE_URL}/profile/${profileId}`);
  }

  getOne(id: string): Observable<ProfileComment> {
    return this.http.get<ProfileComment>(`${BASE_URL}/${id}`);
  }

  create(dto: CreateCommentDto): Observable<ProfileComment> {
    return this.http.post<ProfileComment>(BASE_URL, dto);
  }

  moderate(id: string, dto: UpdateCommentDto): Observable<ProfileComment> {
    return this.http.patch<ProfileComment>(`${BASE_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
