import React from 'react';
import { Product } from './service';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { CompareCheck } from './CompareCheck';

import './ProductThumbnail.scss';
import { ProductMainImage } from './ProductMainImage';


interface ProductThumbnailProps {
  product: Product;
}

export const ProductThumbnail: React.FC<ProductThumbnailProps> = (props) => {
  const productUrl = createProductUrl(props.product.slug);

  return (
    <div className="productthumbnail">
      <div className="productthumbnail__imgcontainer">
        <Link className="productthumbnail__imglink" to={productUrl} aria-label="productthumbnail__imglink">
          <ProductMainImage product={props.product} size={160} />
        </Link>
      </div>
      <div className="productthumbnail__name">
        <Link className="productthumbnail__namelink" to={productUrl} aria-label="productthumbnail__namelink">
          {props.product.name}
        </Link>
      </div>
      <div className="productthumbnail__price">
        {props.product.meta.display_price.without_tax.formatted}
      </div>
      <div className="productthumbnail__availability">
        {props.product.meta.stock.availability === 'in-stock' ? 'Available' : 'Out of stock'}
      </div>
      <div className={`productthumbnail__comparecheck`}>
        <CompareCheck product={props.product} />
      </div>
    </div>
  );
};
