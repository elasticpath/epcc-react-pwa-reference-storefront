import React from 'react';
// @ts-ignore
import { Hits, SortBy, Pagination, HitsPerPage } from 'react-instantsearch-dom'
import { ProductHit } from './ProductHit';
import { CustomRefinementList } from './CustomRefinementList';
import { config } from './config';

import './Search.scss';

interface SearchParams  {
  keywords: '';
}

export const Search: React.FC<SearchParams> = (props) => {
  // const { keywords } = useParams<SearchParams>();

  const Hit = ({ hit }: any) => {

    return (
      <div className="search__product"><ProductHit hit={hit} /></div>
    );
  };

  return (
    <div className="search">
      <h1 className="search__title">Search</h1>
      <div className="search__fasets">
        <div className="">
          <h4 className="">Sort by:</h4>
          <SortBy
            defaultRefinement={config.algoliaIndexName}
            items={[
              { value: config.algoliaIndexName, label: 'Featured' },
              { value: 'product_price_asc', label: 'Price asc.' },
              { value: 'product_price_desc', label: 'Price desc.' }
            ]}
          />
        </div>
        <CustomRefinementList title="Category" attribute="categories" />
        <CustomRefinementList title="Collection" attribute="collections" />
        <CustomRefinementList title="Brand" attribute="brands" />
      </div>
      <div className="search__productlist">
        <Hits hitComponent={Hit} />
      </div>
      <div className="search__pagination">
        <Pagination showFirst={false} />
      </div>
  </div>
  );
};
