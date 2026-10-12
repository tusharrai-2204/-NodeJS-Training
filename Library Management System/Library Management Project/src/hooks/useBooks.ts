import { addBook, deleteBook, getBooks, updateBook } from "@/lib/api/books";
import type { BooksQueryParams } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useBooksQuery = (params: BooksQueryParams) =>
  useQuery({
    queryKey: ["books", params],
    queryFn: () => getBooks(params),
  });

export const useAddBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book added!");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to add book";
      toast.error(message);
    },
  });
};

export const useUpdateBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book updated successfully!");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to update book";
      toast.error(message);
    },
  });
};

export const useDeleteBook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      toast.success("Book deleted successfully!");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to delete book";
      toast.error(message);
    }
  });
};
