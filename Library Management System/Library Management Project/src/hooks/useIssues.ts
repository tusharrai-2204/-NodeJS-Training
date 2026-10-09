import { createIssue, getIssues, returnBook } from "@/lib/api/issues";
import type { IssueQueryParams } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useIssuesQuery = (params: IssueQueryParams) =>
  useQuery({
    queryKey: ["issues", params],
    queryFn: () => getIssues(params),
  });


export const useCreateIssue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { book_id: number, student_id: number }) => createIssue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast.success("Book issued successfully!");
    },
    onError: (error: unknown) => {
        const message = axios.isAxiosError(error) ? error.response?.data?.message ?? "Failed to issue book" : "Failed to issue book";
      toast.error(message);
    }
  });
};

export const useReturnBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast.success("Book returned successfully!");
    },
    onError: () => {
      toast.error("Failed to return book.")
    }
  });
};