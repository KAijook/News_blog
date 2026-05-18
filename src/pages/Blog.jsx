import { useEffect, useMemo, useState } from 'react';
import ListBlogs from '../components/ListBlogs';
import CreateBlogModal from '../components/CreateBlogModal';

export default function Blog() {
	const [blogs, setBlogs] = useState([]);
	const [tags, setTags] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [activeCategory, setActiveCategory] = useState('Everything');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [sortOrder, setSortOrder] = useState('default');
	const [showAllTags, setShowAllTags] = useState(false);

	useEffect(() => {
		fetch('https://dummyjson.com/posts?limit=0')
			.then((response) => response.json())
			.then((data) => setBlogs(data.posts))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		fetch('https://dummyjson.com/posts/tag-list')
			.then((response) => response.json())
			.then((data) => setTags(['Everything', ...data]))
			.catch((err) => setError(err.message));
	}, []);

	useEffect(() => {
		if (activeCategory === 'Everything') {
			return;
		}

		setLoading(true);
		fetch(`https://dummyjson.com/posts/tag/${activeCategory}`)
			.then((response) => response.json())
			.then((data) => setBlogs(data.posts))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [activeCategory]);

	const displayCategories = showAllTags ? tags : tags.slice(0, 8);

	const filteredBlogs = useMemo(() => {
		let result = blogs;
		

		if (sortOrder === 'a-z') {
			result = [...result].sort((a, b) => a.title.localeCompare(b.title));
		}

		return result;
	}, [ blogs, sortOrder]);

	const handleSelectTag = (tag) => {
		setActiveCategory(tag);
	};

	const handleBlogCreated = (newBlog) => {
		setBlogs([newBlog, ...blogs]);
	};

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

	  <section className="filters-section">
		<div className="filters-wrapper">
			<div className="filters">
				{displayCategories.map((category, idx) => (
					<button
						key={`${category}-${idx}`}
						type="button"
						className={`tag-btn${activeCategory === category ? ' is-active' : ''}`}
						onClick={() => setActiveCategory(category)}
					>
						{category}
					</button>
				))}
				{tags.length > 8 && (
					<button
						type="button"
						className="tag-btn tag-btn--show-more"
						onClick={() => setShowAllTags(!showAllTags)}
					>
						{showAllTags ? '- Collapse' : `+ More (${tags.length - 8})`}
					</button>
				)}
			</div>
			<div className="filters-actions">
				<button
					type="button"
					className="tag-btn tag-btn--primary"
					onClick={() => setShowCreateModal(true)}
				>
					+ New Blog
				</button>
				<select 
					className="sort-select"
					value={sortOrder}
					onChange={(e) => setSortOrder(e.target.value)}
				>
					<option value="default">Default</option>
					<option value="a-z">A-Z</option>
				</select>
			</div>
		</div>
	  </section>

	  <CreateBlogModal 
		isOpen={showCreateModal}
		onClose={() => setShowCreateModal(false)}
		onBlogCreated={handleBlogCreated}
	  />

	  <section>
		<ListBlogs filteredBlogs={filteredBlogs} type="blog" />
	  </section>
	</>
  );
}
