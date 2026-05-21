import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BlogDescription from '../components/BlogDescription';
import { blogAPI } from '../api';

export default function BlogSingle() {
     const { id, searchTerm } = useParams();
    const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

    useEffect(() => {
        setError('');
        setLoading(true);
        async function fetchBlog() {
            try {
                const response = await blogAPI.getPostById(id);
                setBlog(response.data);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        }
        fetchBlog()
            
    }, [id, searchTerm]);

    const handleBlogUpdated = (updatedBlog) => {
        setBlog(updatedBlog);
    };

    const handleBlogDeleted = (blogId) => {
        console.log('Blog deleted:', blogId);
    };

    if (loading) {
    return <p>Loading blog...</p>;
}

if(error) {
    return <p>Failed to load blog: {error}</p>;
}


    if (!blog) {
        return <p>Blog not found</p>;
    }
  return (
   
    <section className="blog-single">
        <BlogDescription
          blog={blog} 
          onBlogUpdated={handleBlogUpdated}
          onBlogDeleted={handleBlogDeleted}
        />
    </section>
  );
}
