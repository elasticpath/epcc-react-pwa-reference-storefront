import React from 'react';
import productImage1 from './images/b2c-product-1.png';
import productImage2 from './images/b2c-product-2.png';
import productImage3 from './images/b2c-product-3.png';

import './Home.scss'

export const Home: React.FC = () => {
  return (
    <div className="homepage">
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
                  <img src={productImage1} alt='' className="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Healthy</p>
                    <p className="goods-title">More flavours, more variety, more fun. </p>
                    <p className="goods-description">Make the most of your fresh ingredients with the 3X Bluicer Pro. This high performance blender juicer features our Kinetix® </p>
                    <button type="button" className="epbtn primary learn-more-btn">Add to cart</button>
                  </div>
                  <img src={productImage2} alt='' className="main-goods-image" />
                </div>
              </li>
              <li className="main-goods__cell">
                <div className="main-goods-wrap">
                  <div className="goods-info">
                    <p className="goods-title-small">Ice cream makers</p>
                    <p className="goods-title">Frozen treats with fresh ingredients. </p>
                    <p className="goods-description">
                      The Smart Scoop™ transforms the kitchen into your favorite scoop shop. The first ice cream maker to automatically sense the hardness of the mixture based on your selection.
                    </p>
                    <button type="button" className="epbtn primary learn-more-btn">Ice cream makers</button>
                  </div>
                  <img src={productImage3} alt='' className="main-goods-image" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

