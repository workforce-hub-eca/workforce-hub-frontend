import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { departmentService } from '../services/departmentService';
import type {DepartmentDTO} from '../types';
import { DepartmentList } from '../features/departments/DepartmentList';
import { DepartmentFormModal } from '../features/departments/DepartmentFormModal';
import { Button } from '../components/ui/Button';
import {useState} from "react";

export function DepartmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentDTO | null>(null);

  const { data: departments, isLoading, isError } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: departmentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department created successfully');
      handleCloseModal();
    },
    onError: () => {
      toast.error('Failed to create department');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: DepartmentDTO }) => 
      departmentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department updated successfully');
      handleCloseModal();
    },
    onError: () => {
      toast.error('Failed to update department');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: departmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
      toast.success('Department deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete department');
    },
  });

  const handleOpenModal = (dept?: DepartmentDTO) => {
    setEditingDept(dept || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingDept(null), 200); // Wait for exit animation
  };

  const handleSubmit = (data: DepartmentDTO) => {
    if (editingDept?.id) {
      updateMutation.mutate({ id: editingDept.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Departments</h1>
          <p className="text-slate-500 mt-1">Manage your organization's departments</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto shadow-primary-500/20">
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load departments. Please make sure the backend is running.
        </div>
      ) : (
        <DepartmentList 
          departments={departments || []} 
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      )}

      <DepartmentFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingDept}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
