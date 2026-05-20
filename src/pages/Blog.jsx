import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ListBlogs from '../components/ListBlogs';
import Pagination from '../components/Pagination';
import CreateBlogModal from '../components/CreateBlogModal';
import { blogAPI } from '../api';

export default function Blog() {
	const [activeCategory, setActiveCategory] = useState('Everything');
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [sortOrder, setSortOrder] = useState('default');
	const [showAllTags, setShowAllTags] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const PAGE_SIZE = 10;

	const { data: tagsData } = useQuery({
		queryKey: ['tags'],
		queryFn: () => blogAPI.getTagList().then(res => ['Everything', ...res.data]),
	});

	const tags = tagsData || [];
	const displayCategories = showAllTags ? tags : tags.slice(0, 8);

	const { data: postsData, isLoading, error } = useQuery({
		queryKey: ['posts', activeCategory, currentPage],
		queryFn: () => {
			const skip = (currentPage - 1) * PAGE_SIZE;
			if (activeCategory === 'Everything') {
				return blogAPI.getPosts(PAGE_SIZE, skip).then(res => res.data);
			}
			return blogAPI.getPostsByTag(activeCategory, PAGE_SIZE, skip).then(res => res.data);
		},
	});

	const filteredBlogs = postsData?.posts || [];
	const totalPosts = postsData?.total || 0;
	const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

	const displayedBlogs = useMemo(() => {
		let blogs = [...filteredBlogs];
		if (sortOrder === 'a-z') {
			blogs.sort((a, b) => a.title.localeCompare(b.title));
		}
		return blogs;
	}, [filteredBlogs, sortOrder]);

	const handleBlogCreated = (newBlog) => {
		setCurrentPage(1);
		setShowCreateModal(false);
	};

	useEffect(() => {
		setCurrentPage(1);
	}, [sortOrder]);


	if (error) {
		return <p>Failed to load blogs: {error.message}</p>;
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
						key={`${category}`}
						type="button"
						className={`tag-btn${activeCategory === category ? ' is-active' : ''}`}
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

	  <section>
		{isLoading ? (
			<p>Loading blogs...</p>
		) : (
			<>
				<ListBlogs filteredBlogs={displayedBlogs} type="blog" />
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={setCurrentPage}
				/>
			</>
		)}
	  </section>

	  <CreateBlogModal 
		isOpen={showCreateModal}
		onClose={() => setShowCreateModal(false)}
		onBlogCreated={handleBlogCreated}
	  />
	</>
  );
}
