import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import type { Student } from "@/lib/types";
import { useStudentsQuery } from "@/hooks/useStudents";
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
import { useNavigate, useSearchParams } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import useDebounce from "@/hooks/useDebounce";
import { Input } from "./ui/input";

const features = tableFeatures({
  rowPaginationFeature,
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
});
const columnHelper = createColumnHelper<typeof features, Student>();

const StudentList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "10");
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort");
  const order = (searchParams.get("order") ?? "asc") as "asc" | "desc";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  const columns = columnHelper.columns([
    columnHelper.accessor("id", {
      header: "Student ID",
    }),
    columnHelper.accessor("title", {
      header: ({ column }) => (
        <Button onClick={() => column.toggleSorting()}>
          Student Name{" "}
          {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
              ? "↓"
              : "↕"}
        </Button>
      ),
    }),
    columnHelper.accessor("age", {
      header: ({ column }) => (
        <Button onClick={() => column.toggleSorting()}>
          Age{" "}
          {column.getIsSorted() === "asc"
            ? "↑"
            : column.getIsSorted() === "desc"
              ? "↓"
              : "↕"}
        </Button>
      ),
    }),
    columnHelper.display({
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => navigate(`/students/${student.id}`)}
          >
            View Details
          </Button>
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

  const { data: result, isLoading, error } = useStudentsQuery({
    page,
    pageSize,
    search,
    sort,
    order,
  });

  const table = useTable({
    features,
    columns,
    data: result?.data ?? [],
    rowCount: result?.total ?? 0,
    manualPagination: true,
    manualSorting: true,
    state: {
      pagination: { pageIndex: page - 1, pageSize },
      sorting: sort ? [{ id: sort, desc: order === "desc" }] : [],
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
          ? updater(sort ? [{ id: sort, desc: order === "desc" }] : [])
          : updater;
      if (next.length > 0) {
        updateParams({
          sort: next[0].id,
          order: next[0].desc ? "desc" : "asc",
          page: "1",
        });
      } else {
        updateParams({ sort: "", order: "asc", page: "1" });
      }
    },
  });

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load students. Please check your connection and try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse enrolled student records</p>
        </div>
      </div>

      <Input
        type="text"
        placeholder="Search students..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="max-w-xs bg-secondary border-border"
      />

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-border bg-secondary/50 hover:bg-secondary/50">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-muted-foreground font-medium">
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
                <TableRow key={i} className="border-border">
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-secondary" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-12">
                  No students found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-secondary/30 transition-colors">
                  {row.getAllCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => updateParams({ pageSize: e.target.value, page: "1" })}
            className="text-xs bg-secondary border border-border rounded-md px-2 py-1 text-foreground"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParams({ page: String(page - 1) })}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 text-xs"
          >
            ← Previous
          </Button>
          <span className="text-xs text-muted-foreground px-2">
            Page <span className="text-foreground font-medium">{page}</span> of{" "}
            <span className="text-foreground font-medium">{table.getPageCount()}</span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateParams({ page: String(page + 1) })}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 text-xs"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentList;
