import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from './ui/dialog';
import { addBookSchema, type AddBook } from '@/lib/types';
import { useAddBook } from '@/hooks/useBooks';

const AddBookForm = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<AddBook>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      title: "",
      author: "",
    }
  });

  const addBookMutation = useAddBook();

  const onSubmit = (book: AddBook) => {
    addBookMutation.mutate(book, {
        onSuccess: () => {
          setOpen(false);
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

            <div className="flex gap-2 pt-2">
              <Button type='submit' variant="outline" disabled={addBookMutation.isPending}>
                {addBookMutation.isPending ? "Adding..." : "Add Book"}
              </Button>
              <Button type='button' variant="outline" onClick={() => form.reset()}>
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
