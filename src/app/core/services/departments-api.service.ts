import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateDepartmentDto, Department, UpdateDepartmentDto } from '../models/department.model';

const BASE_URL = `${environment.apiUrl}/departments`;

@Injectable({ providedIn: 'root' })
export class DepartmentsApiService {
  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(BASE_URL);
  }

  getOne(id: string): Observable<Department> {
    return this.http.get<Department>(`${BASE_URL}/${id}`);
  }

  create(dto: CreateDepartmentDto): Observable<Department> {
    return this.http.post<Department>(BASE_URL, dto);
  }

  update(id: string, dto: UpdateDepartmentDto): Observable<Department> {
    return this.http.patch<Department>(`${BASE_URL}/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${BASE_URL}/${id}`);
  }
}
