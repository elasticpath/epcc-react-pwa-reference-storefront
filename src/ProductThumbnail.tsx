import React from 'react';
import { useResolve } from './hooks';
import { loadImageHref, Product } from './service';

import './ProductThumbnail.scss';
import { createProductUrl } from './routes';
import { Link } from 'react-router-dom';


interface ProductThumbnailProps {
  product: Product;
}

export const ProductThumbnail: React.FC<ProductThumbnailProps> = (props) => {
  const productMainImageId = props.product.relationships?.main_image?.data?.id;
  const productUrl = createProductUrl(props.product.slug);
  const [imageUrl] = useResolve(() => loadImageHref(productMainImageId), [productMainImageId]);

  return (
    <div className="productthumbnail">
      <div className="productthumbnail__imgcontainer" style={{ backgroundColor: props.product.background_color }}>
        <Link className="productthumbnail__imglink" to={productUrl}>
          {imageUrl && (
            <img className="productthumbnail__img" src={imageUrl} alt={props.product.name} />
          )}
        </Link>
      </div>
      <div className="productthumbnail__name">
        <Link className="productthumbnail__namelink" to={productUrl}>
          {props.product.name}
        </Link>
      </div>
      <div className="productthumbnail__price">
        {props.product.meta.display_price.without_tax.formatted}
      </div>
      <div className="productthumbnail__availability">
        {props.product.meta.stock.availability === 'in-stock' ? 'Available' : 'Out of stock'}
      </div>
    </div>
  );
};
