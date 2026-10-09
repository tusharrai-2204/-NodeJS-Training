import { addStudent, deleteStudent, getStudents, updateStudent } from "@/lib/api/students";
import type { AddStudent, EditStudent, StudentsQueryParams } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStudentsQuery = (params: StudentsQueryParams) =>
  useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });


export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AddStudent) => addStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added successfully!");
    },
    onError: () => {
      toast.error("Failed to add student.")
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number, data: EditStudent }) => updateStudent({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update student.")
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
    onError: () => {
      toast.error("Failed to delete student.")
    }
  });
};