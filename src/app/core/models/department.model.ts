export interface Department {
  id: string;
  name: string;
}

export interface CreateDepartmentDto {
  name: string;
}

export interface UpdateDepartmentDto {
  name?: string;
}
