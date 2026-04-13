import React from 'react';

export default function Pagination({ page, pages, onPageChange, style }) {
  if (pages <= 1) return null;

  const getPageNumbers = () => {
    if (pages <= 3) {
      return Array.from({ length: pages }, (_, i) => i + 1);
    }
    
    const nums = [];
    let start = Math.max(1, page - 1);
    let end = Math.min(pages, page + 1);

    if (page === 1) {
      end = 3;
    } else if (page === pages) {
      start = pages - 2;
    }

    if (start > 1) nums.push("start-ellipsis");
    for (let i = start; i <= end; i++) {
      nums.push(i);
    }
    if (end < pages) nums.push("end-ellipsis");
    
    return nums;
  };

  return (
    <div className="pagination" style={style}>
      <button 
        className="page-btn" 
        onClick={() => onPageChange(Math.max(1, page - 1))} 
        disabled={page === 1}
      >
        ←
      </button>
      {getPageNumbers().map((p, index) => {
        if (p === "start-ellipsis" || p === "end-ellipsis") {
          return (
            <span key={`${p}-${index}`} className="page-ellipsis" style={{ padding: '0.5rem', userSelect: 'none' }}>
              ...
            </span>
          );
        }
        return (
          <button 
            key={p} 
            className={`page-btn${page === p ? ' active' : ''}`} 
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        );
      })}
      <button 
        className="page-btn" 
        onClick={() => onPageChange(Math.min(pages, page + 1))} 
        disabled={page === pages}
      >
        →
      </button>
    </div>
  );
}
