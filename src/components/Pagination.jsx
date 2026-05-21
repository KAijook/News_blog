export default function Pagination({ currentPage, totalPages, onPageChange }) {
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 7;
		const halfVisible = Math.floor(maxVisible / 2);

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > halfVisible + 1) {
				pages.push('...');
			}

			const start = Math.max(2, currentPage - halfVisible);
			const end = Math.min(totalPages - 1, currentPage + halfVisible);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < totalPages - halfVisible - 1) {
				pages.push('...');
			}

			pages.push(totalPages);
		}

		return pages;
	};

	const pages = getPageNumbers();

	return (
		<div className={`pagination ${pages.length === 1 ? 'pagination--hidden' : ''}`}>
			<button
				className="pagination-btn pagination-prev"
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				‹
			</button>

			{pages.map((page, idx) => (
				<button
					key={idx}
					className={`pagination-btn ${
						page === currentPage ? 'pagination-active' : ''
					} ${page === '...' ? 'pagination-ellipsis' : ''}`}
					onClick={() => typeof page === 'number' && onPageChange(page)}
					disabled={page === '...' || page === currentPage}
				>
					{page}
				</button>
			))}

			<button
				className="pagination-btn pagination-next"
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				›
			</button>
		</div>
	);
}
