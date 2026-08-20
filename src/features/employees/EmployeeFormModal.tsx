import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { employeeSchema } from '../../schemas';
import type {EmployeeDTO} from '../../types';
import { departmentService } from '../../services/departmentService';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeDTO) => void;
  initialData?: EmployeeDTO | null;
  isLoading: boolean;
}

export function EmployeeFormModal({ isOpen, onClose, onSubmit, initialData, isLoading }: Props) {
  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: departmentService.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeDTO>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || { name: '', email: '', phone: '', departmentId: 0 },
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || { name: '', email: '', phone: '', departmentId: departments?.[0]?.id || 0 });
    }
  }, [isOpen, initialData, reset, departments]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Employee' : 'Create Employee'}
    >
      <form onSubmit={handleSubmit((data) => onSubmit({...data, departmentId: Number(data.departmentId)}))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <Input {...register('name')} error={errors.name?.message} placeholder="John Doe" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
          <Input {...register('email')} type="email" error={errors.email?.message} placeholder="john@workforcehub.com" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <Input {...register('phone')} error={errors.phone?.message} placeholder="+1234567890" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select 
            {...register('departmentId', { valueAsNumber: true })}
            className={`flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.departmentId ? 'border-red-500 focus:ring-red-500' : ''}`}
          >
            <option value={0} disabled>Select a department</option>
            {departments?.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          {errors.departmentId && <p className="mt-1 text-sm text-red-500">{errors.departmentId.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{initialData ? 'Update' : 'Create'}</Button>
        </div>
      </form>
    </Modal>
  );
}
