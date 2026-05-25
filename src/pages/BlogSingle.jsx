import { useParams } from "react-router-dom";

import BlogDescription from "../components/BlogDescription";
import { blogAPI } from "../api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
export default function BlogSingle() {
  const { id } = useParams();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => blogAPI.getPostById(id).then((res) => res.data),
    enabled: !!id,
  });
  
  if (!data) {
    return <p>Blog not found</p>;
  }
  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    toast.error("Error loading blog");
    return <p>Error loading blog</p>;
  }
  return (
    <section className="blog-single">
      <BlogDescription blog={data} onBlogUpdated={refetch} />
    </section>
  );
}
