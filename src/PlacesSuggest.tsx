import React from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import { config } from './config';
import './PlacesSuggest.scss';
import { useTranslation } from './app-state';

interface PlacesSuggestParams {
  route: string,
  onChange: any,
  label: any,
  onClear: any,
}

const options = {
  appId: config.algoliaPlacesAppId,
  apiKey: config.algoliaPlacesApiKey,
  type: ['city', 'address'],
  useDeviceLocation: false,
  style: false
};

export const PlacesSuggest: React.FC<PlacesSuggestParams> = (props) => {
  const { t } = useTranslation();
  const route = props.route.charAt(0).toUpperCase() + props.route.slice(1);

  return (
    <div className="algoliasearch">
      <div className="algoliasearch__title">{t('search-for-your-address', { route })}</div>
      <AlgoliaPlaces
        id="AlgoliaPlaces"
        options={options}
        placeholder={t('start-typing-an-address')}
        name="address"
        {...props}
      />
    </div>
  )
};
