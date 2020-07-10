import React from 'react'
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
    <div className="refinementlist">
      <h2 className="refinementlist__title">
        <FilterIcon className="refinementlist__filtericon" />
        {title}
      </h2>
      <RefinementList {...props} />
    </div>
  )
};
