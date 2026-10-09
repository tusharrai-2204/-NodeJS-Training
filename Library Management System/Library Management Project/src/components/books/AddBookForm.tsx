import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '../ui/dialog';
import { addBookSchema, type AddBook } from '@/lib/types';
import { useAddBook } from '@/hooks/useBooks';
import { toast } from 'sonner';
import { uploadFile } from '@/lib/api/files';

const AddBookForm = () => {
  const [open, setOpen] = useState(false);
  const [fileId, setFileId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2*1024*1024) {
      toast.error('File size cannot be more than 2 MB');
      e.target.value = "";
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const result = await uploadFile(file);
      setFileId(result.id);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error("Failed to upload image");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const form = useForm<AddBook>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
    }
  });

  const addBookMutation = useAddBook();

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFileId(null);
      setPreviewUrl(null);
    }
  };

  const onSubmit = (book: AddBook) => {
    addBookMutation.mutate({ ...book, file_id: fileId ?? undefined }, {
        onSuccess: () => {
          handleOpenChange(false);
          form.reset();
        }
      })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
          + Add Book
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter book title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='author'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Book Author</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter author name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name='isbn'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 9780261102354" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File upload field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Book Cover <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                JPEG or PNG, max 2MB
              </p>
              {uploading && (
                <p className="text-xs text-muted-foreground">Uploading...</p>
              )}
              {previewUrl && !uploading && (
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-28 object-cover rounded border border-border"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button type='submit' variant="outline" disabled={addBookMutation.isPending || uploading}>
                {addBookMutation.isPending ? "Adding..." : "Add Book"}
              </Button>
              <Button type='button' variant="outline" onClick={() => {
                form.reset();
                setFileId(null);
                setPreviewUrl(null);
              }}>
                Reset
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBookForm;
