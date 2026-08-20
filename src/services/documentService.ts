import { api } from '../api/api';
import type {DocumentEntity} from '../types';

export const documentService = {
  upload: async (employeeId: number, documentType: string, file: File): Promise<DocumentEntity> => {
    const formData = new FormData();
    formData.append('employeeId', employeeId.toString());
    formData.append('documentType', documentType);
    formData.append('file', file);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getByEmployee: async (employeeId: number): Promise<DocumentEntity[]> => {
    const response = await api.get(`/documents/employee/${employeeId}`);
    return response.data;
  },
  download: async (id: string, fileName: string): Promise<void> => {
    const response = await api.get(`/documents/download/${id}`, {
      responseType: 'blob',
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },
};
