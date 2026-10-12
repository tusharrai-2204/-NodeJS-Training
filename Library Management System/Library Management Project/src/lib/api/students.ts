import { apiInstance } from "../api";
import type {
  AddStudent,
  EditStudent,
  Student,
  StudentDropDownItem,
  StudentsQueryParams,
} from "../types";

export const getStudents = async ({
  page,
  pageSize,
  search,
  sortBy,
  order,
}: StudentsQueryParams) => {
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

export const addStudent = async (
  data: AddStudent,
  imageFile?: File | null,
): Promise<Student> => {
  const formData = new FormData();
  formData.append("student_name", data.student_name);
  formData.append("roll_no", data.roll_no);
  formData.append("phone", data.phone);
  formData.append("country", data.country);
  formData.append("state", data.state);
  formData.append("city", data.city);

  if (imageFile) formData.append("profile_image", imageFile);

  const response = await apiInstance.post(`/api/students`, formData);
  return response.data.data as Student;
};

export const updateStudent = async ({
  id,
  data,
  imageFile
}: {
  id: number;
  data: EditStudent;
  imageFile?: File | null;
}): Promise<Student> => {
  const formData = new FormData();

  if (data.student_name) formData.append("student_name", data.student_name);
  if (data.roll_no)formData.append("roll_no", data.roll_no);
  if (data.phone) formData.append("phone", data.phone);
  if (data.country) formData.append("country", data.country);
  if (data.state) formData.append("state", data.state);
  if (data.city) formData.append("city", data.city);
  if (imageFile) formData.append("profile_image", imageFile);

  const response = await apiInstance.patch(`/api/students/${id}`, formData);
  return response.data.data as Student;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await apiInstance.delete(`/api/students/${id}`);
};

export const exportStudents = async (format: 'csv' | 'excel' | 'pdf'): Promise<Blob> => {
  const response = await apiInstance.get(`/api/students/export?format=${format}`, {
    responseType: 'blob',
  });
  return response.data as Blob;
}