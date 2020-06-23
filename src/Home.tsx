import React from 'react';
import { ImageContainer } from './ImageContainer';

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
  return (
    <div className="home-page-b2c">
      <section className="main-banner">
        <ImageContainer imgUrl={bannerImage1} alt={bannerFileName1} imgClassName="main-banner-image" />
        <div className="main-banner-title-wrap">
          <div className="container">
            <h1 className="goods-heading">Go from bean to cup at the touch of a button</h1>
            <div className="main-banner-txt">
              <p className="goods-description">
                We offer a range of semi-automatic and automatic Espresso machines. Walks you through the process of choosing the ideal espresso machine for your home or office, including a detailed overview covering each type of machine to help with your selection.
              </p>
              <div className="btn-wrap">
                <button type="button" className="epbtn primary learn-more-btn">Learn more</button>
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
                    <p className="goods-title-small">Espresso Machines</p>
                    <p className="goods-title">Be your own Barista with your very own Espresso machine</p>
                    <div className="btn-wrap">
                      <button type="button" className="epbtn primary learn-more-btn">Learn more</button>
                    </div>
                  </div>
                  <ImageContainer imgUrl={productImage1} alt={productFileName1} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Healthy</p>
                    <p className="goods-title">More flavours, more variety, more fun.</p>
                    <p className="goods-description">Make the most of your fresh ingredients with the 3X Bluicer Pro. This high performance blender juicer features our Kinetix®</p>
                    <button type="button" className="epbtn primary learn-more-btn">Add to cart</button>
                  </div>
                  <ImageContainer imgUrl={productImage2} alt={productFileName2} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Ice cream makers</p>
                    <p className="goods-title">Frozen treats with fresh ingredients.</p>
                    <p className="goods-description">
                      The Smart Scoop™ transforms the kitchen into your favorite scoop shop. The first ice cream maker to automatically sense the hardness of the mixture based on your selection.
                    </p>
                    <button type="button" className="epbtn primary learn-more-btn">Ice cream makers</button>
                  </div>
                  <ImageContainer imgUrl={productImage3} alt={productFileName3} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Serving you</p>
                    <p className="goods-title">Free Shipping</p>
                    <p className="goods-description">
                      Free shipping on all orders of $50!
                    </p>
                  </div>
                  <ImageContainer imgUrl={productImage4} alt={productFileName4} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">New</p>
                    <p className="goods-title">
                      View Our Products in 360
                    </p>
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
            <h2 className="goods-heading">Immersion Blenders</h2>
            <div className="main-banner-txt">
              <p className="goods-description">
                VARIABLE MASHING LEG  - Select the texture of your mash with the Variable Mashing Leg, simply twist the adjustable head for fine, medium or coarse mashing texture.
              </p>
              <div className="btn-wrap">
                <button type="button" className="epbtn primary learn-more-btn">Learn more</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="goods-section-2">
        <div className="container">
          <h2 className="main-goods-title">Quality blenders</h2>
          <div className="main-goods">
            <ul className="main-goods__grid">
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Blenders</p>
                    <p className="goods-title">Our blenders were voted the best value 3 years in a row</p>
                    <p className="goods-description">“Bellevie is a quality blender maker that will process your ingredients into smooth, creamy perfection”</p>
                  </div>
                  <ImageContainer imgUrl={productImage6} alt={productFileName6} imgClassName="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Blenders</p>
                    <p className="goods-title">Stainless steel perfection</p>
                    <p className="goods-description">Our blenders are made with top of the line stainless steel. The appliances are built strong and to last. These appliances can wistand even the most active chefs kitchen.</p>
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
            <h2 className="goods-heading">The BellVie Difference</h2>
            <div className="main-banner-txt">
              <p className="goods-description">
                Food is life so why not take your cooking to the next level with BelleVie appliances. Our quality and pricing unmatched by our competitors. Cook like a chef from the comfort of your home.
              </p>
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
                    <p className="goods-title-small">Customers</p>
                    <p className="goods-title">Our commitment to you</p>
                    <p className="goods-description">At BelleVie the customer comes first. If you ever recieve a damaged product in the mail. Please email our support center to have this replaced at no extra cost to yourself.</p>
                    <p className="goods-description">See our policy for returns and exchanges here</p>
                    <div className="btn-wrap">
                      <button type="button" className="epbtn primary learn-more-btn">Bellvie Help</button>
                    </div>
                  </div>
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Company</p>
                    <p className="goods-title">BelleVie</p>
                    <p className="goods-description">BellVie is committed to the environment. We work with our suppliers whenever we can to minimize the impact to the environment. BelleVie works with only the best and most ethical factories to ensure our products are not only high quality but ethical.</p>
                    <p className="goods-description">Learn more in our about section</p>
                    <div className="btn-wrap">
                      <button type="button" className="epbtn primary learn-more-btn">About</button>
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

