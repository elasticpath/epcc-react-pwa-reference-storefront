import React from 'react';
import * as moltin from '@moltin/sdk';
import { loadImageHref } from './service';
import { useResolve } from './hooks';
import { ImageContainer } from './ImageContainer';

interface ProductMainImageProps {
  product: moltin.Product;
  size?: number;
}

export const ProductMainImage: React.FC<ProductMainImageProps> = (props) => {
  const productMainImageId = props.product?.relationships?.main_image?.data?.id;
  const [productImageUrl] = useResolve(() => productMainImageId ? loadImageHref(productMainImageId) : undefined, [productMainImageId]);
  const productBackground = props.product?.background_color ?? '';

  return (
    <>
      {productImageUrl && (
        <ImageContainer
        imgClassName="productmainimage"
        imgUrl={productImageUrl}
        alt={props.product.name}
        imageStyle={{ width: props.size, height: props.size, objectFit: 'fill', backgroundColor: productBackground }}
        />
      )}
    </>
  );
};

