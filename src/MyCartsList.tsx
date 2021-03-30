import React, { useEffect, useState } from 'react';
import { useTranslation, useMultiCartData } from './app-state';
import { Link, useParams } from 'react-router-dom';
import { SettingsCart } from './SettingsCart';
import { deleteCart } from './service';
import useOnclickOutside from 'react-cool-onclickoutside';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as RemoveIcon } from './images/icons/removeAll.svg';
import { ReactComponent as PaginationIcon } from "./images/icons/ic_caret.svg";import { ReactComponent as TooltipIcon } from './images/icons/icon-tooltip.svg';
import { CartsPagination } from './CartsPagination';
import { createMyCartsUrl, createCartsDetailsPageUrl } from './routes';

import './MyCartsList.scss';

interface CartsParams {
  pageNum?: string;
}
export  const MyCartsList: React.FC = () => {
  const params = useParams<CartsParams>();

  const { t } = useTranslation();
  const { multiCartDataList, multiCartData, updateCartData, total, currentPage, totalCarts, setPageNum} = useMultiCartData();

  const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showDeletedCartsnumber, setShowDeletedCartsnumber ] = useState(false);
  const [deletedCartNumber , setDeletedCartNumber] = useState(Number);
  const [showCreateCartAlert, setShowCreateCartAlert ] = useState(false);

  const createModalRef = useOnclickOutside(() => {
    setModalOpen(false)
  });

  const modalRef = useOnclickOutside(() => {
    setIsShowModal(false);
  });

  const handleSelectCart = (cartId: string) => {
    if(!selectedCarts.find(c => c === cartId)) {
      setSelectedCarts([...selectedCarts, cartId]);
    } else {
      setSelectedCarts(selectedCarts.filter(c => c !== cartId));
    }
  };

  const handleRemoveAll = () => {
    setSelectedCarts([])
  }

  const onDeleteCart = () => {
    setShowLoader(true);
    setShowDeletedCartsnumber(true);
    setDeletedCartNumber(selectedCarts.length);
    const promises = selectedCarts.map(el => deleteCart(el));
    Promise.all(promises)
      .then(() => {
        updateCartData();
        setIsShowModal(false);
        setShowLoader(false);
        setSelectedCarts([]);
      })
      .catch(error => {
        setIsShowModal(false);
        setShowLoader(false);
        console.error(error);
      });
      setTimeout(() => {
        setShowDeletedCartsnumber(false)
      }, 4000);
  };

  useEffect(() => {
    if (selectedCarts.length > 0) {
      setIsEdit (true)
    }
    else {
      setIsEdit (false)
    }
  }, [selectedCarts])

  useEffect(() => {
    const parsedPageNum = parseInt(params.pageNum!);
    setPageNum(isNaN(parsedPageNum) ? 1 : parsedPageNum)
  }, [params, setPageNum]);

  useEffect(() => {
    if(showCreateCartAlert)
      setTimeout(() => {
        setShowCreateCartAlert(false)
      }, 4000);
  }, [showCreateCartAlert]);

  const expiryAler = (date:any) => {
    const expiryDate = new Date(date);
    const dayBefore =   new Date(expiryDate.getTime());
    dayBefore.setDate(expiryDate.getDate() -2);
    const today = new Date();
    if(dayBefore.getDate() === today.getDate() && dayBefore.getMonth() === today.getMonth() && dayBefore.getFullYear() === today.getFullYear()) {
      return true
    }
    else {
      return false
    }
    
  }

  const CreateCartHeader = (
    <div className="mycarts__createcartheader">
      <span className="mycarts__createcartheadertext">{t("create-cart")}</span>
      <button
        className="mycarts__createcartheaderbnt"
        onClick={() => setModalOpen(false)}
      >
        <CloseIcon />
      </button>
    </div>
  );

  return (
      <div className='mycarts'>
        <div className="container">
        {showDeletedCartsnumber &&  (
        <div className="mycarts__alertMessage">
          <p className='mycarts__messagetext'>{t('delete-cart-message')} {deletedCartNumber} {deletedCartNumber === 1 ? `${t('cart')}` : `${t('carts')}`}</p>
          <CloseIcon onClick={() => setShowDeletedCartsnumber(false)} className="mycarts__messageicon"/>
          <div className='mycarts__clear'></div>
        </div>
      )}
      {showCreateCartAlert &&  (
        <div className="mycarts__alertMessage">
          <p className='mycarts__messagetext'>{t('create-cart-message')}</p>
          <CloseIcon onClick={() => setShowCreateCartAlert(false)} className="mycarts__messageicon"/>
          <div className='mycarts__clear'></div>
        </div>
        
      )}
        <div  className='mycarts__header'>
            <h1 className="mycarts__title">My Carts</h1>
            <button className="mycarts__addcartbtn" onClick={() => setModalOpen(true)}>
              {t('add-new-cart')}
            </button>
            <div className='mycarts__clear'></div>
        </div>
            
            <div>
            <div className={`${isEdit ? 'mycarts__isshow' : 'mycarts__ishidden'}`}>
                   <RemoveIcon className='mycarts__removeIcon' onClick={handleRemoveAll}/>
                    <label htmlFor="select-all" className="mycarts__cartsselected">
                      {selectedCarts.length === 1 ?  `${selectedCarts.length} ${t('cart')}
                      ${t('selected')}` : `${selectedCarts.length} ${t('carts')}
                      ${t('selected')}` }
                    </label>
                  <button className="mycarts__deletebutton" disabled={selectedCarts.length === 0 || multiCartDataList.length === 1} onClick={() => setIsShowModal(true)}>
                    REMOVE
                  </button> 
                </div>
            </div>
            <div className="mycarts__tblheader">
              <p className='mycarts__rowtitle'>{t('cart-name')}</p>
              <p className='mycarts__rowtitle '>
                {t('products-number')}
                <div className="mycarts__tooltip">
                  <TooltipIcon className='mycarts__tooltipicon'/>
                  <span className="mycarts__tooltiptext">
                  The number of different types of products added to a cart.
                  </span>
                </div>
                
              </p>
              <p className='mycarts__rowtitle'>{t('cart-total')}</p>
              <p className='mycarts__rowtitle'>{t('cart-expiry')}</p>
              <p className='mycarts__rowtitle'>{t('last-edit')}</p>
              <p className='mycarts__rowtitle'>{t('action')}</p>
            </div>
            <div >
                {multiCartDataList.map((cart: any) => (
                  <div className={selectedCarts.includes(cart.id) ? 'mycarts__cartrow mycarts__bgcolor': 'mycarts__cartrow'} key={cart.id}>
                    <input type="checkbox" name="cartCheck" id={`carts_${cart.id}`} className="mycarts__check epcheckbox" checked={selectedCarts.includes(cart.id)} onChange={() => {handleSelectCart(cart.id)}}/>
                    <label htmlFor={`carts_${cart.id}`} className='mycarts__cartelement'>
                        <div className='mycarts__cartname'>
                          <p>
                          {cart.name}
                          </p>
                        </div>
                        <div className='mycarts__productsquantity'>
                          <p>
                          {cart.relationships.items.data ? cart.relationships.items.data.length : 0}
                          </p>
                        </div>
                        <div className='mycarts__total'>
                          {cart.meta.display_price.without_tax.formatted}
                        </div>
                        <div className={asd(cart.meta.timestamps.expires_at) ? 'mycarts__expiry mycarts__expiralert' : 'mycarts__expiry'} >
                          <span className='mycarts__expiresspan'>expires: </span>
                            {new Date(cart.meta.timestamps.expires_at).toLocaleString('default', {month: 'short'})} {new Date(cart.meta.timestamps.expires_at).getDate() > 9 ? new Date(cart.meta.timestamps.expires_at).getDate() : ('0' + new Date(cart.meta.timestamps.expires_at).getDate()) }, {new Date(cart.meta.timestamps.expires_at).getFullYear()}
                           {
                             expiryAler(cart.meta.timestamps.expires_at) ? <div className="mycarts__tooltip">
                             <TooltipIcon className='mycarts__tooltipicon'/>
                             <span className="mycarts__tooltiptext">
                               To extend cart expiry date, add or remove an item.</span>
                            </div> : <></>
                           } 
                          
                        </div>
                        <div className='mycarts__lastedit'>
                          <p>
                          {new Date(cart.meta.timestamps.updated_at).toLocaleString('default', {month: 'short'})} {new Date(cart.meta.timestamps.updated_at).getDate() > 9 ? new Date().getDate() : ('0' + new Date(cart.meta.timestamps.updated_at).getDate()) }, {new Date(cart.meta.timestamps.updated_at).getFullYear()} 
                          </p>
                        </div>
                        <Link className='mycarts__action' to={createCartsDetailsPageUrl(cart.id)}>
                           <p className="mycarts__actionbtn">action</p>
                           <span className={"mycarts__actionicon --next --active"}><PaginationIcon className="mycarts__nexticon" /></span>
                        </Link>
                    </label>
                </div>
              ))}
            </div>
        </div>
        {modalOpen ? (
        <div className="mycarts__createcartmodalbg">
          <div className="mycarts__createcartmodal" ref={createModalRef}>
            <SettingsCart
              title={CreateCartHeader}
              onCartCreate={() => {setModalOpen(false)}}
              handleHideSettings={() => {setModalOpen(false)}}
              setShowCartAlert={() => setShowCreateCartAlert(true)}
            />
          </div>
        </div>
      ) : null}
      {isShowModal && (
        <React.Fragment>
          <div className="mycarts__confirmation" role="presentation" ref={modalRef}>
            <div className="mycarts__confirmationtitle">
              {selectedCarts.length !== multiCartData.length ? t('confirmation') : t('warning')}
            </div>
            <div className="mycarts__confirmationmsg">
              {selectedCarts.length !== multiCartData.length ? (
                selectedCarts.length === 1 ? t('are-you-sure-you-want-to-delete-your-cart') : t('are-you-sure-you-want-to-delete-your-carts')
              ) : t('warning-msg')}
            </div>
            <div className="mycarts__confirmationbtns">
              <button className="epbtn --primary" onClick={() => onDeleteCart()} disabled={selectedCarts.length === multiCartData.length}>{!showLoader ? t('delete') : <span className="circularLoader" aria-label={t('loading')} />}</button>
              <button className="epbtn --ghost" onClick={() => setIsShowModal(false)}>{t("cancel")}</button>
            </div>
          </div>
          <div className="mycarts__confirmationoverlay" />
        </React.Fragment>
      )}

        <div className="mycarts__pagination">
          <CartsPagination
            totalPages={total}
            totalOrders={totalCarts}
            pageOrders={multiCartData.length}
            currentPage={currentPage}
            formatUrl={(page) => createMyCartsUrl(page)}
          />
        </div>
      </div>
  )
};
