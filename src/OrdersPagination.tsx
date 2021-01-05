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
    items.push(<Link key="prev" className={`orderspagination__link --prev ${props.currentPage === 1 ? "--deactive" : "--active"}`} to={props.formatUrl(props.currentPage - 1)}><PaginationIcon className="orderspagination__prevpageicon" /></Link>);
    items.push(<span key={props.currentPage} >{t('page')} {props.currentPage} {t('of')} {props.totalPages}</span>)
    items.push(<Link key="next" className={`orderspagination__link --next ${props.currentPage === props.totalPages ? "--deactive" : "--active"}`} to={props.formatUrl(props.currentPage + 1)}><PaginationIcon className="orderspagination__nextpageicon" /></Link>);
    const startNum = ((props.currentPage-1)*3)+1;
    const endNum = startNum + props.pageOrders - 1;
  return (
    <div className="orderspagination">
        <span className="orderspagination__pageinfo">
            {startNum} - {endNum} {t('of')} {props.totalOrders} {t('results')}
        </span>
        <span className="orderspagination__paginateinfo">
           {items}
        </span>
    </div>
  );
};
