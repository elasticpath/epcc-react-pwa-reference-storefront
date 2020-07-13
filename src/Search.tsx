import React from 'react';
import { Hits, SortBy, Pagination } from 'react-instantsearch-dom'
import { ProductHit } from './ProductHit';
import { CustomRefinementList } from './CustomRefinementList';
import { useTranslation } from './app-state';
import { config } from './config';

import './Search.scss';

interface SearchParams  {
}

export const Search: React.FC<SearchParams> = () => {
  const { t } = useTranslation();

  const Hit = ({ hit }: any) => (
    <div className="search__product">
      <ProductHit hit={hit} />
    </div>
  );

  const Facets = () => (
    <div className="search__facets">
      <div>
        <h2 className="">
          {t('sort-by')}
        </h2>
        <SortBy
          key="facets-SortBy"
          defaultRefinement={config.algoliaIndexName}
          items={[
            { value: config.algoliaIndexName, label: t('featured') },
            { value: 'product_price_asc', label: t('price-asc') },
            { value: 'product_price_desc', label: t('price-desc') }
          ]}
        />
      </div>
      <CustomRefinementList key="facets-list-1" title={t('category')} attribute="categories" />
      <CustomRefinementList key="facets-list-2" title={t('collection')} attribute="collections" />
      <CustomRefinementList key="facets-list-3" title={t('brand')} attribute="brands" />
    </div>
  );

  return (
    <div className="search">
      <h1 className="search__title">
        {t('search')}
      </h1>
      <label htmlFor="checkbox" className="search__facetstoggle epbtn --bordered">
        {t('filter')}
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
