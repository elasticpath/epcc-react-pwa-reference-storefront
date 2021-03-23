import React, { useState } from 'react';
import { useTranslation, useMultiCartData } from './app-state';
import { SettingsCart } from './SettingsCart';
import useOnclickOutside from 'react-cool-onclickoutside';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';



import './MyCartsList.scss';

export  const MyCartsList: React.FC = () => {

  const { t } = useTranslation();
  const { multiCartDataList } = useMultiCartData();

  const [selectedCarts, setSelectedCarts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const modalRef = useOnclickOutside(() => {
    setModalOpen(false)
  });

  const handleSelectCart = (cartId: string) => {
    if(!selectedCarts.find(c => c === cartId)) {
      setSelectedCarts([...selectedCarts, cartId]);
    } else {
      setSelectedCarts(selectedCarts.filter(c => c !== cartId));
    }
  };

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
            <div  className='mycarts__header'>
                <h1 className="mycarts__title">My Carts</h1>
                <button className="mycarts__addcartbtn" onClick={() => setModalOpen(true)}>
                  {t('add-new-cart')}
                </button>
            </div>
            <div className='mycarts__clear'></div>
            <div className="mycarts__tblheader">
              <p className='mycarts__rowtitle'>{t('cart-name')}</p>
              <p className='mycarts__rowtitle'>{t('products-number')}</p>
              <p className='mycarts__rowtitle'>{t('cart-total')}</p>
              <p className='mycarts__rowtitle'>{t('cart-expiry')}</p>
              <p className='mycarts__rowtitle'>{t('last-edit')}</p>
              <p className='mycarts__rowtitle'>{t('action')}</p>
            </div>
            <div >
                {multiCartDataList.map((cart: any) => (
                  <div className='mycarts__cartrow' key={cart.id}>
                    <input type="checkbox" name="cartCheck" id={`carts_${cart.id}`} className="mycarts__check epcheckbox" checked={selectedCarts.includes(cart.id)} onChange={() => {handleSelectCart(cart.id)}}/>
                    <label htmlFor={`carts_${cart.id}`} className='mycarts__cartelement'>
                        <div className='mycarts__cartname'>
                          {cart.name}
                        </div>
                        <div className='mycarts__productsquantity'>
                          {cart.relationships.items.data ? cart.relationships.items.data.length : 0}
                        </div>
                        <div className='mycarts__total'>
                          {cart.meta.display_price.without_tax.formatted}
                        </div>
                        <div className='mycarts__expiry'>
                          {(cart.meta.timestamps.expires_at).substring(0, 10)}
                        </div>
                        <div className='mycarts__lastedit'>
                          {(cart.meta.timestamps.updated_at).substring(0, 10)}
                        </div>
                        <button className='mycarts__action'>
                            Review cart
                        </button>
                    </label>
                </div>
              ))}
            </div>
        </div>
        {modalOpen ? (
        <div className="mycarts__createcartmodalbg">
          <div className="mycarts__createcartmodal" ref={modalRef}>
            <SettingsCart
              title={CreateCartHeader}
              onCartCreate={() => {setModalOpen(false)}}
              handleHideSettings={() => {setModalOpen(false)}}
              setShowCartAlert={() => ''}
            />
          </div>
        </div>
      ) : null}
      </div>
  )
};
