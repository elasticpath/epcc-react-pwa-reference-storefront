
import React from 'react';
import { useTranslation } from './app-state';

function ShippingReturnsPage() {
  const { t } = useTranslation();

  return (
    <div className="viewport ui-container static-ui-container" data-region="viewPortRegion">
      <div>
        <div className="app-main static-contant-container" data-region="appMain">
          <div>
            <div className="static-container container">
              <div className="static-container-inner">
                <div className="static-title-container">
                  <div>
                    <h1 className="view-title">
                      {t('shipping-and-returns')}
                    </h1>
                  </div>
                </div>
                <div className="static-main-container">
                  <div className="static-container">
                    <span className="static-message">
                      {t('lorem-ipsum')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingReturnsPage;
