import React, {useContext} from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ReactComponent as ArrowLeft } from './images/icons/arrow_left.svg';
import { useTranslation } from './app-state';
import { getProductsByIds } from './service';
import { useResolve } from './hooks';
import { APIErrorContext } from './APIErrorProvider';
import { ProductMainImage } from './ProductMainImage';

import './OrderDetails.scss';

interface LocationState {
  order: any;
  items: moltin.OrderItem[];
}

interface OrderItemWithProductData extends moltin.OrderItem {
  productData: moltin.Product
}

export const OrderDetails: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation<LocationState>();
  const orderData = location?.state?.order;
  const itemsData = location?.state?.items;
  const { addError } = useContext(APIErrorContext);

  const [products] = useResolve(async () => {
    try {
      const orderProducts = orderData.relationships.items.data.map(
        (orderItem: { id: string }) => {
          return itemsData.find((item) => orderItem.id === item.id);
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
  }, [orderData, addError, itemsData]);

  return (
    <div className="orderdetail container">
      <Link to="/account/purchase-history" className="orderdetail__link">
        <ArrowLeft />
        {t('back')}
      </Link>
      <h1 className="orderdetail__title --main">{t('purchase-details')}</h1>
      {orderData && (
        <div className="orderdetail__details">
          <div className="orderdetail__body">
            <div className="orderdetail__title">{t('summary')}</div>
            <table className="orderdetail__table">
              <tbody>
              <tr className="orderdetail__tr">
                <td className="orderdetail__td">{t('status')}:</td>
                <td className="orderdetail__td">{orderData.status}</td>
              </tr>
              <tr className="orderdetail__tr">
                <td className="orderdetail__td">{t('order-tax-total')}:</td>
                <td className="orderdetail__td">
                  {orderData.meta.display_price.tax.formatted}
                </td>
              </tr>
              <tr className="orderdetail__tr">
                <td className="orderdetail__td">{t('order-purchase-date')}:</td>
                <td className="orderdetail__td">
                  {orderData.meta.timestamps.created_at}
                </td>
              </tr>
              <tr className="py-4">
                <td className="orderdetail__td">{t('order-total')}:</td>
                <td className="orderdetail__td">
                  {orderData.meta.display_price.with_tax.formatted}
                </td>
              </tr>
              </tbody>
            </table>
            <div className="orderdetail__details">
              <div className="orderdetail__addresses">
                <span className="orderdetail__title">{t('shipping-address')}</span>
                <div className="orderdetail__block">
                  <div>
                    {orderData.shipping_address.first_name}{' '}
                    {orderData.shipping_address.last_name}
                  </div>
                  <div>{orderData.shipping_address.line_1}</div>
                  <div>
                    {orderData.shipping_address.city},{' '}
                    {orderData.shipping_address.county},{' '}
                    {orderData.shipping_address.country}
                  </div>
                  <div>{orderData.shipping_address.postcode}</div>
                </div>
              </div>
              <div className="orderdetail__addresses">
                <span className="orderdetail__title">{t('billing-address')}</span>
                <div className="orderdetail__block">
                  <div>
                    {orderData.billing_address.first_name}{' '}
                    {orderData.billing_address.last_name}
                  </div>
                  <div>{orderData.billing_address.line_1}</div>
                  <div>
                    {orderData.billing_address.city},{' '}
                    {orderData.billing_address.county},{' '}
                    {orderData.billing_address.country}
                  </div>
                  <div>{orderData.billing_address.postcode}</div>
                </div>
              </div>
            </div>
            <div className="orderdetail__title">{t('items')}</div>
            {products && (<ul className="orderdetail__items">
              {products.map((product: OrderItemWithProductData) => (
                <li className="orderdetail__item" key={product.sku}>
                  <div className="orderdetail__itemimage">
                    <ProductMainImage product={product.productData}/>
                  </div>
                  <table className="orderdetail__table">
                    <tbody>
                    <tr className="orderdetail__tr">
                      <td className="orderdetail__td">{t('name')}:</td>
                      <td className="orderdetail__td">
                        {product.name}
                      </td>
                    </tr>
                    <tr className="orderdetail__tr">
                      <td className="orderdetail__td">{t('quantity')}:</td>
                      <td className="orderdetail__td">
                        {product.quantity}
                      </td>
                    </tr>
                    <tr className="orderdetail__tr">
                      <td className="orderdetail__td">{t('sub-total')}:</td>
                      <td className="orderdetail__td">
                        {product.meta?.display_price?.without_tax?.value.formatted}
                      </td>
                    </tr>
                    <tr className="orderdetail__tr" key={product.sku}>
                      <td className="orderdetail__td">{t('tax')}:</td>
                      <td className="orderdetail__td">
                        {product.meta?.display_price?.tax?.value.formatted}
                      </td>
                    </tr>
                    <tr className="orderdetail__tr">
                      <td className="orderdetail__td">{t('item total')}:</td>
                      <td className="orderdetail__td">
                        {product.meta?.display_price?.with_tax?.value.formatted}
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </li>
              ))}
            </ul>)}
          </div>
        </div>
      )}
    </div>
  )
};
