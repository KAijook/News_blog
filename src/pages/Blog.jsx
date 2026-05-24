import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogList from "../components/BlogList";
import Pagination from "../components/Pagination";
import BlogCreateModal from "../components/BlogCreateModal";
import { blogAPI } from "../api";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "../hooks/useDebounce";

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Everything");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [showAllTags, setShowAllTags] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const PAGE_SIZE = 12;
  // Fetch tags for category filtering
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      blogAPI.getTagList().then((res) => ["Everything", ...res.data]),
  });

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  // Fetch posts for search suggestions
  const { data: searchPostsData, isLoading: isSearching } = useQuery({
    queryKey: ["searchPosts", debouncedSearchQuery],
    queryFn: () =>
      blogAPI.searchPosts(debouncedSearchQuery).then((res) => res.data.posts),
    enabled: debouncedSearchQuery.trim().length > 0,
  });

  const isSearchingMode = debouncedSearchQuery.trim().length > 0;

  const tags = tagsData || [];
  const displayCategories = showAllTags ? tags : tags.slice(0, 8);

 

  // Fetch posts based on active category and pagination
  const {
    data: postsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", activeCategory, currentPage],
    queryFn: () => {
      const skip = (currentPage - 1) * PAGE_SIZE;
      if (activeCategory === "Everything") {
        return blogAPI.getPosts(PAGE_SIZE, skip).then((res) => res.data);
      }
      return blogAPI
        .getPostsByTag(activeCategory, PAGE_SIZE, skip)
        .then((res) => res.data);
    },
  });

 
  const items = [
    { value: "default", label: "Default" },
    { value: "a-z", label: "A-Z" },
  ];

  const filteredBlogs = postsData?.posts || [];
  const totalPosts = postsData?.total || 0;

  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  // Fetch sorted posts if sort order is changed
  const { data: displayedBlogs = [], isLoading: isDisplayedBlogsLoading } =
    useQuery({
      queryKey: ["displayedBlogs", sortOrder, filteredBlogs?.length],
      queryFn: async () => {
        let blogs = [...filteredBlogs];

        if (sortOrder === "a-z") {
          const response = await blogAPI.sortPosts();

          return response.data.posts;
        }

        return blogs;
      },

      enabled: filteredBlogs?.length > 0,
    });

  const handleBlogCreated = () => {
    setCurrentPage(1);
    setShowCreateModal(false);
  };

  const isLoadingToShow = isSearchingMode
    ? isSearching
    : isLoading || isDisplayedBlogsLoading;

  const postToShow = useMemo(() => {
    // If not in search mode, show the paginated and sorted blogs by Tags
    if (!searchPostsData) return displayedBlogs;

    // 1. If no tag selected -> return all search results
    if (activeCategory === "Everything") {
      return searchPostsData;
    }
    // 2. if tag selected -> return search results filtered by tag

    return searchPostsData.filter((post) => post.tags.includes(activeCategory));
  }, [searchPostsData, displayedBlogs, activeCategory]);



  if (error) {
    return <p>Failed to load blogs: {error.message}</p>;
  }
 

  return (
    <>
      
      <section className="max-w-[760px] mb-7">
        <p className="mx-0 mt-0 mb-3 text-[1.2rem] font-[800] tracking-[0.12em] uppercase text-[#4c51bf]">
          We write about
        </p>
        <h2 className="m-0 text-[#0f172a] text-[clamp(2.4rem,5vw,5rem)] tracking-[-0.05em] leading-[0.96]">
          Ideas, tutorials, and practical notes for everyday work.
        </h2>
        <p className="mt-[18px] max-w-[620px] text-[#475569] text-[1.05rem] leading-[1.75] ">
          A News Blog provide valuable content that helps our readers grow and
          succeed in their endeavors.
        </p>
      </section>

      <section className="mt-7 mb-[30px] mx-0">
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-wrap gap-[12px] mb-[30px] mt-[28px] mx-0">
            {displayCategories.map((category) => (
              <button
                key={`${category}`}
                type="button"
                className={`py-[0.8rem] px-[1.2rem] rounded-full cursor-pointer  border-[rgba(102,126,234,0.16)] border font-[700] ]
							${activeCategory === category ? "bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-[#fff] shadow-[0_14px_26px_rgba(102,126,234,0.28)]" : "bg-[rgba(255,255,255,0.8)] color-[#1f2937] shadow-[0_10px_24px_rgba(15,23,42,0.06)"}`}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </button>
            ))}
            {tags.length > 8 && (
              <button
                type="button"
                className="py-[0.8rem] px-[1.15rem] rounded-full bg-[rgba(102,126,234,0.12)] color-[#4c51bf] shadow-[0_10px_24px_rgba(15,23,42,0.06)] border cursor-pointer border-[rgba(102,126,234,0.16)] font-[700] hover:bg-[rgba(102,126,234,0.2)]"
                onClick={() => setShowAllTags(!showAllTags)}
              >
                {showAllTags ? "- Collapse" : `+ More (${tags.length - 8})`}
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-[12px] align-center">
            <button
              type="button"
              className="py-[0.8rem] px-[1.15rem] rounded-full border-none bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-[#fff] shadow-[0_10px_24px_rgba(15,23,42,0.06)] border cursor-pointer border-[rgba(102,126,234,0.16)] font-[700] hover:bg-[rgba(102,126,234,0.2)] hover:translate-y-[-2px] hover:shadow-[0_10px_22px_rgba(102,126,234,0.3)]"
              onClick={() => setShowCreateModal(true)}
            >
              + New Blog
            </button>
            <div className="relative z-10 ">
              <Select
                value={sortOrder}
                onValueChange={(val) => {
                  setSortOrder(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-full py-[0.6rem] pl-[1rem] pr-[2.5rem] rounded-full bg-[rgba(102,126,234,0.12)] text-[#4c51bf] shadow-[0_10px_24px_rgba(15,23,42,0.06)] font-[700]">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {items.map((item) => (
                      <SelectItem
                        className=" inline-block w-full"
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-[12px] ml-auto">
               
                      <Input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        className="w-[400px] h-full px-[16px] rounded-full"
                        onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
                        }}
                      />
                    
              
            </div>
            </div>
          </div>
      
      </section>

      <section>
        <>
{postToShow.length === 0 ? (
  <p className="text-center text-gray-500 text-[1.1rem] mt-[40px]">
    No blogs found for the selected category.
  </p>
) : (
          <BlogList
            filteredBlogs={postToShow}
            type="blog"
            isLoading={isLoadingToShow}
          />
        )}
          
          {!isSearchingMode && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      </section>

      <BlogCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onBlogCreated={handleBlogCreated}
      />
    </>
  );
}
