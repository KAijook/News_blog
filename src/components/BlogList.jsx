import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton"; 

export default function BlogList({ filteredBlogs, type, isLoading, onItemClick }) {
    const navigate = useNavigate();

    const renderSkeletonItem = (index) => (
        <div className="blog-item" key={`skeleton-${index}`}>
           
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <Skeleton variant="rounded" width={60} height={150} animation="wave" />
                <Skeleton variant="rounded" width={80} height={150} animation="wave" />
            </div>

            <Skeleton variant="text" sx={{ fontSize: '1.75rem' }} width="75%" animation="wave" />

            <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                <Skeleton variant="text" width="100%" animation="wave" />
                <Skeleton variant="text" width="95%" animation="wave" />
                <Skeleton variant="text" width="40%" animation="wave" />
            </div>

            <Skeleton variant="text" width="15%" height={15} animation="wave" style={{ marginBottom: '12px' }} />

            <Skeleton variant="rounded" width={100} height={35} animation="wave" />
        </div>
    );

    return (
        <div className={`blog-list ${type === "blog" ? "" : "blog-list--search-results"}`}>
            {isLoading ? (
                
                Array.from(new Array(10)).map((_, idx) => renderSkeletonItem(idx))
            ) : (
                filteredBlogs.map((blog) => (
                    <div className="blog-item" key={blog.id}>
                        {blog.tags?.map((tag) => (
                            <span className="blog-item__tag" key={tag}>{tag}</span>
                        ))}
                        <h3 className="blog-item__title">{blog.title}</h3>
                        <p className="blog-item__excerpt">{blog.body.slice(0, 150)}...</p>
                        <p className="blog-item__meta">Post #{blog.id}</p>
                        <button className="blog-item__read-more" onClick={() => {
                            if (onItemClick) {
                                onItemClick(blog.id);
                            } else {
                                navigate(`/blogs/${blog.id}`);
                            }
                        }}>
                            Read More →
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}