import React, { useContext } from "react";
import { ProductMainImage } from "./ProductMainImage";
import { useTranslation } from "./app-state";
import { useResolve } from "./hooks";
import { getProductsByIds } from "./service";
import { APIErrorContext } from "./APIErrorProvider";

import "./OrderDetailsTable.scss";
import { Link } from "react-router-dom";

interface OrderDetailsTableParams {
  orderData: any;
  orderItems: moltin.OrderItem[];
}

interface OrderItemWithProductData extends moltin.OrderItem {
  productData: moltin.Product;
}

export const OrderDetailsTable: React.FC<OrderDetailsTableParams> = ({
  orderData,
  orderItems,
}) => {
  const { t } = useTranslation();
  const { addError } = useContext(APIErrorContext);

  const [products] = useResolve(async () => {
    try {
      const orderProducts = orderData.relationships.items.data.map(
        (orderItem: { id: string }) => {
          return orderItems.find((item) => orderItem.id === item.id);
        }
      );
      const ids = orderProducts.reduce(
        (acum: string[], orderProduct: { product_id: string }) =>
          (acum = [...acum, orderProduct.product_id]),
        []
      );

      const products: moltin.Product[] = await getProductsByIds(ids);
      return orderProducts.map((item: moltin.OrderItem) => ({
        ...item,
        productData: products.find((product) => product.id === item.product_id),
      }));
    } catch (error) {
      addError(error.errors);
    }
  }, [orderData, addError, orderItems]);

  return (
    <div className="orderdetailstable__details">
      <div className="orderdetailstable__body">
        <div className="orderdetailstable__title">{t("summary")}</div>
        <table className="orderdetailstable__table">
          <tbody>
            <tr className="orderdetailstable__tr">
              <td className="orderdetailstable__td">{t("status")}:</td>
              <td className="orderdetailstable__td">{orderData.status}</td>
            </tr>
            <tr className="orderdetailstable__tr">
              <td className="orderdetailstable__td">{t("order-tax-total")}:</td>
              <td className="orderdetailstable__td">
                {orderData.meta.display_price.tax.formatted}
              </td>
            </tr>
            <tr className="orderdetailstable__tr">
              <td className="orderdetailstable__td">
                {t("order-purchase-date")}:
              </td>
              <td className="orderdetailstable__td">
                {orderData.meta.timestamps.created_at}
              </td>
            </tr>
            <tr className="py-4">
              <td className="orderdetailstable__td">{t("order-total")}:</td>
              <td className="orderdetailstable__td">
                {orderData.meta.display_price.with_tax.formatted}
              </td>
            </tr>
          </tbody>
        </table>
        <div className="orderdetailstable__details">
          <div className="orderdetailstable__addresses">
            <span className="orderdetailstable__title">
              {t("shipping-address")}
            </span>
            <div className="orderdetailstable__block">
              <div>
                {orderData.shipping_address.first_name}{" "}
                {orderData.shipping_address.last_name}
              </div>
              <div>{orderData.shipping_address.line_1}</div>
              <div>
                {orderData.shipping_address.city},{" "}
                {orderData.shipping_address.county},{" "}
                {orderData.shipping_address.country}
              </div>
              <div>{orderData.shipping_address.postcode}</div>
            </div>
          </div>
          <div className="orderdetailstable__addresses">
            <span className="orderdetailstable__title">
              {t("billing-address")}
            </span>
            <div className="orderdetailstable__block">
              <div>
                {orderData.billing_address.first_name}{" "}
                {orderData.billing_address.last_name}
              </div>
              <div>{orderData.billing_address.line_1}</div>
              <div>
                {orderData.billing_address.city},{" "}
                {orderData.billing_address.county},{" "}
                {orderData.billing_address.country}
              </div>
              <div>{orderData.billing_address.postcode}</div>
            </div>
          </div>
        </div>
        {products && (
          <>
            <div className="orderdetailstable__title">{t("items")}</div>
            <ul className="orderdetailstable__items">
              {products.map((product: OrderItemWithProductData) => (
                <li className="orderdetailstable__item" key={product.sku}>
                  <div className="orderdetailstable__itemimage">
                    <ProductMainImage product={product.productData} />
                  </div>
                  <table className="orderdetailstable__table">
                    <tbody>
                      <tr className="orderdetailstable__tr">
                        <td className="orderdetailstable__td">{t("name")}:</td>
                        <td className="orderdetailstable__td">
                          <Link to={`/product/${[product.sku]}`}>
                            {product.name}
                          </Link>
                        </td>
                      </tr>
                      <tr className="orderdetailstable__tr">
                        <td className="orderdetailstable__td">
                          {t("quantity")}:
                        </td>
                        <td className="orderdetailstable__td">
                          {product.quantity}
                        </td>
                      </tr>
                      <tr className="orderdetailstable__tr">
                        <td className="orderdetailstable__td">
                          {t("sub-total")}:
                        </td>
                        <td className="orderdetailstable__td">
                          {
                            product.meta?.display_price?.without_tax?.value
                              .formatted
                          }
                        </td>
                      </tr>
                      <tr className="orderdetailstable__tr" key={product.sku}>
                        <td className="orderdetailstable__td">{t("tax")}:</td>
                        <td className="orderdetailstable__td">
                          {product.meta?.display_price?.tax?.value.formatted}
                        </td>
                      </tr>
                      <tr className="orderdetailstable__tr">
                        <td className="orderdetailstable__td">
                          {t("item-total")}:
                        </td>
                        <td className="orderdetailstable__td">
                          {
                            product.meta?.display_price?.with_tax?.value
                              .formatted
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};
