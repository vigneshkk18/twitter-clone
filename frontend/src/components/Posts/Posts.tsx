import { useEffect } from "react";
import Post from "./Post";
import PostSkeleton from "./PostSkeleton";
import { useQuery } from "@tanstack/react-query";

interface Posts {
  feedType: "forYou" | "following";
}

const getPostsEndpoint = (feedType: Posts["feedType"]) => {
  if (feedType === "following") return "/api/posts/following";
  return "/api/posts/all";
};

const Posts = ({ feedType }: Posts) => {
  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await fetch(getPostsEndpoint(feedType));
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType]);

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
