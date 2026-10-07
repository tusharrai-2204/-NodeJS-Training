import { apiInstance } from "../api";
import type { Student, StudentsQueryParams } from "../types";

export const getStudents = async ({ page, pageSize, search, sort, order }: StudentsQueryParams) => {
  const params = new URLSearchParams();
  
  params.set("_page", String(page));
  params.set("_limit", String(pageSize));
  
  if (search) params.set("q", search);
  
  if (sort) {
    params.set("_sort", sort);
    params.set("_order", order ?? "asc");
  }
  
  const response = await apiInstance.get(`/students?${params.toString()}`);
  
  return {
    data: response.data as Student[],
    total: Number(response.headers["x-total-count"] ?? 0),
  };
};

export const getStudentById = async (id: number) => (await apiInstance.get(`/students/${id}`)).data;
