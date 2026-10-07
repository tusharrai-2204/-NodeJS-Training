import { getUserById, getUserPosts } from "@/lib/api/users";
import type { Post } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const UserPosts = () => {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["User", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ["Posts", userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });

  if (userLoading || postsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-secondary" />
        <Skeleton className="h-4 w-24 bg-secondary" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl bg-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (userError || postsError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
        Failed to load user data. Please try again.
      </div>
    );
  }

  if (!user || !posts) {
    return (
      <div className="text-center py-20 text-muted-foreground text-sm">
        No data found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => navigate("/users")}
        className="text-muted-foreground hover:text-foreground -ml-2 h-8"
      >
        ← Back to Users
      </Button>

      <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6">
        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full mt-1">
            <span>📝</span>
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Posts</h2>
        {posts.map((post: Post) => (
          <div
            key={post.id}
            className="rounded-xl border border-border bg-card p-5 space-y-2 hover:border-border/80 transition-colors"
          >
            <h3 className="font-medium text-sm leading-snug capitalize">{post.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPosts;
