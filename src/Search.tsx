import React from 'react';
// @ts-ignore
import { Hits, SortBy, Pagination } from 'react-instantsearch-dom'
import { ProductHit } from './ProductHit';
import { CustomRefinementList } from './CustomRefinementList';
import { config } from './config';

import './Search.scss';

interface SearchParams  {
  keywords: '';
}

export const Search: React.FC<SearchParams> = (props) => {

  const Hit = ({ hit }: any) => (
    <div className="search__product">
      <ProductHit hit={hit} />
    </div>
  );

  const Facets = () => (
    <div className="search__facets">
      <div>
        <h4 className="">Sort by:</h4>
        <SortBy
          key="facets-SortBy"
          defaultRefinement={config.algoliaIndexName}
          items={[
            { value: config.algoliaIndexName, label: 'Featured' },
            { value: 'product_price_asc', label: 'Price asc.' },
            { value: 'product_price_desc', label: 'Price desc.' }
          ]}
        />
      </div>
      <CustomRefinementList key="facets-list-1" title="Category" attribute="categories" />
      <CustomRefinementList key="facets-list-2" title="Collection" attribute="collections" />
      <CustomRefinementList key="facets-list-3" title="Brand" attribute="brands" />
    </div>
  );

  return (
    <div className="search">
      <h1 className="search__title">Search</h1>
      <label htmlFor="checkbox" className="search__facetstoggle epbtn --bordered">
        Filter
      </label>
      <input type="checkbox" id="checkbox" className="search__facetstoggleinput"/>
      <Facets key="search-facets" />
      <div className="search__productlist">
        <Hits hitComponent={Hit} />
      </div>
      <div className="search__pagination">
        <Pagination showFirst={false} />
      </div>
  </div>
  );
};
