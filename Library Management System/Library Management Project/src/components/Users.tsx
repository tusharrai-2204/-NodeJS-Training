import { getUsers } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import type { User } from "@/lib/types";
import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const Users = () => {
  const [searchText, setSearchText] = useState<string>("");
  const debouncedSearch = useDebounce<string>(searchText, 300);
  const navigate = useNavigate();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["Users"],
    queryFn: getUsers,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore user profiles and posts</p>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-4 px-4 py-3 border-b border-border last:border-0">
                <Skeleton className="h-4 w-36 bg-secondary" />
                <Skeleton className="h-4 w-48 bg-secondary" />
                <Skeleton className="h-4 w-24 bg-secondary" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load users. Please check your connection.
      </div>
    );
  }

  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Explore user profiles and posts</p>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs bg-secondary border-border"
        />
        <span className="text-xs text-muted-foreground">
          {filteredUsers.length} of {users.length} users
        </span>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
              <TableHead className="text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium">City</TableHead>
              <TableHead className="text-muted-foreground font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={4} className="text-center text-muted-foreground py-12">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id} className="border-border hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell className="text-muted-foreground">{user.address.city}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="h-7 px-3 text-xs text-primary hover:text-primary hover:bg-primary/10"
                    >
                      View Posts →
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Users;
