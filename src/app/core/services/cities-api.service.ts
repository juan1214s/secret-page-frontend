import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { City, CreateCityDto, UpdateCityDto } from '../models/city.model';

const BASE_URL = `${environment.apiUrl}/cities`;

@Injectable({ providedIn: 'root' })
export class CitiesApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<City[]> {
    return this.http.get<City[]>(BASE_URL);
  }

  getOne(id: string): Observable<City> {
    return this.http.get<City>(`${BASE_URL}/${id}`);
  }

  create(dto: CreateCityDto): Observable<City> {
    return this.http.post<City>(BASE_URL, dto);
  }

  update(id: string, dto: UpdateCityDto): Observable<City> {
    return this.http.patch<City>(`${BASE_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
