import { api } from '../api/api';
import type {DepartmentDTO} from '../types';

export const departmentService = {
  getAll: async (): Promise<DepartmentDTO[]> => {
    const response = await api.get('/departments');
      console.log(response.data)
    return response.data;
  },
  getById: async (id: number): Promise<DepartmentDTO> => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },
  create: async (department: DepartmentDTO): Promise<DepartmentDTO> => {
    const response = await api.post('/departments', department);
    return response.data;
  },
  update: async (id: number, department: DepartmentDTO): Promise<DepartmentDTO> => {
    const response = await api.put(`/departments/${id}`, department);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/departments/${id}`);
  },
};
