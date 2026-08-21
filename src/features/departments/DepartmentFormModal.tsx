import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { departmentSchema } from '../../schemas';
import type {DepartmentDTO} from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DepartmentDTO) => void;
  initialData?: DepartmentDTO | null;
  isLoading: boolean;
}

export function DepartmentFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DepartmentDTO>({
    resolver: zodResolver(departmentSchema),
    defaultValues: initialData || { name: '', description: '' },
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '', description: '' });
    }
  }, [isOpen, initialData, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Department' : 'Create Department'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department Name
          </label>
          <Input
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g. Engineering"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <Input
            {...register('description')}
            error={errors.description?.message}
            placeholder="e.g. Software development team"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {initialData ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
