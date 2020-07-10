import React from 'react';
import { useParams } from 'react-router-dom';
import { useResolve } from './hooks';
import { loadProductBySlug } from './service';
import { CompareCheck } from './CompareCheck';
import { ProductMainImage } from './ProductMainImage';
import { useTranslation, useCurrency } from './app-state';
import { isProductAvailable } from './helper';
import { Availability } from './Availability';

import './Product.scss';


interface ProductParams {
  productSlug: string;
}

export const Product: React.FC = () => {
  const { productSlug } = useParams<ProductParams>();
  const { selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const [product] = useResolve(
    async () => loadProductBySlug(productSlug, selectedLanguage, selectedCurrency),
    [productSlug, selectedLanguage, selectedCurrency]
  );

  return (
    <div className="product">
      {product && (
        <div className="product__maincontainer">
          <div className="product__imgcontainer">
            <ProductMainImage product={product} size={400} />
          </div>
          <div className="product__details">
            <h1 className="product__name">
              {product.name}
            </h1>
            <div className="product__price">
              {product.meta.display_price.without_tax.formatted}
            </div>
            <Availability available={isProductAvailable(product)} />
            <div className="product__comparecheck">
              <CompareCheck product={product} />
            </div>
            <div className="product__separator"></div>
            <div className="product__moltinbtncontainer">
              <span
                className="moltin-buy-button"
                data-moltin-product-id={product.id}
              ></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
