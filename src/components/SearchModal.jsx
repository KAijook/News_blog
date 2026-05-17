import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListBlogs from './ListBlogs';
export default function SearchModal({ isOpen, onClose, blogs }) {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);


  const searchTerm = search.toLowerCase();
  const filteredBlogs = searchTerm
    ? blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchTerm)
      )
    : [];

  const handleBlogClick = (blogId) => {
    navigate(`/blogs/${blogId}`);
    onClose();
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal__header">
          <h2>Search Articles</h2>
          <button 
            className="search-modal__close" 
            onClick={onClose}
          >
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

          <div className="search-modal__results">
            {searchTerm && filteredBlogs.length > 0 ? (
             <ListBlogs 
                filteredBlogs={filteredBlogs} 
                type="search" 
                onItemClick={handleBlogClick} 
              />
            ) : searchTerm && filteredBlogs.length === 0 ? (
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
