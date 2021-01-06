import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from './app-state';
import { ReactComponent as PaginationIcon } from "./images/icons/ic_caret.svg";

import './OrdersPagination.scss';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  totalOrders: number;
  pageOrders: number;
  formatUrl: (page: number) => string;
}

export const OrdersPagination: React.FC<PaginationProps> = (props) => {
  const { t } = useTranslation();
  const items = [];
  
  if(props.currentPage === 1 || props.totalPages === 0)
    items.push(<span className={"orderspagination__link --next --deactive"}><PaginationIcon className="orderspagination__prevpageicon" /></span>);
  
  if(props.currentPage > 1)
    items.push(<Link key="prev" className={`orderspagination__link --prev ${props.currentPage === 1 ? "--deactive" : "--active"}`} to={props.formatUrl(props.currentPage - 1)}><PaginationIcon className="orderspagination__prevpageicon" /></Link>);
  
  items.push(<span key={props.currentPage} >{t('page')} {props.currentPage} {t('of')} {props.totalPages}</span>)
  
  if(props.currentPage < props.totalPages)
    items.push(<Link key="next" className={`orderspagination__link --next ${props.currentPage === props.totalPages ? "--deactive" : "--active"}`} to={props.formatUrl(props.currentPage + 1)}><PaginationIcon className="orderspagination__nextpageicon" /></Link>);
  
  if(props.currentPage === props.totalPages)
    items.push(<span className={"orderspagination__link --next --deactive"}><PaginationIcon className="orderspagination__nextpageicon" /></span>);
  
    const startNum = ((props.currentPage-1)*20)+1;
    const endNum = startNum + props.pageOrders - 1;
  return (
    <div className="orderspagination">
        <span className="orderspagination__pageinfo">
          {
            props.totalOrders === 0 
            ?
            `${props.totalOrders} ${t('results')}`
            :
            `${startNum} - ${endNum} ${t('of')} ${props.totalOrders} ${t('results')}`
          }
           
        </span>
        <span className="orderspagination__paginateinfo">
           {items}
        </span>
    </div>
  );
};
