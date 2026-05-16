
export default function SingleBlog( {blog} ) {
   
    return (
        <div className="single-blog">
            {blog.tags?.map((tag) => (
					<span className="blog-item__tag" key={tag}>{tag}</span>
				))}
			  <h3 className="blog-item__title">{blog.title}</h3>
			  <p className="blog-item__excerpt">{blog.body}</p>
              <p className="blog-item__meta">Post by #{blog.userId}</p>
              <p className="blog-item__meta">Views: {blog.views}</p>
        </div>
    );
}
