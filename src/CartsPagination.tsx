import React from 'react';
import { useMultiCartData } from './app-state';
import { ReactComponent as PaginationIcon } from "./images/icons/ic_caret.svg";

import './CartsPagination.scss';

export interface Props {
  currentPage: number;
  totalPages: number;
}
export const CartsPagination: React.FC<Props> = ({
  currentPage,
  totalPages,
}) => {

  const { setPageNum} = useMultiCartData();
  return (
    <div className="CartsPagination">
      
        {currentPage !== 1 && (
         <button onClick={() => setPageNum(currentPage-1)}>prev <PaginationIcon className="CartsPagination__prevpageicon"/></button>
        )}
        
        <span className="CartsPagination__pagenumber">
            Page {currentPage} of {totalPages}
        </span>

        {currentPage !== totalPages && (
           <button onClick={() => setPageNum(currentPage+1)}>Next <PaginationIcon className="CartsPagination__nextpageicon" /></button>
        )}
    </div>
  );
};
