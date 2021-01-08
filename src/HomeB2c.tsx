import React from 'react';
import { ImageContainer } from './ImageContainer';
import { useTranslation } from './app-state';

import './HomeB2c.scss'

import bannerImage1 from './images/site-images/b2c-banner-1.jpeg';
import productImage1 from './images/site-images/b2c-product-1.jpeg';
import productImage2 from './images/site-images/b2c-product-2.jpeg';
import productImage3 from './images/site-images/b2c-product-3.jpeg';
import productImage4 from './images/site-images/b2c-product-4.png';
import productImage5 from './images/site-images/b2c-product-5.jpeg';

const bannerFileName1 = 'b2c-banner-1';
const productFileName1 = 'b2c-product-1';
const productFileName2 = 'b2c-product-2';
const productFileName3 = 'b2c-product-3';
const productFileName4 = 'b2c-product-4';
const productFileName5 = 'b2c-product-5';

export const HomeB2c: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="homeb2c">
      <section className="homeb2c__banner">
        <ImageContainer imgUrl={bannerImage1} alt={bannerFileName1} imgClassName="homeb2c__bannerimage" />
        <div className="homeb2c__bannerwrap">
          <div className="container">
            <h1 className="homeb2c__bannerheading">{t('home-1-heading')}</h1>
            <div className="homeb2c__bannertxt">
              <p>{t('home-1-content')}</p>
              <button type="button" className="epbtn --secondary">{t('learn-more')}</button>
            </div>
          </div>
        </div>
      </section>

      <section className="homeb2c__goodssection1">
        <div className="container">
          <div className="homeb2c__maingoods">
            <ul className="homeb2c__goodsgrid">
              <li className="homeb2c__goodscell">
                <div className="homeb2c__goodswrap">
                  <div className="homeb2c__goodsinfo">
                    <p className="homeb2c__titlesmall">{t('home-2-subheading')}</p>
                    <p className="homeb2c__title">{t('home-2-heading')}</p>
                    <div className="homeb2c__goodsbtns">
                      <button type="button" className="epbtn --secondary">{t('learn-more')}</button>
                    </div>
                  </div>
                  <ImageContainer imgUrl={productImage1} alt={productFileName1} imgClassName="homeb2c__goodsimage" />
                </div>
              </li>
              <li className="homeb2c__goodscell">
                <div className="homeb2c__goodswrap">
                  <div className="homeb2c__goodsinfo">
                    <p className="homeb2c__titlesmall">{t('home-3-subheading')}</p>
                    <p className="homeb2c__title">{t('home-3-heading')}</p>
                    <p className="homeb2c__description">{t('home-3-content')}</p>
                    <button type="button" className="epbtn --secondary">{t('add-to-cart')}</button>
                  </div>
                  <ImageContainer imgUrl={productImage2} alt={productFileName2} imgClassName="homeb2c__goodsimage" />
                </div>
              </li>
              <li className="homeb2c__goodscell">
                <div className="homeb2c__goodswrap">
                  <div className="homeb2c__goodsinfo">
                    <p className="homeb2c__titlesmall">{t('home-4-subheading')}</p>
                    <p className="homeb2c__title">{t('home-4-heading')}</p>
                    <p className="homeb2c__description">{t('home-4-content')}</p>
                    <button type="button" className="epbtn">{t('ice-cream-makers')}</button>
                  </div>
                  <ImageContainer imgUrl={productImage3} alt={productFileName3} imgClassName="homeb2c__goodsimage" />
                </div>
              </li>
              <li className="homeb2c__goodscell">
                <div className="homeb2c__goodswrap">
                  <div className="homeb2c__goodsinfo">
                    <p className="homeb2c__titlesmall">{t('home-5-subheading')}</p>
                    <p className="homeb2c__title">{t('home-5-heading')}</p>
                    <p className="homeb2c__description">{t('home-5-content')}</p>
                  </div>
                  <ImageContainer imgUrl={productImage4} alt={productFileName4} imgClassName="homeb2c__goodsimage" />
                </div>
              </li>
              <li className="homeb2c__goodscell">
                <div className="homeb2c__goodswrap">
                  <div className="homeb2c__goodsinfo">
                    <p className="homeb2c__titlesmall">{t('home-6-subheading')}</p>
                    <p className="homeb2c__title">{t('home-6-heading')}</p>
                  </div>
                  <ImageContainer imgUrl={productImage5} alt={productFileName5} imgClassName="homeb2c__goodsimage" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
