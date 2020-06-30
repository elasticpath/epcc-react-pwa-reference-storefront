import React from 'react'
// @ts-ignore
import { RefinementList } from 'react-instantsearch-dom'
import { ReactComponent as FilterIcon } from './images/icons/filter_list.svg';

interface CustomRefinementListProps {
  title: string;
  attribute: string;
  defaultRefinement?: string[];
  operator?: string;
  limit?: number;
  showMore?: boolean;
  showMoreLimit?: number;
  searchable?: boolean;
  translations?: object;
}

export const CustomRefinementList: React.FC<CustomRefinementListProps> = ({ title, ...props }) => {
  return (
    <div className="refinement-list">
      <h4 className="refinement-list__title">
        <FilterIcon className="refinement-list__filter-icon" />
        {title}
      </h4>
      <RefinementList {...props} />
    </div>
  )
};
