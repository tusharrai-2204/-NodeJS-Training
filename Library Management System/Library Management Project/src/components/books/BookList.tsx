import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import type { Book } from "@/lib/types";
import { useBooksQuery, useDeleteBook } from "@/hooks/useBooks";
import {
  createColumnHelper,
  tableFeatures,
  useTable,
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  flexRender,
} from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
});
const columnHelper = createColumnHelper<typeof features, Book>();

const BookList = () => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? "";
  const sortBy = searchParams.get("sortBy");
  const order = (searchParams.get("order") ?? "asc") as "asc" | "desc";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 400);

  const columns = columnHelper.columns([
    columnHelper.display({
      id: "cover",
      header: "COVER",
      cell: ({ row }) => {
        const url = row.original.file_url;
        const title = row.original.title;

        if (!url) return null;

        const handleDownload = async () => {
          try {
            const response = await fetch(url);
            const blob = await response.blob();

            // Derive extension from mimetype
            const ext = blob.type.split("/")[1] ?? "jpg";

            // Create a temporary anchor and trigger download
            const blobUrl = URL.createObjectURL(blob);
            const anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = `${title}.${ext}`;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);

            // Clean up the blob URL after download triggers
            URL.revokeObjectURL(blobUrl);
          } catch {
            toast.error("Failed to download image");
          }
        };

        return (
          <img
            src={url}
            alt={title}
            title="Click to download"
            onClick={handleDownload}
            className="w-8 h-10 object-cover rounded-xs cursor-pointer hover:opacity-75 transition-opacity"
          />
        );
      },
    }),
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting()}
          variant="ghost"
          className="cursor-pointer h-auto w-full justify-start p-0 text-[10px] font-semibold text-[#243447] hover:bg-transparent hover:text-[#243447]"
        >
          BOOK NAME{" "}
          <span className="ml-auto text-[10px] text-[#aeb7c2]">
            {column.getIsSorted() === "asc"
              ? "↑"
              : column.getIsSorted() === "desc"
                ? "↓"
                : "↕"}
          </span>
        </Button>
      ),
    }),
    columnHelper.accessor("author", {
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting()}
          variant="ghost"
          className="cursor-pointer h-auto w-full justify-start p-0 text-[10px] font-semibold text-[#243447] hover:bg-transparent hover:text-[#243447]"
        >
          AUTHOR NAME{" "}
          <span className="ml-auto text-[10px] text-[#aeb7c2]">
            {column.getIsSorted() === "asc"
              ? "↑"
              : column.getIsSorted() === "desc"
                ? "↓"
                : "↕"}
          </span>
        </Button>
      ),
    }),
    columnHelper.accessor("isbn", {
      header: ({ column }) => (
        <Button
          onClick={() => column.toggleSorting()}
          variant="ghost"
          className="cursor-pointer h-auto w-full justify-start p-0 text-[10px] font-semibold text-[#243447] hover:bg-transparent hover:text-[#243447]"
        >
          ISBN{" "}
          <span className="ml-auto text-[10px] text-[#aeb7c2]">
            {column.getIsSorted() === "asc"
              ? "↑"
              : column.getIsSorted() === "desc"
                ? "↓"
                : "↕"}
          </span>
        </Button>
      ),
    }),
    columnHelper.display({
      id: "Actions",
      header: "ACTIONS",
      cell: ({ row }) => {
        const book = row.original;
        return (
          <div className="flex gap-1.5 items-center">
            {isAdmin && (
              <Button
                type="button"
                onClick={() => navigate(`/books/edit/${book.id}`)}
                className="h-8 rounded-md px-4 text-[12px] text-primary-foreground cursor-pointer"
              >
                Edit
              </Button>
            )}

            {isAdmin && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="destructive"
                    size="default"
                    className="h-8 rounded-md px-4 text-[12px] text-primary-foreground cursor-pointer"
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-[#f1f4f7] text-[#243447]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{book.title}"?
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel className="border border-zinc-800 bg-transparent text-[#243447] hover:bg-zinc-300 hover:text-zinc-800 cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      type="button"
                      variant="destructive"
                      className="rounded-md px-4 text-primary-foreground cursor-pointer"
                      onClick={() => handleDelete(book.id)}
                    >
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {!isAdmin && <span className="text-[10px] text-[#9aa3ad]">-</span>}
          </div>
        );
      },
    }),
  ]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([key, val]) => next.set(key, val));
        return next;
      });
    },
    [setSearchParams],
  );

  const isFirstRender = useRef(true);

  const setSearchParamsRef = useRef(setSearchParams);
  useEffect(() => {
    setSearchParamsRef.current = setSearchParams;
  });

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setSearchParamsRef.current((prev) => {
      const current = prev.get("search") ?? "";
      if (current === debouncedSearch) return prev;
      const next = new URLSearchParams(prev);
      next.set("search", debouncedSearch);
      next.set("page", "1");
      return next;
    });
  }, [debouncedSearch]);

  const {
    data: result,
    isLoading,
    error,
  } = useBooksQuery({ page, pageSize, search, sortBy, order });

  const table = useTable({
    features,
    columns,
    data: result?.data ?? [],
    rowCount: result?.total ?? 0,
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting: sortBy ? [{ id: sortBy, desc: order === "desc" }] : [],
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;
      updateParams({
        page: String(next.pageIndex + 1),
        pageSize: String(next.pageSize),
      });
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(sortBy ? [{ id: sortBy, desc: order === "desc" }] : [])
          : updater;
      if (next.length > 0) {
        updateParams({
          sortBy: next[0].id,
          order: next[0].desc ? "desc" : "asc",
          page: "1",
        });
      } else {
        updateParams({ sortBy: "", order: "asc", page: "1" });
      }
    },
  });

  const [show, setShow] = useState(true);

  const deleteMutation = useDeleteBook();

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  if (error) {
    return (
      <div className="rounded-[3px] border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        Failed to load books. Please check your connection and try again.
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#f1f4f7] p-4 md:p-5">
      {/* Table Card */}
      <div className="overflow-hidden border border-[#e2e7eb] bg-white rounded-xs">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-[#e5e9ed] px-4 py-3">
          <h2 className="text-[14px] font-semibold text-[#243447]">
            Book List
          </h2>

          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              size="default"
              onClick={() => setShow((prev) => !prev)}
              className="bg-secondary hover:bg-secondary/80 text-primary-foreground text-sm cursor-pointer"
            >
              {show ? "Hide table" : "Show table"}
            </Button>
            {isAdmin && (
              <Button
                type="button"
                onClick={() => navigate("/books/add")}
                className="bg-primary hover:bg-primary/80 text-primary-foreground text-sm cursor-pointer"
              >
                + Add Book
              </Button>
            )}
          </div>
        </div>

        {show && (
          <>
            {/* Table Controls */}
            <div className="flex items-center justify-between px-4 py-3">
              {/* Entries */}
              <div className="flex items-center gap-2 text-[11px] text-[#68737e]">
                <span>Show</span>

                <select
                  value={pageSize}
                  onChange={(e) =>
                    updateParams({
                      pageSize: e.target.value,
                      page: "1",
                    })
                  }
                  className="h-8 w-12 rounded-xs border border-[#d9e0e5] bg-white px-1 text-center text-[11px] text-[#53606c] outline-none focus:border-[#aebbc7]"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>

                <span className="text-[11px]">entries</span>
              </div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#68737e]">Search:</span>

                <Input
                  type="text"
                  placeholder=""
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="h-8 w-40 rounded-xs border-[#d5dde3] bg-[#f0f4f7] px-2 text-[11px] text-[#344454] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Table */}
            <div className="px-4 pb-0">
              <div className="overflow-x-auto">
                <Table className="w-full border-collapse">
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow
                        key={headerGroup.id}
                        className="border border-[#dce3e8] bg-[#edf2f5] hover:bg-[#edf2f5]"
                      >
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            key={header.id}
                            className="h-8.5 border-r border-[#dce3e8] px-2 text-[11px] font-semibold uppercase text-[#243447] last:border-r-0"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>

                  <TableBody>
                    {isLoading ? (
                      Array.from({ length: pageSize }).map((_, i) => (
                        <TableRow
                          key={i}
                          className="h-8.5 border-b border-[#e1e7eb]"
                        >
                          {columns.map((_, j) => (
                            <TableCell
                              key={j}
                              className="border-r border-[#edf0f2] px-2 py-1.5 last:border-r-0"
                            >
                              <Skeleton className="h-3 w-full bg-[#edf1f4]" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : table.getRowModel().rows.length === 0 ? (
                      <TableRow className="border-b border-[#e1e7eb]">
                        <TableCell
                          colSpan={columns.length}
                          className="py-10 text-center text-[12px] text-[#8a949e]"
                        >
                          No books found
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getRowModel().rows.map((row, index) => (
                        <TableRow
                          key={row.id}
                          className={`h-8.5 border-b border-[#dfe6ea] transition-colors ${
                            index % 2 === 0 ? "bg-[#f7fafc]" : "bg-white"
                          } hover:bg-[#eef5f9]`}
                        >
                          {row.getAllCells().map((cell) => (
                            <TableCell
                              key={cell.id}
                              className="border-r border-[#e7ecef] px-2 py-1.5 text-[12px] text-[#344454] last:border-r-0"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#e5e9ed] px-4 py-3">
              <div className="text-[12px] text-[#7b858f]">
                Showing{" "}
                <span className="font-medium text-[#465563]">
                  {table.getRowModel().rows.length}
                </span>{" "}
                entries
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => updateParams({ page: String(page - 1) })}
                  disabled={!table.getCanPreviousPage()}
                  className="h-8 rounded-xs border-[#5f656a] bg-white px-2.5 text-[10px] text-[#66737e] shadow-none hover:bg-[#f3f6f8] hover:text-[#66737e] cursor-pointer"
                >
                  Previous
                </Button>

                <div className="flex h-7 min-w-7 items-center justify-center rounded-xs bg-[#337ab7] px-2 text-[9px] font-medium text-white">
                  {page}
                </div>

                <Button
                  variant="outline"
                  size="default"
                  onClick={() => updateParams({ page: String(page + 1) })}
                  disabled={!table.getCanNextPage()}
                  className="h-8 rounded-xs border-[#5f656a] bg-white px-2.5 text-[10px] text-[#66737e] shadow-none hover:bg-[#f3f6f8] hover:text-[#66737e] cursor-pointer"
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;
