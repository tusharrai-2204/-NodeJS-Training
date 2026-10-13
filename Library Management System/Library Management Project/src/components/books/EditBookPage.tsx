import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { editBookSchema, type EditBook } from "@/lib/types";
import { useUpdateBook } from "@/hooks/useBooks";
import { useQuery } from "@tanstack/react-query";
import { getBookById } from "@/lib/api/books";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api/files";
import axios from "axios";

const EditBookPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fileId, setFileId] = useState<number | null>(null);
  const [newPreviewUrl, setNewPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch book data
  const { data: bookResponse, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(Number(id)),
    enabled: !!id,
  });

  const book = bookResponse?.data;

  const previewUrl = newPreviewUrl ?? book?.file_url ?? null;

  const form = useForm<EditBook>({
    resolver: zodResolver(editBookSchema),
    defaultValues: { title: "", author: "", isbn: "" },
  });

  // Pre-fill form when book data loads
  useEffect(() => {
    if (book) {
      form.reset({ title: book.title, author: book.author, isbn: book.isbn });
    }
  }, [book, form]);

  const updateBookMutation = useUpdateBook();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size cannot be more than 2 MB");
      e.target.value = "";
      return;
    }
    setNewPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    try {
      const result = await uploadFile(file);
      setFileId(result.id);
      toast.success("Image uploaded successfully!");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "Failed to upload image")
        : "Failed to upload image";
      toast.error(message);
      setNewPreviewUrl(book?.file_url ?? null);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: EditBook) => {
    if (!id) return;
    updateBookMutation.mutate(
      { ...data, id: Number(id), file_id: fileId ?? undefined },
      { onSuccess: () => navigate("/books") },
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
        <div className="bg-white border border-[#e2e7eb] rounded-xs p-8 text-center text-[13px] text-[#9aa3ad]">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
      <div className="bg-white border border-[#e2e7eb] rounded-xs overflow-hidden">
        {/* Card header */}
        <div className="px-5 py-3 border-b border-[#e5e9ed]">
          <h2 className="text-[15px] font-semibold text-[#243447]">
            Edit Book
          </h2>
        </div>

        {/* Form */}
        <div className="px-5 py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Book Name */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start gap-0">
                      <label className="w-50 shrink-0 pt-2 text-[13px] text-[#53606c]">
                        Book Name
                      </label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <Input
                            placeholder="Book Name"
                            className="h-8 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] placeholder:text-[#aab3bc] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2196f3]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Author Name */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start gap-0">
                      <label className="w-50 shrink-0 pt-2 text-[13px] text-[#53606c]">
                        Author Name
                      </label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <Input
                            placeholder="Author Name"
                            className="h-8 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] placeholder:text-[#aab3bc] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2196f3]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* ISBN */}
              <FormField
                control={form.control}
                name="isbn"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <div className="flex items-start gap-0">
                      <label className="w-50 shrink-0 pt-2 text-[13px] text-[#53606c]">
                        ISBN
                      </label>
                      <div className="flex-1 max-w-125">
                        <FormControl>
                          <Input
                            placeholder="ISBN"
                            className="h-8 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] placeholder:text-[#aab3bc] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2196f3]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              {/* Book Cover */}
              <div className="mb-4 flex items-start gap-0">
                <label className="w-50 shrink-0 pt-2 text-[13px] text-[#53606c]">
                  Book Cover <span className="text-[#aab3bc]">(optional)</span>
                </label>
                <div className="flex-1 max-w-125 space-y-2">
                  {previewUrl && (
                    <div className="mb-2">
                      <p className="text-[11px] text-[#9aa3ad] mb-1">
                        {newPreviewUrl ? "New image:" : "Current image:"}
                      </p>
                      <img
                        src={previewUrl}
                        alt="Book cover"
                        className="w-16 h-22 object-cover rounded border border-[#e2e7eb]"
                      />
                    </div>
                  )}
                  {/* <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="h-8 rounded-xs border-[#d5dde3] bg-[#eff3f6] text-[12px] cursor-pointer"
                  /> */}
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="h-8 w-full rounded-xs border border-[#d5dde3] bg-[#eff3f6] text-[12px] text-[#344454] cursor-pointer file:mr-3 file:h-full file:border-0 file:border-r file:border-[#d5dde3] file:bg-white file:px-3 file:text-[11px] file:text-[#53606c] file:font-medium file:cursor-pointer"
                  />

                  <p className="text-[11px] text-[#9aa3ad]">
                    {previewUrl
                      ? "Select a new image to replace current"
                      : "JPEG or PNG, max 2MB"}
                  </p>
                  {uploading && (
                    <p className="text-[11px] text-[#9aa3ad]">Uploading...</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-[#e5e9ed]">
                <Button
                  type="submit"
                  disabled={
                    !form.formState.isValid ||
                    updateBookMutation.isPending ||
                    uploading
                  }
                  className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
                  style={{ backgroundColor: "#2196f3", borderColor: "#2196f3" }}
                >
                  {updateBookMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate("/books")}
                  className="h-8 px-5 text-[12px] font-medium rounded-xs cursor-pointer text-white"
                  style={{ backgroundColor: "#f44336", borderColor: "#f44336" }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditBookPage;
