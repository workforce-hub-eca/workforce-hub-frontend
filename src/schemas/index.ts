import { z } from 'zod';

export const departmentSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(255, 'Description must be less than 255 characters'),
});

export const employeeSchema = z.object({
    id: z.number().optional(),

    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),

    email: z.string().email("Invalid email address"),

    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be at most 15 digits"),

    departmentId: z.number({
        error: (issue) => issue.input === undefined
            ? "Department is required"
            : "Department must be a number",
    }).min(1, "Department is required"),
});

export const documentUploadSchema = z.object({
  employeeId: z.number().min(1, 'Employee is required'),
  documentType: z.string().min(1, 'Document Type is required'),
  file: z.any()
    .refine((files) => files instanceof FileList && files.length > 0, 'File is required')
    .refine(
      (files) => files instanceof FileList && files[0]?.size <= 10 * 1024 * 1024,
      'Max file size is 10MB.'
    ),
});
