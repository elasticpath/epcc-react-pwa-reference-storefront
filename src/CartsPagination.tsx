import React from 'react';
import { ReactComponent as PaginationIcon } from "./images/icons/ic_caret.svg";

import './CartsPagination.scss';

export interface Props {
  page: number;
  totalPages: number;
//   handlePagination: (page: number) => void;
}
export const CartsPagination: React.FC<Props> = ({
  page,
  totalPages,
//   handlePagination,
}) => {
  return (
    <div className="CartsPagination">
        {page !== 1 && (
            <PaginationIcon className="CartsPagination__prevpageicon" />
        )}
        <span className="CartsPagination__pagenumber">
            Page {page} of {totalPages}
        </span>
        {page !== totalPages && (
            <PaginationIcon className="CartsPagination__nextpageicon" />
        )}
    </div>
  );
};
