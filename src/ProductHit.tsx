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
    <div className="producthit">
      <div className="producthit__imgcontainer">
        <Link className="producthit__imglink" to={productUrl} aria-label={name}>
          <img
            className="producthit__image"
            src={imgUrl}
            style={{width: 160, height: 160, objectFit: 'fill' }}
            alt={name}
          />
        </Link>
      </div>
      <div className="producthit__name">
        <Link className="producthit__namelink" to={productUrl}>
          {name}
        </Link>
      </div>
      <div className="producthit__price">
        {price}
      </div>
      <Availability available={amount > 0} />
    </div>
  );
};
