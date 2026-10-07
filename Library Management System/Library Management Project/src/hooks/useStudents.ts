import { getStudents } from "@/lib/api/students";
import type { StudentsQueryParams } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export const useStudentsQuery = (params: StudentsQueryParams) =>
  useQuery({
    queryKey: ["students", params],
    queryFn: () => getStudents(params),
  });
