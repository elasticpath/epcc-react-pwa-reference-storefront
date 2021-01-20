import React from 'react';
import { AlgoliaSearch } from './AlgoliaSearch';
import { CoveoSearch } from './CoveoSearch';
import { useTranslation } from './app-state';
import { config } from './config';

interface SearchParams  {
}

export const Search: React.FC<SearchParams> = () => {
  const { t } = useTranslation();

  const renderSearch = () => {
    switch(config.searchProvider) {
      case 'coveo':
        return (<CoveoSearch />)
      case 'algolia':
        return (<AlgoliaSearch />)
      default:
        return (
        <p>{t('unsupported-search-message')}</p>
        )
    }
  }

  return (
    <div>
      {renderSearch()}
    </div>
  )
};
