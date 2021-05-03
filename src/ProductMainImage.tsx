import React, { useContext } from 'react';
import * as moltin from '@moltin/sdk';
import { loadImageHref } from './service';
import { useResolve } from './hooks';
import { ImageContainer } from './ImageContainer';
import { APIErrorContext } from './APIErrorProvider';

interface ProductMainImageProps {
  product: moltin.Product;
  size?: number;
}

export const ProductMainImage: React.FC<ProductMainImageProps> = (props) => {
  const productMainImageId = props.product?.relationships?.main_image?.data?.id;
  const { addError } = useContext(APIErrorContext);
  const [productImageUrl] = useResolve(
    async () => {
      try {
        if (productMainImageId) {
          return loadImageHref(productMainImageId)
        }
      } catch (error) {
        addError(error.errors);
      }
    },
    [productMainImageId, addError]
  );
  const productBackground = props.product?.background_color ?? '';

  return (
    <>
      {productImageUrl ? (
        <ImageContainer
        imgClassName="productmainimage"
        imgUrl={productImageUrl}
        alt={props.product.name}
        imageStyle={{ width: props.size, height: props.size, objectFit: 'fill', backgroundColor: productBackground }}
        />
      ) : (
        <div className="skeleton" style={{width: props.size || 180, height: props.size || 180}} />
      )}
    </>
  );
};

