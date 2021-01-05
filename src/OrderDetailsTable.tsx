import React, { useContext, useEffect, useState } from "react";
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
  modalUI?:boolean;
}

interface OrderItemWithProductData extends moltin.OrderItem {
  productData: moltin.Product;
}

export const OrderDetailsTable: React.FC<OrderDetailsTableParams> = ({
  orderData,
  orderItems,
  modalUI,
}) => {
  const { t } = useTranslation();
  const { addError } = useContext(APIErrorContext);
  const { updateCartItems, setOpenModal, handlePartialAddMessage, setPartialAddMessage } = useCartData();
  const { updateCartData } = useMultiCartData();

  const [showLoader, setShowLoader] = useState(false);
  const [className, setClassName] = useState("orderdetailstable")

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
        updateCartItems();
        updateCartData();
        setOpenModal(true);
        setShowLoader(false);
        const errorsContainer = res.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}`)).join('\n');
        handlePartialAddMessage(errorsContainer);
      }).catch( (error) => {
        console.error(error);
        setShowLoader(false);
    }) 
  }
  useEffect(() => {
    if(modalUI)
      setClassName("modalUI")
    else
      setClassName("orderdetailstable")
  }, [modalUI])

  return (
    <div className={`${className}__details`}>
      <div className={`${className}__header`}>
        <div className={`${className}__title`}>
          <h1>{t("orderid")} : {orderData.id}</h1>
          <p>Placed at: {orderData.meta.timestamps.created_at.replace("T", " - ")}</p>
        </div>
        <button className={`${className}__reorderbutton`} onClick={reOrder}>
          {!showLoader ? t("re-order") : <div className="circularLoader" />}
        </button>
      </div>
      <div className={`${className}__body`}>
      <button className={`${className}__reorderbuttonmobile`} onClick={reOrder}>
          {!showLoader ? t("re-order") : <div className="circularLoader" />}
        </button>
        {products && (
          <div className={`${className}__ordersitemsdetail`}>
            <div className={`${className}__itemsheaderwrapper`}>
              <h3 className={`${className}__itemsheader`}>{t("product")}</h3>
              <h3 className={`${className}__itemsheader`}>{t("sku")}</h3>
              <h3 className={`${className}__itemsheader`}>{t("price")}</h3>
              <h3 className={`${className}__itemsheader`}>{t("quantity")}</h3>
              <h3 className={`${className}__itemsheader`}>{t("total")}</h3>
            </div>
            <ul className={`${className}__items`}>
              {products.map((product: OrderItemWithProductData) => (
                <li className={`${className}__item`} key={product.sku}>
                  <div className={`${className}__itemimage`}>
                    <ProductMainImage product={product.productData} />
                    <Link to={`/product/${[product.sku]}`} className={`${className}__name`}>
                      {product.name}
                    </Link>
                  </div>
                  <Link to={`/product/${[product.sku]}`} className={`${className}__productname`}>
                      {product.name}
                    </Link>
                  <div className={`${className}__productsku`}>
                    <span className={`${className}__titlespan`}>{t("sku")}: </span>{product.sku}
                  </div>
                  <div className={`${className}__productprice`}>
                    <span className={`${className}__titlespan`}>{t("price")}: </span>
                    {
                      product.meta?.display_price?.without_tax?.value.formatted
                    }
                  </div>
                  <div className={`${className}__productquantity`}>
                    <span className={`${className}__titlespan`}>{t("quantity")}: </span>{product.quantity}
                  </div>
                  <div className={`${className}__producttotal`}>
                    <span className={`${className}__titlespan`}>{t("total")}: </span>
                    {
                      product.meta?.display_price?.with_tax?.value.formatted
                    }
                  </div>
                </li>
              ))}
            </ul>
            <div className={`${className}__taxprice`}>
                <h1 className={`${className}__totalpricetitle`}>{t("tax")}</h1>
                <h1 className={`${className}__taxpricenum`}>{orderData.meta?.display_price?.tax.formatted}</h1>
            </div>
            <div className={`${className}__totalprice`}>
                <h1 className={`${className}__totalpricetitle`}>{t("total")}</h1>
                <h1 className={`${className}__totalpricenum`}>{orderData.meta?.display_price?.with_tax.formatted}</h1>
            </div>
          </div>
        )}
        <div className={`${className}__addrressdetails`}>
          <div className={`${className}__addresses`}>
            <span className={`${className}__addresstitle`}>
              {t("billing-address")}
            </span>
            <div className={`${className}__block`}>
              <div className={`${className}__status`}>
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
          <div className={`${className}__addresses`}>
            <span className={`${className}__addresstitle`}>
              {t("shipping-address")}
            </span>
            <div className={`${className}__block`}>
              <div className={`${className}__status`}>
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
