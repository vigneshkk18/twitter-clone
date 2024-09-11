import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { useQuery } from "@tanstack/react-query";

interface Posts {
  feedType: "forYou" | "following" | "posts" | "likes";
  username?: string;
  userId?: string;
}

const getPostsEndpoint = (
  feedType: Posts["feedType"],
  username?: string,
  userId?: string
) => {
  if (feedType === "following") return "/api/posts/following";
  if (feedType === "posts" && username) return `/api/posts/user/${username}`;
  if (feedType === "likes" && userId) return `/api/posts/likes/${userId}`;
  return "/api/posts/all";
};

const Posts = ({ feedType, username, userId }: Posts) => {
  const POST_ENDPOINT = getPostsEndpoint(feedType, username, userId);

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(POST_ENDPOINT);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, username]);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && posts && (
        <div>
          {posts.map((post: any) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
