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


const EditBookDialog = ({ book }: { book: Book }) => {
  const form = useForm<EditBook>({
    resolver: zodResolver(editBookSchema),
    defaultValues: {
      title: book.title,
      author: book.author,
      isbn: book.isbn
    },
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      form.reset({
        title: book.title,
        author: book.author,
        isbn: book.isbn
      });
    }
  }, [open, book, form]);

  const updateBookMutation = useUpdateBook();

  const onSubmit = (data: EditBook) => {
    updateBookMutation.mutate({ ...data, id: book.id}, {
      onSuccess: () => setOpen(false),
    });
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

            <Button
              type="submit"
              variant="outline"
              className="mt-2"
              disabled={!form.formState.isValid || updateBookMutation.isPending}
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
