import { apiInstance } from "../api";
import type { AddStudent, EditStudent, Student, StudentDropDownItem, StudentsQueryParams } from "../types";

export const getStudents = async ({ page, pageSize, search, sortBy, order }: StudentsQueryParams) => {
  const params = new URLSearchParams();
  
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  
  if (search) params.set("search", search);
  if (sortBy) {
    params.set("sortBy", sortBy);
    params.set("order", order ?? "desc");
  }
  
  const response = await apiInstance.get(`/api/students?${params.toString()}`);
  
  return {
    data: response.data.data as Student[],
    total: response.data.meta.total as number,
  };
};

export const getAllStudents = async (): Promise<StudentDropDownItem[]> => {
  const response = await apiInstance.get(`/api/students/all`);
  return response.data.data as StudentDropDownItem[];
};

export const getStudentById = async (id: number): Promise<Student> => {
  const response = await apiInstance.get(`/api/students/${id}`);
  return response.data.data as Student;
};

export const addStudent = async (data: AddStudent): Promise<Student> => {
  const response = await apiInstance.post(`/api/students`, data);
  return response.data.data as Student;
};

export const updateStudent = async ({ id, data }: { id: number, data: EditStudent }): Promise<Student> => {
  const response = await apiInstance.patch(`/api/students/${id}`, data);
  return response.data.data as Student;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await apiInstance.delete(`/api/students/${id}`);
};