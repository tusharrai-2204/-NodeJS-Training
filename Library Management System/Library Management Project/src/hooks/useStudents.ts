import { addStudent, deleteStudent, exportStudents, getStudents, updateStudent } from "@/lib/api/students";
import type { AddStudent, EditStudent, StudentsQueryParams } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useStudentsQuery = (params: StudentsQueryParams) =>
  useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });


export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, imageFile }: { data: AddStudent; imageFile?: File | null }) => addStudent(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully!");
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Failed to add student";
      toast.error(message)
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, imageFile }: { id: number, data: EditStudent, imageFile: File | null }) => updateStudent({ id, data, imageFile }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully!");
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Failed to update student";
      toast.error(message);
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteStudent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully!");
    },
    onError: (err: unknown) => {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Failed to delete student";
      toast.error(message);
    }
  });
};

export const useExportStudents = () => {
  return useMutation({
    mutationFn: (format: 'csv' | 'excel' | 'pdf') => exportStudents(format),
    onSuccess: (blob, format) => {
      // Trigger browser download
      const extensions = { csv: 'csv', excel: 'xlsx', pdf: 'pdf' };
      const filename = `students_export_${new Date().toISOString().split('T')[0]}.${extensions[format]}`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast.success('Export downloaded! A copy has been sent to your email');
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to export students. Please try later.";
      toast.error(message);
    },
  });
}