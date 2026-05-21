import { useNavigate } from "react-router-dom";

export default function BlogList({  filteredBlogs, type, onItemClick }) {
	const navigate = useNavigate();
    return(

  <div className={`blog-list ${type === "blog" ? "" : "blog-list--search-results"}`}>
    {filteredBlogs.map((blog) => (
      <div className="blog-item" key={blog.id}>
        {blog.tags.map((tag) => (
          <span className="blog-item__tag" key={tag}>{tag}</span>
        ))}
			  <h3 className="blog-item__title">{blog.title}</h3>
			  <p className="blog-item__excerpt">{blog.body.slice(0, 150)}...</p>
			  <p className="blog-item__meta">Post #{blog.id}</p>
			  <button className="blog-item__read-more" onClick={() => 
				{if (onItemClick) {
					onItemClick(blog.id);
				} else {
					navigate(`/blogs/${blog.id}`);
				}
				}}>
				Read More →
			  </button>
			</div>
	))}
  </div>
		
    )
}