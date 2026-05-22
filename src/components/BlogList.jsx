import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card.jsx";
export default function BlogList({
  filteredBlogs,
  type,
  isLoading,
  onItemClick,
}) {
  const navigate = useNavigate();

  const renderSkeletonCard = (index) => (
    <Card
      key={`skeleton-card-${index}`}
      className="flex flex-col rounded-[24px] p-[22px] min-h-[350px] bg-white/90 border-slate-900/[0.08] shadow-[0_16px_34px_rgba(15,23,42,0.08)] animate-pulse"
    >
      <div className="flex-1">
        <Skeleton className="h-[24px] w-[80px] rounded-full " />
        <Skeleton className="h-[28px] w-full mt-[14px] mb-[10px]" />
        <Skeleton className="h-3/4 w-full mt-[14px] mb-[10px]" />
      </div>
    </Card>
  );

  return (
    <div
      className={
        type === "blog"
          ? "grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[18px]"
          : "flex flex-col gap-5"
      }
    >
      {isLoading
        ? Array.from(new Array(12)).map((_, idx) => renderSkeletonCard(idx))
        : filteredBlogs?.map((blog) => (
            <Card
              key={blog.id}
              className="flex flex-col bg-white/90 border-slate-900/[0.08] rounded-[24px] p-[22px] min-h-[350px] shadow-[0_16px_34px_rgba(15,23,42,0.08)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(15,23,42,0.12)]"
            >
              {/* CardHeader: Tags & Title */}
              <CardHeader className="p-0 mb-auto">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags?.map((tag) => (
                    <span
                      key={tag}
                      className=" inline-flex min-w-[74px] justify-center py-[0.3rem] px-[0.5rem] rounded-full bg-[#667eea]/12 text-[#4c51bf] text-[0.7rem] font-extrabold tracking-[0.08em] uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <CardTitle className="mt-[14px] mb-[10px]  leading-[1.3] ">
                  {blog.title}
                </CardTitle>
              </CardHeader>

              {/* CardContent: Excerpt */}
              <CardContent className="p-0 flex-1">
                <p className="m-0 text-gray-600 leading-[1.7] line-clamp-3">
                  {blog.body.slice(0, 150)}...
                </p>
              </CardContent>

              {/* CardFooter: Meta & Button */}
              <CardFooter className="p-0 mt-[18px] flex flex-col items-start">
                <p className="m-0 text-gray-500 text-[0.92rem] mb-3">
                  Post #{blog.id}
                </p>
                <button
                  className="rounded-full py-[0.6rem] px-4 bg-linear-to-br from-[#667eea] to-[#764ba2] text-white font-semibold cursor-pointer transition-all duration-200 hover:opacity-90 active:scale-95"
                  onClick={() => {
                    if (onItemClick) {
                      onItemClick(blog.id);
                    } else {
                      navigate(`/blogs/${blog.id}`);
                    }
                  }}
                >
                  Read More →
                </button>
              </CardFooter>
            </Card>
          ))}
    </div>
  );
}
