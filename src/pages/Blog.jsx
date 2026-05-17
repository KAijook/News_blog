import { useEffect, useMemo, useState } from 'react';
import ListBlogs from '../components/ListBlogs';

export default function Blog() {
	const [blogs, setBlogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
const [activeCategory, setActiveCategory] = useState('Everything');


	useEffect(() => {
		fetch('https://dummyjson.com/posts')
			.then((response) => response.json())
			.then((data) => setBlogs(data.posts))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	const categories = ['Everything', ...new Set(blogs.flatMap((blog) => blog.tags))];

	
	const filteredBlogs = useMemo(() => {
		if (activeCategory === 'Everything') {
			return blogs;
		}

		return blogs.filter((blog) => (blog.tags).includes(activeCategory));
	}, [activeCategory, blogs]);

	if (loading) {
		return <p>Loading blogs...</p>;
	}

	if (error) {
		return <p>Failed to load blogs: {error}</p>;
	}

  return (
	<>
	  <section className="hero">
		<p className="hero-label">We write about</p>
		<h2 className="hero-title">Ideas, tutorials, and practical notes for everyday work.</h2>
		<p className="hero-copy">
		  A News Blog provide valuable content that helps our readers grow and succeed in their endeavors.
		</p>
	  </section>

	  <section className="filters">
		{categories.map((category) => (
		  <button
			key={category}
			type="button"
			className={`tag-btn${activeCategory === category ? ' is-active' : ''}`}
			onClick={() => setActiveCategory(category)}
		  >
			{category}
		  </button>
		))}
	  </section>
	  <section>
		<ListBlogs filteredBlogs={filteredBlogs} type="blog" />
	  </section>
	</>
  );
}
