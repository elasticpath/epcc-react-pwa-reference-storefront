import React, { useCallback, useEffect, useState } from 'react';
import * as moltin from '@moltin/sdk';
import { Link } from 'react-router-dom';
import { useOrdersData, useTranslation } from './app-state';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';
import useOnclickOutside from 'react-cool-onclickoutside';

import './OrdersHistory.scss';

export const OrdersHistory: React.FC = () => {
  const { t } = useTranslation();

  const { ordersData, ordersItemsData: items} = useOrdersData();
  const [sortedOrder, setSortedOrder] = useState(ordersData)
  const [dateDropDownOpen, setDateDropDownOpen] = useState(false);
  const [ascending, setAscending] = useState(false);
 
  const dateDropDown = ["last-6-months", "last-12-months", "last-18-months"];
  const [selectedDate, setSelectedDate] = useState(dateDropDown[0]);

  const handleSelectorClicked = () => {
    setDateDropDownOpen(!dateDropDownOpen);
  };

  const sortByDate = () => {
    const sortedOrderCopy = [...sortedOrder];
    if (ascending){
      const sortDateOrder = sortedOrderCopy.sort((a,b) => new Date(b.meta.timestamps.created_at).valueOf()  - new Date(a.meta.timestamps.created_at).valueOf());
      setAscending(!ascending)
      setSortedOrder(sortDateOrder) ;
    }
    else {
      const sortDateOrder = sortedOrderCopy.sort((a,b) => new Date(a.meta.timestamps.created_at).valueOf()  - new Date(b.meta.timestamps.created_at).valueOf());
      setAscending(!ascending)
      setSortedOrder(sortDateOrder);
    }
  }

  const filterByDate = useCallback((date:string = 'last-6-months', index:number = 0) => {
      setSelectedDate(date);
      setDateDropDownOpen(false);
      const endDate = new Date();
      const startDate =  endDate.setMonth(endDate.getMonth() - (6 * index + 6));
      const dateFilterOrders = ordersData.filter((order:any) => Date.parse(order.meta.timestamps.created_at) > startDate );
      setSortedOrder(dateFilterOrders)
  }, [ordersData])

  const ref = useOnclickOutside(() => {
    setDateDropDownOpen(false);
  });

  useEffect(() => {
    filterByDate();
  }, [filterByDate])

  return (
    <div className="ordershistory">
      <h1 className="ordershistory__title">{t('orders')}</h1>
      <div className="ordershistory__searchfilterbar">
        <div className="ordershistory__datedropdown">
          <span>Show</span>
          <div className="ordershistory__datedropdowncontainer" ref={ref}>
            <div className="ordershistory__datedropdownwrap">
              <button className={`ordershistory__datedropdowntoggle ${
                dateDropDownOpen ? " --open" : ""}`}
                onClick={handleSelectorClicked}
              >
                {t(selectedDate)}
                <CaretIcon
                  className={`ordershistory__dropdowncaret ${dateDropDownOpen ? "--rotatedcaret" : ""}`}
                />
              </button>
            </div>
            {dateDropDownOpen && (
              <div className="ordershistory__datedropdowncontent">
                {dateDropDown.map((date, id) => (
                  <button className="ordershistory__datedropdownbtn" key={id} onClick={() => filterByDate(date, id)}> 
                    {t(date)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        {1 ? (
          <div className="ordershistory__container">
            <div className="ordershistory__informationheader">
              <button className="ordershistory__informationtitle --date" onClick={sortByDate}>
                <span>{t('date')}</span>
                <span>
                  <CaretIcon
                    className={`ordershistory__sortbydatecaret ${
                      ascending ? "--rotated" : ""
                    }`}
                  />
                </span> 
              </button>
              <h3 className="ordershistory__informationtitle">{t('orderid')}</h3>
              <h3 className="ordershistory__informationtitle">{t('total')}</h3>
              <h3 className="ordershistory__informationtitle">{t('status')}</h3>
              <h3 className="ordershistory__informationtitle">{t('payment')}</h3>
              <h3 className="ordershistory__informationtitle">{t('action')}</h3>
            </div>
            {sortedOrder.map((order: moltin.Order)=> (
              <div className="ordershistory__ordersdetails" key={order.id}>
                <p className="ordershistory__detail --leftclmn">
                  {order.meta.timestamps.created_at.replace(/(.*?)T.*/i, "$1") }
                </p>
                <p className="ordershistory__detail --id">
                  <Link
                      to={{
                        pathname: `/orderdetails/${order.id}`,
                        state: { order, items }
                      }}
                      className="ordershistory__link"
                  >
                    <span className="ordershistory__detailtitle">{t('orderid')}:</span>
                    {order.id}
                  </Link>
                </p>
                <p className="ordershistory__detail --leftclmn">
                <span className="ordershistory__detailtitle">{t('total')}:</span>
                  {order.meta.display_price.with_tax.formatted}
                </p>
                <p className="ordershistory__detail --leftclmn">
                <span className="ordershistory__detailtitle">{t('status')}: </span>
                  {order.status}
                </p>
                <p className="ordershistory__detail --leftclmn">
                <span className="ordershistory__detailtitle">{t('payment')}:</span>
                  {order.payment}
                </p>
                <button className="ordershistory__detail ordershistory__button">{t('re-order')}</button>
              </div>             
            ))}
          </div>   
        ) : (
          <div>
            {t('no-purchase-message')}
          </div>
        )}
      </div>
    </div>
  )
};
