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
        pages.push("...");
      }

      const start = Math.max(2, currentPage - halfVisible);
      const end = Math.min(totalPages - 1, currentPage + halfVisible);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - halfVisible - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  if (pages.length === 1) return null;

  return (
    <div className="mt-[40px] flex flex-wrap items-center justify-center gap-[8px]">
      <button
        className="cursor-pointer flex h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border border-[rgba(102,126,234,0.2)] bg-[rgba(255,255,255,0.8)] px-[12px] font-[400] text-[1.2rem] text-[#1f2937] transition-all duration-200 hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):border-[rgba(102,126,234,0.4)] hover:not(:disabled):bg-[#fff] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ‹
      </button>

      {pages.map((page, idx) => (
        <button
          key={idx}
          className={`cursor-pointer flex h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border px-[12px] font-[400] transition-all duration-200 ${
            page === currentPage
              ? "border-[#667eea] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] text-[#fff] shadow-[0_10px_22px_rgba(102,126,234,0.3)]"
              : page === "..."
                ? "border-none bg-transparent text-[#9ca3af]"
                : "border-[rgba(102,126,234,0.2)] bg-[rgba(255,255,255,0.8)] text-[#1f2937] hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):border-[rgba(102,126,234,0.4)] hover:not(:disabled):bg-[#fff]"
          }`}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..." || page === currentPage}
        >
          {page}
        </button>
      ))}

      <button
        className=" cursor-pointer flex h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border border-[rgba(102,126,234,0.2)] bg-[rgba(255,255,255,0.8)] px-[12px] font-[400] text-[1.2rem] text-[#1f2937] transition-all duration-200 hover:not(:disabled):-translate-y-[2px] hover:not(:disabled):border-[rgba(102,126,234,0.4)] hover:not(:disabled):bg-[#fff] disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  );
}
