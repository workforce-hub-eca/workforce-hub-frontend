export interface DepartmentDTO {
  id?: number;
  name: string;
  description: string;
}

export interface EmployeeDTO {
  id?: number;
  name: string;
  email: string;
  phone: string;
  departmentId: number;
}

export interface DocumentEntity {
  id: string;
  employeeId: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface ErrorResponseDTO {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}
