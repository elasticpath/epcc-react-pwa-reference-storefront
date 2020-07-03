import React from 'react';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';
import { Availability } from './Availability';


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
    <div className="product-hit">
      <div className="product-hit__imgcontainer">
        <Link className="product-hit__imglink" to={productUrl} aria-label={name}>
          <img
            className="product-hit__image"
            src={imgUrl}
            style={{width: 160, height: 160, objectFit: 'fill' }}
            alt={name}
          />
        </Link>
      </div>
      <div className="product-hit__name">
        <Link className="product-hit__namelink" to={productUrl}>
          {name}
        </Link>
      </div>
      <div className="product-hit__price">
        {price}
      </div>
      <Availability available={amount > 0} />
    </div>
  );
};
