import { api } from '../api/api';
import type {EmployeeDTO} from '../types';

export const employeeService = {
  getAll: async (): Promise<EmployeeDTO[]> => {
    const response = await api.get('/employees');
    return response.data;
  },
  getById: async (id: number): Promise<EmployeeDTO> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },
  getByDepartment: async (departmentId: number): Promise<EmployeeDTO[]> => {
    const response = await api.get(`/employees/department/${departmentId}`);
    return response.data;
  },
  create: async (employee: EmployeeDTO): Promise<EmployeeDTO> => {
    const response = await api.post('/employees', employee);
    return response.data;
  },
  update: async (id: number, employee: EmployeeDTO): Promise<EmployeeDTO> => {
    const response = await api.put(`/employees/${id}`, employee);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
