import React from 'react';
import { ImageContainer } from './ImageContainer';
import { useTranslation } from './app-state';

import './HomeB2b.scss'

import bannerImage from './images/site-images/b2b-banner.jpg';

const bannerFileName = 'b2b-banner';

export const HomeB2b: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="homeb2b">
      <section className="homeb2b__banner">
        <ImageContainer imgUrl={bannerImage} alt={bannerFileName} imgClassName="homeb2b__bannerimage" />
        <div className="homeb2b__bannerwrap">
          <div className="container">
            <h1 className="homeb2b__bannerheading">{t('b2b-home-1-heading')}</h1>
            <div className="homeb2b__bannertxt">
              <p>{t('b2b-home-1-content')}</p>
              <button type="button" className="epbtn --secondary">{t('learn-more')}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="homeb2b__goods">
        <div className="container">
          <div className="homeb2b__goodswrap">
            <ul className="homeb2b__goodsgrid">
              <li className="homeb2b__goodscell">
                <p className="homeb2b__goodstitlesmall">{t('products')}</p>
                <p className="homeb2b__goodstitle">{t('b2b-home-2-heading')}</p>
                <p className="homeb2b__goodsdesc">{t('b2b-home-2-content')}</p>
              </li>
              <li className="homeb2b__goodscell">
                <p className="homeb2b__goodstitlesmall">{t('products')}</p>
                <p className="homeb2b__goodstitle">{t('b2b-home-3-heading')}</p>
                <p className="homeb2b__goodsdesc">{t('b2b-home-3-content')}</p>
              </li>
              <li className="homeb2b__goodscell">
                <p className="homeb2b__goodstitlesmall">{t('products')}</p>
                <p className="homeb2b__goodstitle">{t('b2b-home-4-heading')}</p>
                <p className="homeb2b__goodsdesc">
                  {t('b2b-home-4-content')}
                </p>
              </li>
            </ul>

            <div className="homeb2b__goodscell homeb2b__goodsblock">
              <p className="homeb2b__goodstitlesmall">{t('services')}</p>
              <p className="homeb2b__goodstitle">{t('b2b-home-5-heading')}</p>
              <p className="homeb2b__goodsdesc">
                {t('b2b-home-5-content')}
              </p>
            </div>

            <div className="homeb2b__goodscell homeb2b__goodsblock homeb2b__goodsblockbottom">
              <h2 className="homeb2b__goodsheading">{t('b2b-home-6-heading')}</h2>
              <p className="goods-description">
                {t('b2b-home-6-content')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

