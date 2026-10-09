import { useEffect, useState } from "react";
import { editBookSchema, type Book, type EditBook } from "../../lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { useUpdateBook } from "@/hooks/useBooks";
import { toast } from "sonner";
import { uploadFile } from "@/lib/api/files";

const EditBookDialog = ({ book }: { book: Book }) => {
  const [open, setOpen] = useState(false);
  const [fileId, setFileId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<EditBook>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        title: book.title,
        author: book.author,
        isbn: book.isbn,
      });
      setFileId(null);
      setPreviewUrl(book.file_url ?? null);
    }
  }, [open, book, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size cannot be more than 2 MB");
      e.target.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadFile(file);
      setFileId(result.id);
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Failed to upload image");
      setPreviewUrl(book.file_url ?? null);
    } finally {
      setUploading(false);
    }
  };

  const updateBookMutation = useUpdateBook();

  const onSubmit = (data: EditBook) => {
    updateBookMutation.mutate(
      { ...data, id: book.id, file_id: fileId ?? undefined },
      {
        onSuccess: () => setOpen(false),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button">Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-1">
              <p className="text-sm font-medium">Book ID</p>
              <p className="text-sm text-muted-foreground">{book.id}</p>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title: </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Author: </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN: </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File upload field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Book Cover{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>

              {/* Show current or new preview */}
              {previewUrl && (
                <div className="mb-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    {fileId ? "New image:" : "Current image:"}
                  </p>
                  <img
                    src={previewUrl}
                    alt="Book cover"
                    className="w-20 h-28 object-cover rounded border border-border"
                  />
                </div>
              )}

              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                {previewUrl
                  ? "Select a new image to replace the current one"
                  : "JPEG or PNG, max 2MB"}
              </p>
              {uploading && (
                <p className="text-xs text-muted-foreground">Uploading...</p>
              )}
            </div>

            <Button
              type="submit"
              variant="outline"
              className="mt-2"
              disabled={
                !form.formState.isValid ||
                updateBookMutation.isPending ||
                uploading
              }
            >
              {updateBookMutation.isPending ? "Updating..." : "Update Book"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookDialog;
