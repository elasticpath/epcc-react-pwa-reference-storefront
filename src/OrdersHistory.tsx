import React, { useCallback, useEffect, useState } from 'react';
import * as moltin from '@moltin/sdk';
import { Link, useParams } from 'react-router-dom';
import { useOrdersData, useTranslation, useCartData , useMultiCartData , useCurrency} from './app-state';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';
import useOnclickOutside from 'react-cool-onclickoutside';
import { bulkAdd } from "./service";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { OrdersPagination } from './OrdersPagination';
import { createOrdersHistoryUrl } from './routes';
import './OrdersHistory.scss';


interface OrderParams {
  categorySlug: string;
  pageNum?: string;
}

export const OrdersHistory: React.FC = () => {
  const params = useParams<OrderParams>();

  const { t, selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const { ordersData, ordersItemsData: items , total, setPageNum, currentPage, setDateIndex, setSort, sort, totalOrders } = useOrdersData();
  const { updateCartItems, setOpenModal, handlePartialAddMessage, setPartialAddMessage, partialAddConfirmation } = useCartData();
  const { updateCartData } = useMultiCartData();
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
    if(sort === "") {
      setSort("created_at");
      setAscending(true);
    }
    else {
      setSort("");
      setAscending(false);
    }
  }
  
  const filterByDate = useCallback((date:string = 'last-6-months', index:number = 0) => {
      setSelectedDate(date);
      setDateDropDownOpen(false);
      setDateIndex(index);
  }, [setDateIndex]);

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
    setPartialAddMessage("");
    bulkAdd(mcart, data, selectedLanguage, selectedCurrency)
      .then((res:any) => {
        updateCartItems();
        updateCartData();
        setOpenModal(true);
        setShowLoader(false);
        setReorderConfirmation(false);
        setActiveOrderId("");
        partialAddConfirmation(res.data)
        const errorsContainer = res.errors.map((el:any) => (`"${el.meta.sku}" ${el.detail}`)).join('\n');
        handlePartialAddMessage(errorsContainer);
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
    const parsedPageNum = parseInt(params.pageNum!);
    setPageNum(isNaN(parsedPageNum) ? 1 : parsedPageNum)
  }, [params, setPageNum])

  useEffect(() => {
      filterByDate();  
  }, [filterByDate])

  return (
    <div className="ordershistory">
      <h1 className="ordershistory__title">{t('orders')}</h1>
      <div className="ordershistory__header">
        <div className="ordershistory__searchfilterbar">
          <button className="--mbldate" onClick={sortByDate}>
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
              <span className="--showheader">{t('show')}</span>
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
        <div className="ordershistory__pagination">
            <OrdersPagination
              totalPages={total}
              currentPage={currentPage}
              pageOrders={ordersData.length}
              totalOrders={totalOrders}
              formatUrl={(page) => createOrdersHistoryUrl(page)}
            />
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
            {ordersData.map((order: moltin.Order)=> (
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
           <div className="ordershistory__pagination">
              <OrdersPagination
                totalPages={total}
                totalOrders={totalOrders}
                pageOrders={ordersData.length}
                currentPage={currentPage}
                formatUrl={(page) => createOrdersHistoryUrl(page)}
              />
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
