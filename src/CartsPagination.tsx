import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from './app-state';
import { ReactComponent as PaginationIcon } from "./images/icons/ic_caret.svg";

import './CartsPagination.scss';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  totalOrders: number;
  pageOrders: number;
  formatUrl: (page: number) => string;
}

export const CartsPagination: React.FC<PaginationProps> = (props) => {
  const { t } = useTranslation();
  const items = [];
  
  if(props.currentPage === 1 || props.totalPages === 0)
    items.push(<span className={"cartspagination__link --next --deactive"}><PaginationIcon className="cartspagination__prevpageicon" /></span>);
  
  if(props.currentPage > 1)
    items.push(<Link key="prev" className={`cartspagination__link --prev ${props.currentPage === 1 ? "--deactive" : "--active"}`} to={props.formatUrl(props.currentPage - 1)}><PaginationIcon className="cartspagination__prevpageicon" /></Link>);
  
  items.push(<span key={props.currentPage} >{t('page')} {props.currentPage} {t('of')} {props.totalPages}</span>)
  
  if(props.currentPage < props.totalPages)
    items.push(<Link key="next" className={`cartspagination__link --next ${props.currentPage === props.totalPages ? "--deactive" : "--active"}`} to={props.formatUrl(props.currentPage + 1)}><PaginationIcon className="cartspagination__nextpageicon" /></Link>);
  
  if(props.currentPage === props.totalPages)
    items.push(<span className={"cartspagination__link --next --deactive"}><PaginationIcon className="cartspagination__nextpageicon" /></span>);

  return (
    <div className="cartspagination">
        <span className="cartspagination__paginateinfo">
           {items}
        </span>
    </div>
  );
};
