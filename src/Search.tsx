import React from 'react';
import { AlgoliaSearch } from './AlgoliaSearch';
import { CoveoSearch } from './CoveoSearch';

import { config } from './config';

interface SearchParams  {
}

export const Search: React.FC<SearchParams> = () => {
  const renderSearch = () => {
    switch(config.searchProvider) {
      case 'coveo':
        return (<CoveoSearch />)
      case 'algolia':
        return (<AlgoliaSearch />)
      default:
        return (
          <p>Unsupported search provider</p>
        )
    }
  }

  return (
    <div>
      {renderSearch()}
    </div>
  )
};
