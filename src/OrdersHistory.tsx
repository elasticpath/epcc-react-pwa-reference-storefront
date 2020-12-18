import React, { useCallback, useEffect, useState } from 'react';
import * as moltin from '@moltin/sdk';
import { Link } from 'react-router-dom';
import { useOrdersData, useTranslation, useCartData , useMultiCartData} from './app-state';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';
import useOnclickOutside from 'react-cool-onclickoutside';
import { bulkAdd} from "./service";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';


import './OrdersHistory.scss';

export const OrdersHistory: React.FC = () => {
  const { t } = useTranslation();
  const { ordersData, ordersItemsData: items} = useOrdersData();
  const { updateCartItems, setOpenModal } = useCartData();
  const { updateCartData } = useMultiCartData();

  const [sortedOrder, setSortedOrder] = useState(ordersData)
  const [dateDropDownOpen, setDateDropDownOpen] = useState(false);
  const [ascending, setAscending] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [reorderConfirmation, setReorderConfirmation] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState("");
 
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
      const dateFilterOrders = ordersData.filter((order:moltin.Order) => Date.parse(order.meta.timestamps.created_at) > startDate );
      setSortedOrder(dateFilterOrders)
  }, [ordersData])

  const ref = useOnclickOutside(() => {
    setDateDropDownOpen(false);
  });
  const reOrder = () => {
    setShowLoader(true);
    const mcart = localStorage.getItem('mcart') || '';
    const data = [{
      type: "order_items",
      order_id: activeOrderId,
    }];

    bulkAdd(mcart, data)
      .then(() => {
        updateCartItems();
        updateCartData();
        setOpenModal(true);
        setShowLoader(false);
        setReorderConfirmation(false);
        setActiveOrderId("");
      }).catch( (error) => {
        console.error(error);
        setShowLoader(false);
        setReorderConfirmation(false);
        setActiveOrderId("");
      }) 
    }
    const ReOrderConfirmation = (orderId:string) => {
      setReorderConfirmation(true);
      setActiveOrderId(orderId);
    }
  useEffect(() => {
   
    filterByDate();
  }, [filterByDate])

  return (
    <div className="ordershistory">
      <h1 className="ordershistory__title">{t('orders')}</h1>
      <div className="ordershistory__searchfilterbar">
        <button className="ordershistory__searchfilterbar --mbldate" onClick={sortByDate}>
          <span>{t('date')}</span>
          <span>
            <CaretIcon
              className={`ordershistory__sortbydatecaret ${
                ascending ? "--rotated" : ""
              }`}
            />
          </span> 
        </button>
        <div className="ordershistory__datedropdown">
          <span className="--showheader">Show</span>
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
              <div>
                <div className="ordershistory__bgdatedropdowncontent"></div>
                <div className="ordershistory__datedropdowncontent">
                  <div className="ordershistory__datedropdowndonebtn">
                    <p>Show</p>
                    <button onClick={() => setDateDropDownOpen(false)}>Done</button>
                  </div>
                  {dateDropDown.map((date, id) => (
                    <button className="ordershistory__datedropdownbtn" key={id} onClick={() => filterByDate(date, id)}> 
                      {t(date)}
                    </button>
                  ))}
                </div>
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
                <button className="ordershistory__detail ordershistory__button" onClick={() => ReOrderConfirmation(order.id)}>{t('re-order')}</button>
              </div>             
            ))}
            <div className={reorderConfirmation ? "ordershistory__confirmation --show" : "--hide"} >
              <div className="ordershistory__confirmationmessage">
                <div className="--reorder">
                 <h1 >{t('re-order')}</h1>
                 <CloseIcon onClick={() => {setReorderConfirmation(false); setActiveOrderId("")}}/>
                </div>
                
                <p>Would you like to add re-order {activeOrderId} ?</p>
                <button className="ordershistory__reorderbtn" onClick={reOrder}>{!showLoader ? t("re-order") : <div className="circularLoader" />}</button>
                <button className="ordershistory__cancelbtn" onClick={() => {setReorderConfirmation(false); setActiveOrderId("")}}>cancel</button>
              </div>

            </div>
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
