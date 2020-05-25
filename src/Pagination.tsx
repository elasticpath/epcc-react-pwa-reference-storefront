import React from 'react';
import { Link } from 'react-router-dom';

import './Pagination.scss';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  formatUrl: (page: number) => string;
}

export const Pagination: React.FC<PaginationProps> = (props) => {
  const items = [];

  if (props.currentPage > 1) {
    items.push(<Link key="prev" className="pagination__link pagination__link--prev" to={props.formatUrl(props.currentPage - 1)}>{'<'}</Link>);
  }

  if (props.currentPage >= 5) {
    items.push(<Link key={1} className="pagination__link" to={props.formatUrl(1)}>{1}</Link>)
    items.push(<Link key={2} className="pagination__link" to={props.formatUrl(2)}>{2}</Link>)
    items.push(<Link key={3} className="pagination__link" to={props.formatUrl(3)}>{3}</Link>)
    items.push(<span key="ellipsis1" className="pagination__ellipsis">...</span>)
  }
  else {
    for (let i = 1; i < props.currentPage; i++) {
      items.push(<Link key={i} className="pagination__link" to={props.formatUrl(i)}>{i}</Link>)
    }
  }

  items.push(<span key={props.currentPage} className="pagination__link pagination__link--current">{props.currentPage}</span>)

  if (props.totalPages > props.currentPage + 4) {
    items.push(<Link key={props.currentPage + 1} className="pagination__link" to={props.formatUrl(props.currentPage + 1)}>{props.currentPage + 1}</Link>)
    items.push(<span key="ellipsis2" className="pagination__ellipsis">...</span>)
    items.push(<Link key={props.totalPages} className="pagination__link" to={props.formatUrl(props.totalPages)}>{props.totalPages}</Link>)
  }
  else {
    for (let i = props.currentPage + 1; i <= props.totalPages; i++) {
      items.push(<Link key={i} className="pagination__link" to={props.formatUrl(i)}>{i}</Link>)
    }
  }

  if (props.currentPage < props.totalPages) {
    items.push(<Link key="next" className="pagination__link pagination__link--next" to={props.formatUrl(props.currentPage + 1)}>{'>'}</Link>);
  }

  return (
    <div className="pagination">
      {items}
    </div>
  );
};
