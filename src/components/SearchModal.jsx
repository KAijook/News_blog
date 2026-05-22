import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogAPI } from "../api";
import { useQuery } from "@tanstack/react-query"; 
import { useDebounce } from "@/hooks/useDebounce";


export default function SearchModal({ isOpen, onClose }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  const { data: searchResults } = useQuery({
    queryKey: [debouncedSearch],
    queryFn: () => blogAPI.searchPosts(debouncedSearch.toLowerCase()).then((res) => res.data.posts),
    enabled: debouncedSearch.trim() !== "",
  });
  
  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}?q=${search}`);
    onClose();
    setSearch("");
  };


  if (!isOpen) {
    return null;
  }

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__header">
          <h2>Search Articles</h2>
          <button className="search-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="search-modal__content">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter article name..."
            className="search-modal__input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-col gap-2 mt-4 min-h-[100px]">
           
            {searchResults && searchResults.length > 0 ? (
              searchResults.map((blog) => (
                <div
                  key={blog.id}
                  className="search-modal__result"
                  onClick={() => handleBlogClick(blog.id)}
                >
                  
                  <h3>{blog.title}</h3>
                </div>
              ))
            ) : searchResults && searchResults.length === 0 ? (
              <p className="search-modal__no-results">No articles found</p>
            ) : (
              <p className="search-modal__hint">Start typing to search...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}