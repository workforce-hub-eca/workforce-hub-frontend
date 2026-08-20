import {motion, type Variants} from 'framer-motion';
import { Edit2, Trash2, Mail, Phone, Building, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import type {EmployeeDTO, DepartmentDTO} from '../../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../components/ui/Card';

interface Props {
  employees: EmployeeDTO[];
  departments: DepartmentDTO[];
  onEdit: (emp: EmployeeDTO) => void;
  onDelete: (id: number) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function EmployeeList({ employees, departments, onEdit, onDelete }: Props) {
  if (employees.length === 0) {
    return <div className="text-center py-12"><p className="text-slate-500">No employees found.</p></div>;
  }

  const getDepartmentName = (id: number) => {
    return departments.find(d => d.id === id)?.name || 'Unknown Department';
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {employees.map((emp) => (
        <motion.div key={emp.id} variants={item} layout>
          <Card className="h-full flex flex-col group hover:border-primary-200 hover:shadow-md transition-all overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-400 to-primary-600 w-full opacity-70 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-slate-900 group-hover:text-primary-600 transition-colors">
                {emp.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-3">
              <div className="flex items-center text-sm text-slate-600">
                <Mail className="w-4 h-4 mr-2 text-slate-400" />
                <a href={`mailto:${emp.email}`} className="hover:text-primary-600 truncate">{emp.email}</a>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="w-4 h-4 mr-2 text-slate-400" />
                <span>{emp.phone}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <Building className="w-4 h-4 mr-2 text-slate-400" />
                <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-medium text-slate-700">
                  {getDepartmentName(emp.departmentId)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-slate-50 pt-4 bg-slate-50/50">
              <Link to={`/employees/${emp.id}`} className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Documents
              </Link>
              <div className="flex gap-1">
                <button onClick={() => onEdit(emp)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => emp.id && onDelete(emp.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
