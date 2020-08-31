import React from 'react';
import AlgoliaPlaces from 'algolia-places-react';
import { config } from './config';
import './PlacesSuggest.scss';

interface PlacesSuggestParams {
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

  return (
    <div className="algoliasearch">
      <div className="algoliasearch__title">Search for your Shipping address</div>

      <AlgoliaPlaces
        id="AlgoliaPlaces"
        options={options}
        placeholder="Start typing an address"
        name="new-password"
        {...props}
      />
    </div>
  )
};
