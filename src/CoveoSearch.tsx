/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import * as Coveo from 'coveo-search-ui';
import 'coveo-search-ui/bin/css/CoveoFullSearch.css';
import 'coveo-search-ui/bin/js/templates/templates.js';

import './CoveoSearch.scss';
import { config } from './config';

export const CoveoSearch: React.FC = () => {
  const searchRef = useRef<any>(null);
  const history = useHistory();

  const getTemplateContent = () => {
    return `
    <div class="coveo-result-frame">
      <div class="coveo-result-cell" style="vertical-align: top;">
        <div class="coveo-result-row">
          <div class="coveo-result-cell" style="text-align:center">
            <a class='CoveoImageFieldValue' data-field="@imgUrl" data-height='200' data-width='200'></a>
          </div>
        </div>
        <div class="coveo-result-row" style="margin-top:0;">
          <div class="coveo-result-cell" style="font-size:16px; text-align:center" role="heading" aria-level="2">
            <a class="CoveoResultLink"></a>
          </div>
        </div>
        <div class="coveo-result-row" style="margin-top:10px;">
          <div class="coveo-result-cell" style="text-align:center">
            <span class="CoveoFieldValue" data-field="@price"></span>
          </div>
        </div>
      </div>
    </div>
    `
  }

  useEffect(() => {
    Coveo.SearchEndpoint.configureCloudV2Endpoint(config.coveoOrg, config.coveoApiKey);
    Coveo.init(searchRef.current, {
      ResultLink: {
        onClick: (e: any, result: any) => {
          e.preventDefault();
          if (result.raw.sku) {
            history.push(`/product/${result.raw.slug}`)
          }
        }
      }
    });
  }, [searchRef, history])

  return (
    <div id="search" className="CoveoSearchInterface" data-expression={`@source==${config.coveoSourceName}`} ref={searchRef} data-enable-history="true">
      <div className="CoveoFolding"></div>
      <div className="CoveoAnalytics"></div>
      <div className="coveo-search-section">
        <div className="CoveoSearchbox" data-enable-omnibox="true">
          <div className="CoveoFieldSuggestions" data-query-override={`@source==${config.coveoSourceName}`} data-field="@name"></div>
        </div>
      </div>
      <div className="coveo-main-section">
      <div className="coveo-facet-column">
        <div className="CoveoDynamicFacet" data-field="@collections" data-number-of-values="" data-title="Collection"></div>
        <div className="CoveoDynamicFacet" data-title="Categories" data-field="@categories"></div>
        <div className="CoveoDynamicFacet" data-title="Brands" data-field="@brands"></div>
      </div>
      <div className="coveo-results-column">
        <div className="CoveoShareQuery"></div>
        <div className="CoveoPreferencesPanel">
          <div className="CoveoResultsPreferences"></div>
          <div className="CoveoResultsFiltersPreferences"></div>
        </div>
        <div className="CoveoTriggers"></div>
        <div className="CoveoBreadcrumb"></div>
        <div className="CoveoDidYouMean"></div>
        <div className="coveo-results-header">
          <div className="coveo-summary-section">
            <span className="CoveoQuerySummary"><div className="coveo-show-if-no-results"></div></span>
            <span className="CoveoQueryDuration"></span>
          </div>
          <div className="coveo-result-layout-section">
            <span className="CoveoResultLayout"></span>
          </div>
          <div className="coveo-sort-section">
            <span className="CoveoSort" data-sort-criteria="relevancy" data-caption="Relevance"></span>
            <span className="CoveoSort" data-caption="Price" data-sort-criteria="@amount descending,@amount ascending"></span>
            <span className="CoveoSort" data-sort-criteria="date descending,date ascending" data-caption="Date"></span>
          </div>
        </div>
        <div className="CoveoHiddenQuery"></div>
        <div className="CoveoErrorReport" data-pop-up="false"></div>
        <div className="CoveoResultList" data-layout="card" data-wait-animation="fade" data-auto-select-fields-to-include="false">
          <script className="result-template" type="text/html" data-layout="card" dangerouslySetInnerHTML={{ __html: getTemplateContent() }}></script>
        </div>
        <div className="CoveoPager"></div>
        <div className="CoveoLogo"></div>
        <div className="CoveoResultsPerPage"></div>
      </div>
    </div>
    </div>
  );
};
