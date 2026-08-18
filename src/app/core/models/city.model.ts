import { Department } from './department.model';

export interface City {
  id: string;
  name: string;
  departmentId: string;
  department?: Department;
}

export interface CreateCityDto {
  name: string;
  departmentId: string;
}

export interface UpdateCityDto {
  name?: string;
  departmentId?: string;
}
