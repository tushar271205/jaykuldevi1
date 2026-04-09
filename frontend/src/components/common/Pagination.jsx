import React from 'react';

export default function Pagination({ page, pages, onPageChange, style }) {
  if (pages <= 1) return null;

  return (
    <div className="pagination" style={style}>
      <button 
        className="page-btn" 
        onClick={() => onPageChange(Math.max(1, page - 1))} 
        disabled={page === 1}
      >
        ←
      </button>
      {Array.from({ length: pages }, (_, i) => {
        const p = i + 1;
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
