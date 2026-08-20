import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Upload, FileText, Download, Trash2, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { employeeService } from '../services/employeeService';
import { documentService } from '../services/documentService';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import axios from 'axios';

export function EmployeeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const employeeId = parseInt(id || '0');
  const queryClient = useQueryClient();
  
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('Resume');

  const { data: employee, isLoading: loadingEmp } = useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => employeeService.getById(employeeId),
    enabled: !!employeeId,
  });

  const { data: documents, isLoading: loadingDocs } = useQuery({
    queryKey: ['documents', employeeId],
    queryFn: () => documentService.getByEmployee(employeeId),
    enabled: !!employeeId,
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error("File is required");
      return documentService.upload(employeeId, documentType, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', employeeId] });
      toast.success('Document uploaded successfully');
      setFile(null);
      // Reset file input element
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 413) {
        toast.error('File size exceeds the 10MB limit');
      } else {
        toast.error('Failed to upload document');
      }
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: documentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', employeeId] });
      toast.success('Document deleted');
    },
    onError: () => toast.error('Failed to delete document'),
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    uploadMutation.mutate();
  };

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      toast.info(`Downloading ${fileName}...`);
      await documentService.download(docId, fileName);
    } catch (err) {
      toast.error('Failed to download document');
    }
  };

  if (loadingEmp) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (!employee) return <div className="text-center py-20 text-red-500">Employee not found</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/employees" className="p-2 bg-white border border-slate-200 rounded-md text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{employee.name}'s Profile</h1>
          <p className="text-slate-500 mt-1">Manage employee documents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Section */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
                <Input
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  placeholder="e.g. Resume, Contract"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <Button type="submit" className="w-full" isLoading={uploadMutation.isPending}>
                <Upload className="w-4 h-4 mr-2" /> Upload
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingDocs ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
            ) : documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex items-start gap-3 overflow-hidden">
                      <div className="p-2 bg-white rounded-md shadow-sm border border-slate-100">
                        <FileText className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm text-slate-900 truncate" title={doc.fileName}>{doc.fileName}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="bg-primary-50 text-primary-700 px-1.5 py-0.5 rounded-sm font-medium">
                            {doc.documentType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                      <button 
                        onClick={() => handleDownload(doc.id, doc.fileName)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-white rounded-md transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (window.confirm('Delete this document?')) deleteDocMutation.mutate(doc.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                No documents uploaded yet.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
