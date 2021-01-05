import React, { useContext, useState } from "react";
import { ProductMainImage } from "./ProductMainImage";
import { useTranslation, useCartData, useMultiCartData } from "./app-state";
import { useResolve } from "./hooks";
import { getProductsByIds , bulkAdd } from "./service";
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
  const { updateCartItems, setOpenModal, handlePartialAddMessage, setPartialAddMessage } = useCartData();
  const { updateCartData } = useMultiCartData();

  const [showLoader, setShowLoader] = useState(false);

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

  const reOrder = () => {
    setShowLoader(true);
    const mcart = localStorage.getItem('mcart') || '';
    const data=  [
      {
        type: 'order_items',
        order_id: orderData.id
      }
    ];
    setPartialAddMessage("");
    bulkAdd(mcart, data)
      .then((res:any) => {
        if(res.erros){
          const errorsContainer = res.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}`)).join('\n');
          handlePartialAddMessage(errorsContainer);
        }
        updateCartItems();
        updateCartData();
        setOpenModal(true);
        setShowLoader(false);
      }).catch( (error) => {
        console.error(error);
        setShowLoader(false);
    }) 
  }

  return (
    <div className="orderdetailstable__details">
      <div className="orderdetailstable__header">
        <div className="orderdetailstable__title">
          <h1>{t("orderid")} : {orderData.id}</h1>
          <p>Placed at: {orderData.meta.timestamps.created_at.replace("T", " - ")}</p>
        </div>
        <button className="orderdetailstable__reorderbutton" onClick={reOrder}>
          {!showLoader ? t("re-order") : <div className="circularLoader" />}
        </button>
      </div>
      <div className="orderdetailstable__body">
      <button className="orderdetailstable__reorderbuttonmobile" onClick={reOrder}>
          {!showLoader ? t("re-order") : <div className="circularLoader" />}
        </button>
        {products && (
          <div className="orderdetailstable-ordersitemsdetail">
            <div className="orderdetailstable__itemsheaderwrapper">
              <h3 className="orderdetailstable__itemsheader">{t("product")}</h3>
              <h3 className="orderdetailstable__itemsheader">{t("sku")}</h3>
              <h3 className="orderdetailstable__itemsheader">{t("price")}</h3>
              <h3 className="orderdetailstable__itemsheader">{t("quantity")}</h3>
              <h3 className="orderdetailstable__itemsheader">{t("total")}</h3>
            </div>
            <ul className="orderdetailstable__items">
              {products.map((product: OrderItemWithProductData) => (
                <li className="orderdetailstable__item" key={product.sku}>
                  <div className="orderdetailstable__itemimage">
                    <ProductMainImage product={product.productData} />
                    <Link to={`/product/${[product.sku]}`} className="orderdetailstable__name">
                      {product.name}
                    </Link>
                  </div>
                  <Link to={`/product/${[product.sku]}`} className="orderdetailstable__productname">
                      {product.name}hhhsgggbdfgdf
                    </Link>
                  <div className="orderdetailstable__productsku">
                    <span className="orderdetailstable__titlespan">{t("sku")}: </span>{product.sku}
                  </div>
                  <div className="orderdetailstable__productprice">
                    <span className="orderdetailstable__titlespan">{t("price")}: </span>
                    {
                      product.meta?.display_price?.without_tax?.value.formatted
                    }
                  </div>
                  <div className="orderdetailstable__productquantity">
                    <span className="orderdetailstable__titlespan">{t("quantity")}: </span>{product.quantity}
                  </div>
                  <div className="orderdetailstable__producttotal">
                    <span className="orderdetailstable__titlespan">{t("total")}: </span>
                    {
                      product.meta?.display_price?.with_tax?.value.formatted
                    }
                  </div>
                </li>
              ))}
            </ul>
            <div className="orderdetailstable__taxprice">
                <h1 className="orderdetailstable__totalpricetitle">{t("tax")}</h1>
                <h1 className="orderdetailstable__taxpricenum">{orderData.meta?.display_price?.tax.formatted}</h1>
            </div>
            <div className="orderdetailstable__totalprice">
                <h1 className="orderdetailstable__totalpricetitle">{t("total")}</h1>
                <h1 className="orderdetailstable__totalpricenum">{orderData.meta?.display_price?.with_tax.formatted}</h1>
            </div>
          </div>
        )}
        <div className="orderdetailstable__addrressdetails">
          <div className="orderdetailstable__addresses">
            <span className="orderdetailstable__addresstitle">
              {t("billing-address")}
            </span>
            <div className="orderdetailstable__block">
              <div className="orderdetailstable__status">
                {t("payment")} {t("status")}: {orderData.payment}
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
          <div className="orderdetailstable__addresses">
            <span className="orderdetailstable__addresstitle">
              {t("shipping-address")}
            </span>
            <div className="orderdetailstable__block">
              <div className="orderdetailstable__status">
              {t("order")} {t("status")}: {orderData.status}
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
        </div>
      </div>
    </div>
  );
};
