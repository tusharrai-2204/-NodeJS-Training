import { addBook, deleteBook, getBooks, updateBook } from "@/lib/api/books";
import type { BooksQueryParams } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
    onError: (error) => {
      console.error("Error adding book:", error.message);
      toast.error("Failed to add book.");
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
    onError: (error) => {
      console.error("Error updating book:", error.message);
      toast.error("Failed to update book.");
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
    onError: (error) => {
      console.error('Error delete book:', error.message);
      toast.error("Failed to delete book.");
    }
  });
};
