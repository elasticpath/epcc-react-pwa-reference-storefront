import React from 'react'
import { RefinementList } from 'react-instantsearch-dom'

import './CustomRefinementList.scss';

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
      <input type="checkbox" id={`checkbox-${title}`} className="refinementlist__toggleinput"/>
      <label htmlFor={`checkbox-${title}`} className="refinementlist__title">
        {title}
      </label>
      <div className="refinementlist__list">
        <RefinementList {...props} />
      </div>
    </div>
  )
};
