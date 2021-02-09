import React from 'react';
import { CoveoSearchBar } from './CoveoSearchBar';
import { AlgoliaSearchBar } from './AlgoliaSearchBar';

import { config } from './config';

interface SearchBoxProps {
}

export const SearchBar: React.FC<SearchBoxProps> = () => {
  const renderSearchBar = () => {
    switch(config.searchProvider) {
      case 'coveo':
        return (<CoveoSearchBar />)
      case 'algolia':
        return (<AlgoliaSearchBar />)
      default:
        return (
          <div></div>
        )
    }
  }

  return (
    <div>
      {renderSearchBar()}
    </div>
  )
};
