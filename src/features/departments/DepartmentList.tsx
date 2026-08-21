import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import type {DepartmentDTO} from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/Card';

interface Props {
  departments: DepartmentDTO[];
  onEdit: (dept: DepartmentDTO) => void;
  onDelete: (id: number) => void;
}

const container: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function DepartmentList({ departments, onEdit, onDelete }: Props) {
  if (departments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No departments found. Create one to get started.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {departments.map((dept) => (
        <motion.div key={dept.id} variants={item} layout>
          <Card className="h-full flex flex-col group hover:border-primary-200 hover:shadow-md transition-all">
            <CardHeader className="flex-1">
              <CardTitle className="text-lg text-slate-900 group-hover:text-primary-600 transition-colors">
                {dept.name}
              </CardTitle>
              <CardDescription className="mt-2 line-clamp-2">
                {dept.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-end gap-2 border-t border-slate-50 pt-4 bg-slate-50/50">
              <button
                onClick={() => onEdit(dept)}
                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => dept.id && onDelete(dept.id)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
