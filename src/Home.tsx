import React from 'react';
import { ImageContainer } from './ImageContainer';
import { useTranslation } from './app-state';

import './Home.scss'

import bannerImage1 from './images/site-images/b2c-banner-1.png';
import bannerImage2 from './images/site-images/b2c-banner-2.png';
import bannerImage3 from './images/site-images/b2c-banner-3.png';
import productImage1 from './images/site-images/b2c-product-1.png';
import productImage2 from './images/site-images/b2c-product-2.png';
import productImage3 from './images/site-images/b2c-product-3.png';
import productImage4 from './images/site-images/b2c-product-4.png';
import productImage5 from './images/site-images/b2c-product-5.png';
import productImage6 from './images/site-images/b2c-product-6.png';
import productImage7 from './images/site-images/b2c-product-7.png';

const bannerFileName1 = 'b2c-banner-1';
const bannerFileName2 = 'b2c-banner-2';
const bannerFileName3 = 'b2c-banner-3';
const productFileName1 = 'b2c-product-1';
const productFileName2 = 'b2c-product-2';
const productFileName3 = 'b2c-product-3';
const productFileName4 = 'b2c-product-4';
const productFileName5 = 'b2c-product-5';
const productFileName6 = 'b2c-product-6';
const productFileName7 = 'b2c-product-7';

export const Home: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="home-page-b2c">
      <section className="main-banner">
        <ImageContainer imgUrl={bannerImage1} alt={bannerFileName1} imgClassName="main-banner-image" />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h1 className="goods-heading">{t('home-1-heading')}</h1>
            <div className="main-banner-txt">
              <p className="goods-description">{t('home-1-content')}</p>
              <div className="btn-wrap">
                <button type="button" className="epbtn primary learn-more-btn">{t('learn-more')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="goods-section-1">
        <div className="container">
          <div className="main-goods ">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-2-subheading')}</p>
                    <p className="goods-title">{t('home-2-heading')}</p>
                    <div className="btn-wrap">
                      <button type="button" className="epbtn primary learn-more-btn">{t('learn-more')}</button>
                    </div>
                  </div>
                  <ImageContainer imgUrl={productImage1} alt={productFileName1} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-3-subheading')}</p>
                    <p className="goods-title">{t('home-3-heading')}</p>
                    <p className="goods-description">{t('home-3-content')}</p>
                    <button type="button" className="epbtn primary learn-more-btn">{t('add-to-cart')}</button>
                  </div>
                  <ImageContainer imgUrl={productImage2} alt={productFileName2} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-4-subheading')}</p>
                    <p className="goods-title">{t('home-4-heading')}</p>
                    <p className="goods-description">{t('home-4-content')}</p>
                    <button type="button" className="epbtn primary learn-more-btn">{t('ice-cream-makers')}</button>
                  </div>
                  <ImageContainer imgUrl={productImage3} alt={productFileName3} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-5-subheading')}</p>
                    <p className="goods-title">{t('home-5-heading')}</p>
                    <p className="goods-description">{t('home-5-content')}</p>
                  </div>
                  <ImageContainer imgUrl={productImage4} alt={productFileName4} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-6-subheading')}</p>
                    <p className="goods-title">{t('home-6-heading')}</p>
                  </div>
                  <ImageContainer imgUrl={productImage5} alt={productFileName5} imgClassName="main-goods-image" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-2">
        <ImageContainer imgUrl={bannerImage2} alt={bannerFileName2} imgClassName="main-banner-image" />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h2 className="goods-heading">{t('home-7-heading')}</h2>
            <div className="main-banner-txt">
              <p className="goods-description">{t('home-7-content')}</p>
              <div className="btn-wrap">
                <button type="button" className="epbtn primary learn-more-btn">{t('learn-more')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="goods-section-2">
        <div className="container">
          <h2 className="main-goods-title">{t('quality-blenders')}</h2>
          <div className="main-goods">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-8-subheading')}</p>
                    <p className="goods-title">{t('home-8-heading')}</p>
                    <p className="goods-description">{t('home-8-content')}</p>
                  </div>
                  <ImageContainer imgUrl={productImage6} alt={productFileName6} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-9-subheading')}</p>
                    <p className="goods-title">{t('home-9-heading')}</p>
                    <p className="goods-description">{t('home-9-content')}</p>
                  </div>
                  <ImageContainer imgUrl={productImage7} alt={productFileName7} imgClassName="main-goods-image" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="main-banner banner-section-3">
        <ImageContainer imgUrl={bannerImage3} alt={bannerFileName3} imgClassName="main-banner-image" />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h2 className="goods-heading">{t('home-10-heading')}</h2>
            <div className="main-banner-txt">
              <p className="goods-description">{t('home-10-content')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="goods-section-3">
        <div className="container">
          <div className="main-goods">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-11-subheading')}</p>
                    <p className="goods-title">{t('home-11-heading')}</p>
                    <p className="goods-description">{t('home-11-content-1')}</p>
                    <p className="goods-description">{t('home-11-content-2')}</p>
                    <div className="btn-wrap">
                      <button type="button" className="epbtn primary learn-more-btn">{t('bellvie-help')}</button>
                    </div>
                  </div>
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">{t('home-12-subheading')}</p>
                    <p className="goods-title">{t('home-12-heading')}</p>
                    <p className="goods-description">{t('home-12-content-1')}</p>
                    <p className="goods-description">{t('home-12-content-2')}</p>
                    <div className="btn-wrap">
                      <button type="button" className="epbtn primary learn-more-btn">{t('about')}</button>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

