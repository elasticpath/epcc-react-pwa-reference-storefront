import React, { useEffect, useRef } from 'react';
import { config } from './config';

import * as Coveo from 'coveo-search-ui';
import 'coveo-search-ui/bin/css/CoveoFullSearch.css';

import './CoveoSearchBar.scss';

export const CoveoSearchBar: React.FC = () => {
  const searchRef = useRef<any>(null);


  useEffect(() => {
    Coveo.SearchEndpoint.configureCloudV2Endpoint(config.coveoOrg, config.coveoApiKey);
    Coveo.initSearchbox(searchRef.current, "/search");
  }, [searchRef])

  return (
    <div>
      <div id="searchbox" ref={searchRef}>
        <div className="CoveoSearchbox searchbar">
          <div className="CoveoFieldSuggestions" data-query-override={`@source==${config.coveoSourceName}`} data-field="@name"></div>
        </div>
      </div>
    </div>
  );
};
