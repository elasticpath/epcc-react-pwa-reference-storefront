import React from "react";
import { useParams } from 'react-router-dom';
import { useResolve } from "./hooks";
import { loadProductBySlug, loadImageHref } from "./service";

import './Product.scss';


interface ProductParams {
  productSlug: string;
}

export const Product: React.FC = () => {
  const { productSlug } = useParams<ProductParams>();
  const [product] = useResolve(async () => loadProductBySlug(productSlug), [productSlug]);
  const productMainImageId = product?.relationships?.main_image?.data?.id;
  const [productImageUrl] = useResolve(() => productMainImageId ? loadImageHref(productMainImageId) : undefined, [productMainImageId]);
  const productBackground = product?.background_color ?? '';

  return (
    <div className="product">
      <div className="product__maincontainer">
        <div className="product__imgcontainer" style={{ backgroundColor: productBackground }}>
          {product && productImageUrl && (
            <img className="product__img" src={productImageUrl} alt={product.name} />
          )}
        </div>
        <div className="product__details">
          {product && (
            <>
              <h1 className="product__name">
                {product.name}
              </h1>
              <div className="product__price">
                {product.meta.display_price.without_tax.formatted}
              </div>
              <div className="product__availability">
                {product.meta.stock.availability === 'in-stock' ? 'Available' : 'Out of stock'}
              </div>
              <div className="product__separator"></div>
              <button className="product__addtocartbtn epbtn --primary --large">Add To Cart</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
