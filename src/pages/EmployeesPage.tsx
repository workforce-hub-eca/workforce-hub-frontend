import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import type {EmployeeDTO} from '../types';
import { EmployeeList } from '../features/employees/EmployeeList';
import { EmployeeFormModal } from '../features/employees/EmployeeFormModal';
import { Button } from '../components/ui/Button';
import axios from 'axios';

export function EmployeesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<EmployeeDTO | null>(null);

  const { data: employees, isLoading: loadingEmployees, isError: errorEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const { data: departments, isLoading: loadingDepartments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee created successfully');
      handleCloseModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(error.response.data.message || 'Email already exists');
      } else {
        toast.error('Failed to create employee');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EmployeeDTO }) => 
      employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee updated successfully');
      handleCloseModal();
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error(error.response.data.message || 'Email already exists');
      } else {
        toast.error('Failed to update employee');
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: employeeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Employee deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete employee');
    },
  });

  const handleOpenModal = (emp?: EmployeeDTO) => {
    setEditingEmp(emp || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingEmp(null), 200);
  };

  const handleSubmit = (data: EmployeeDTO) => {
    if (editingEmp?.id) {
      updateMutation.mutate({ id: editingEmp.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-slate-500 mt-1">Manage your workforce directory</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-primary-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {loadingEmployees || loadingDepartments ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : errorEmployees ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load employees.
        </div>
      ) : (
        <EmployeeList 
          employees={employees || []} 
          departments={departments || []}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingEmp}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
