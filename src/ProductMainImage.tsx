import React from 'react';
import { Product, loadImageHref } from './service';
import { useResolve } from './hooks';

interface ProductMainImageProps {
  product: Product;
  size?: number;
}

export const ProductMainImage: React.FC<ProductMainImageProps> = (props) => {
  const productMainImageId = props.product?.relationships?.main_image?.data?.id;
  const [productImageUrl] = useResolve(() => productMainImageId ? loadImageHref(productMainImageId) : undefined, [productMainImageId]);
  const productBackground = props.product?.background_color ?? '';

  return (
    <>
      {productImageUrl && (
        <img
          className="productmainimage"
          src={productImageUrl}
          style={{ width: props.size, height: props.size, objectFit: 'fill', backgroundColor: productBackground }}
          alt={props.product.name}
        />
      )}
    </>
  );
};

