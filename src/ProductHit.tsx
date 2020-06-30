import React from 'react';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { CompareCheck } from './CompareCheck';

import './ProductThumbnail.scss';
import { ProductMainImage } from './ProductMainImage';


interface Hit {
  amount: number,
  brands: string[],
  categories: string[],
  collections: string[],
  imgUrl: string,
  name: string,
  objectID: string,
  price: string,
  slug: string,
}

interface ProductThumbnailProps {
  hit: Hit;
}

export const ProductHit: React.FC<ProductThumbnailProps> = (props) => {
  const { slug, name, price, amount, imgUrl } = props.hit;
  const productUrl = createProductUrl(slug);

  return (
    <div className="productthumbnail">
      <div className="productthumbnail__imgcontainer">
        <Link className="productthumbnail__imglink" to={productUrl} aria-label={name}>
          <img
            className="productmainimage"
            src={imgUrl}
            style={{width: 160, height: 160, objectFit: 'fill' }}
            alt={name}
          />
        </Link>
      </div>
      <div className="productthumbnail__name">
        <Link className="productthumbnail__namelink" to={productUrl}>
          {name}
        </Link>
      </div>
      <div className="productthumbnail__price">
        {price}
      </div>
      <div className="productthumbnail__availability">
        {amount > 0 ? 'Available' : 'Out of stock'}
      </div>
      <div className={`productthumbnail__comparecheck`}>

      </div>
    </div>
  );
};
