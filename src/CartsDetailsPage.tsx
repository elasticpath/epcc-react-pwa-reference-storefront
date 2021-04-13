import React, { useContext, useState, useEffect } from 'react';
import { useCustomerData, useTranslation, useMultiCartData, useCartData } from './app-state';
import { ReactComponent as SettingsIcon } from "./images/icons/settings-black-24dp.svg";
import { removeAllCartItems, removeCartItem, updateCartItem , getCartItems} from './service';
import { SettingsCart } from "./SettingsCart";
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ImageContainer } from "./ImageContainer";
import { Promotion } from "./Promotion";
import { APIErrorContext } from "./APIErrorProvider";
import useOnclickOutside from 'react-cool-onclickoutside';
import { Link } from 'react-router-dom';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';
import { ReactComponent as NextIcon } from './images/icons/ic_next.svg';
import { ReactComponent as MinusIcon } from './images/icons/minus.svg';
import { ReactComponent as PlusIcon } from './images/icons/plus.svg';
import { useLocation } from 'react-router-dom';
import { createMyCartsUrl } from './routes';

import emptyimage from './images/cart_empty.png';

import './CartsDetailsPage.scss';

interface Detailsprops {
  cart: any
}

export  const CartsDetailsPage: React.FC<Detailsprops> = () => {
  const location = useLocation<Detailsprops>();
  const { selectedCart,updateCartData, multiCartData , updateSelectedCart, setIsCartSelected} = useMultiCartData();
  const cartInfo =  location?.state.cart.id === selectedCart?.id ? selectedCart : location.state.cart ;
  const { t } = useTranslation();
  const { isLoggedIn } = useCustomerData();
  const [promotionItems, setPromotionItems] = useState<moltin.CartItem[]>([]);
  const { setCount } = useCartData();
  const [counts, setCounts] = useState(0);
  const [totalPrice, setTotalPrice] = useState('');
  const [cartData, setCartData] = useState<moltin.CartItem[]>([]);
  const mcart = (isLoggedIn && cartInfo) ?   cartInfo.id :  localStorage.getItem('mcart');
  const imgSize = 40;
  const quantityItems = counts.toString();
  const { addError } = useContext(APIErrorContext);
  const [showSettings, setShowSettings] = useState(false);
  const [showUpdateCartAlert, setShowUpdateCartAlert ] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [route, setRoute] = useState<string>('');


  const modalRef = useOnclickOutside(() => {
    setShowLoginModal(false);
  });

  const dropdownRef = useOnclickOutside(() => {
    setDropdownOpen(false)
  });

  const emptycartRef = useOnclickOutside(() => {
    setIsShowModal(false);
  });

  useEffect(() => {
    if (mcart) {
      getCartItems(mcart).then(res => {
        setCartData(res.data.filter(({ type }) => type === 'cart_item' || type === 'custom_item'));
        setPromotionItems(res.data.filter(({ type }) => type === 'promotion_item'));
        setCounts(res.data.reduce((sum, { quantity }) => sum + quantity, 0));
        setCount(res.data.reduce((sum, { quantity }) => sum + quantity, 0))
        setTotalPrice(res.meta.display_price.without_tax.formatted);
      });
    }
  }, [mcart, setCount]);


  const handlePage = (page: string) => setRoute(page)
  const onHandlePage = (page: string) => {
    handlePage(page)
  };

  const updateCartItems = () => {
    const mcart = localStorage.getItem('mcart') || '';
    getCartItems(mcart).then(res => {
      const cartData = res.data.length ? res.data.filter(({ type }) => type === 'cart_item' || type === 'custom_item') : [];
      setCartData(cartData);
      const promotionItems = res.data.length ? res.data.filter(({ type }) => type === 'promotion_item') : [];
      setPromotionItems(promotionItems);
      const itemQuantity = res.data.length ? res.data.reduce((sum, { quantity }) => sum + quantity, 0) : 0;
      setCounts(itemQuantity);
      setCount(itemQuantity);
      const totalPrice = res.meta ? res.meta.display_price.without_tax.formatted : '';
      setTotalPrice(totalPrice);
    });
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      onHandlePage('shipping');
    }
  };

  const handleRemoveAllItems = () => {
    setShowLoader(true);
    removeAllCartItems(mcart)
      .then(() => {
        setShowLoader(false);
        setIsShowModal(false);
        updateCartItems();
        updateCartData();
      })
      .catch(error => {
        setShowLoader(false);
        setIsShowModal(false);
        addError(error.errors);
      })
  };

  const handleRemove = (id:string, index:number) => {
    removeCartItem(mcart, id)
      .then(() => {
        updateCartItems();
        updateCartData();
      })
      .catch(error => {
        addError(error.errors);
      })
  };

  const handleUpdate = (id:string, quantity:number) => {
    updateCartItem(mcart, id, quantity)
      .then(() => {
        updateCartItems();
        if(isLoggedIn)
          updateCartData();
      })
      .catch(error => {
        console.error(error);
      })
  };

  const handleCart = (cart:any) => {
      localStorage.setItem('mcart', cart.id);
      updateCartItems();
      updateSelectedCart(cart);
      setIsCartSelected(true);
      setDropdownOpen(false)
  };

  const CartButton = () => {
    if (isLoggedIn) {
      return (
        <div className="cartsdetailspage__addtocartdropdowncontainer">
          {showLoginModal && route}
          <div className="cartsdetailspage__addtocartdropdownwrap">
            <button
              className="cartsdetailspage__addtocartbtn"
            >
              My carts
            </button>
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`cartsdetailspage__addtocartdropdowntoggle${
              dropdownOpen ? " --open" : ""
            }`}>
                <CaretIcon
                  className={`cartsdetailspage__addtocartdropdowniscaret ${
                    dropdownOpen ? "--rotated" : ""
                  }`}
                />
            </button>
          </div>
          {dropdownOpen ? (
            <div className="cartsdetailspage__addtocartdropdowncontent">
              <Link className="cartsdetailspage__addtocartdropdownbtn"
                 to={createMyCartsUrl()}>
                  {t('see-all-carts')}
                </Link>
              {multiCartData.map((cart: moltin.CartItem) => (
                <Link className="cartsdetailspage__addtocartdropdownbtn"
                onClick={() => handleCart(cart)}
                key={cart.id}
                to={{
                  pathname: `/cartsdetails/${cart.id}`,
                  state: { cart, cartData }
              }}>
                  {cart.name}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      );
    }
    return (
     <></>
    );
  };
  
  useEffect(() => {
    if(showUpdateCartAlert)
      setTimeout(() => {
        setShowUpdateCartAlert(false);
      }, 4000);
  }, [showUpdateCartAlert])

  return (
      <div className='cartsdetailspage'>
        { isLoggedIn && <div className='cartsdetailspage__navigation'>
              <Link to={'/'}>{t('home')}</Link>
              <NextIcon />
              <Link to={createMyCartsUrl()}>{t('my-carts')}</Link>
              <NextIcon />
             <p>{t("current-cart")}</p>
          </div>
        }
        {showUpdateCartAlert &&  (
        <div className="cartsdetailspage__alertMessage">
          <p>{t('update-cart-message')}</p>
          <CloseIcon onClick={() => setShowUpdateCartAlert(false)}/>
        </div>
      )}
        <div className='cartsdetailspage__header'>
          <div>
          <div>
            <h2 className="cartsdetailspage__title">
              {isLoggedIn && cartInfo ? (
                <span>
                  {cartInfo.name || ''}
                </span>
              ) : (
                <span>
                  {t('your-shopping-cart')}
                </span>
                )}
            </h2>
            <span className="cartsdetailspage__settingsicon">
              {isLoggedIn && cartInfo && <SettingsIcon onClick={() => setShowSettings(true)} /> }
            </span>
          </div>
          <div className="cartsdetailspage__date">
            { isLoggedIn && cartInfo?.meta.timestamps.expires_at &&
              <div>
                <p className="cartsdetailspage__dates">
                  <span className="cartsdetailspage__datestitle"> {t('expires')}: </span>
                 {(cartInfo?.meta.timestamps.expires_at).substring(0, 10)}
                 &nbsp;|&nbsp;
                </p>
                <p className="cartsdetailspage__dates">
                  <span className="cartsdetailspage__datestitle">{t('edited')}: </span>
                  {(cartInfo?.meta.timestamps.updated_at).substring(0, 10)}
                </p>
              </div>
            }      
          </div>
          <p className="cartsdetailspage__description">
              {isLoggedIn && cartInfo ? (
                <span>
                  {cartInfo.description || ''}
                </span>
              ) : (
                <span></span>
                )}
            </p>
            </div>
            <div className="cartsdetailspage__carts" ref={dropdownRef}>
            <CartButton />
            </div>
        </div>
       
          {
            cartData.length> 0 ? (
              <div className="cartsdetailspage__body">
              <div className="cartsdetailspage__table">
              <div className="cartsdetailspage__tableheader">
                <p className="cartsdetailspage__producttitle">{t('product')}</p>
                <p className="cartsdetailspage__skutitle">{t('sku')}</p>
                <p className="cartsdetailspage__pricetitle">{t("unit-price")}</p>
                <p className="cartsdetailspage__quantitytitle">{t('quantity')}</p>
                <p className="cartsdetailspage__subtotaltitle">{t("line-subtotal")}</p>
                <p className="cartsdetailspage__actiontitle">{t('action')}</p>
              </div>
              {cartData.map((item: any, index:number) => (
              <div key={item.id} className="cartsdetailspage__tableitems">
                <div className="cartsdetailspage__product">
                  <div className="cartsdetailspage__productimage">
                    {item.image && item.image.href && (
                      <ImageContainer
                        imgClassName="productmainimage"
                        imgUrl={item.image.href}
                        alt={item.image.name}
                        imageStyle={{ width: imgSize, height: imgSize, objectFit: 'fill', backgroundColor: '', border: '1px solid #CCCCCC' }}
                      />
                    )}
                  </div>
                  <div className="cartsdetailspage__productname">
                    <Link to={`/product/${[item.sku]}`}>
                      {item.name}
                    </Link>
                  </div>
                </div>
                <Link to={`/product/${[item.sku]}`} className="cartsdetailspage__sku">
                  {item.sku}
                </Link>
                <div className="cartsdetailspage__price">
                  {item.meta.display_price.without_tax.unit.formatted}<span className='--each'>&nbsp;/&nbsp;Each</span>
                </div>
                <div className="cartsdetailspage__quantity">
                
                  <div className="cartsdetailspage__quantity">
                    <button className="cartsdetailspage__arrow" onClick={() => {handleUpdate(item.id, item.quantity - 1)}}> <MinusIcon /></button >
                    <input placeholder={item.quantity}  className="cartsdetailspage__quantityinput" type='number' onChange={(e) => handleUpdate(item.id , parseInt(e.target.value) )}/>
                    <button className="cartsdetailspage__arrow" onClick={() => {handleUpdate(item.id, item.quantity + 1)}} > <PlusIcon /> </button >
                </div>
                </div>
                <div className="cartsdetailspage__subtotal">
                  {item.meta.display_price.without_tax.value.formatted}
                </div>
                <button className="cartsdetailspage__action" onClick={() => {handleRemove(item.id, index)}}>
                  {t("remove")}
                </button>
              </div>
            ))}
              <button className='cartsdetailspage__emptycart' onClick={() => setIsShowModal(true)}>{t("empty-cart")}</button>
              </div>
              <div className='cartsdetailspage__promotionbox'>
                <div className="cartsdetailspage__promotion">
                  <Promotion promotionItems={promotionItems}  updateCartsItems = {updateCartItems}/>
                </div>
                <div className="cartsdetailspage__total">
                  <span className="cartsdetailspage__totaltitle">{t('total')}</span>
                  <span className="cartsdetailspage__subtotalprice">{totalPrice}</span>
                </div>
                <div className="cartsdetailspage__checkout">
                  <button className="cartsdetailspage__checkoutbutton epbtn --large --fullwidth" onClick={handleCheckout}>
                    {t('checkout-with-items', { quantityItems })}
                  </button>
                </div>
              </div>
        </div>
            )
             :
             <div className="cartsdetailspage__emptystatebody">
              <div className="cartsdetailspage__emptystate">
                <p className='cartsdetailspage__emptystatedescription'>
                   Your cart is empty.
                   <br/>
                   Switch to another cart or add items to this cart.
                </p>
                
                <img src={emptyimage} alt=" empty state"/>
              </div>
              </div>
          }

        {isShowModal && (
        <React.Fragment>
          <div className="cartsdetailspage__confirmation" role="presentation" ref={emptycartRef}>
            <div className="cartsdetailspage__confirmationtitle">
              <span>{t('confirmation')}</span>
              <CloseIcon className='cartsdetailspage__confirmationclose' onClick={() => setIsShowModal(false)}/>
            </div>
            <div className="cartsdetailspage__confirmationmsg">
              {t('remove-all-items-confirmation')}
            </div>
            <div className="cartsdetailspage__confirmationbtns">
              <button className="epbtn --primary" onClick={handleRemoveAllItems}>{!showLoader ? t('yes') : <span className="circularLoader" aria-label={t('loading')} />}</button>
              <button className="epbtn --ghost" onClick={() => setIsShowModal(false)}>{t("no")}</button>
            </div>
          </div>
          <div className="cartsdetailspage__confirmationoverlay" />
        </React.Fragment>
      )} 
                {dropdownOpen && <div className="cartsdetailspage__confirmationoverlay" /> }
              {showSettings ? (
        <div className="mycarts__createcartmodalbg">
          <div className="mycarts__createcartmodal" ref={modalRef}>
          <SettingsCart isEditCart name={cartInfo?.name} description={cartInfo?.description} showSettings={showSettings} handleHideSettings={() => setShowSettings(false)} setShowCartAlert={() => setShowUpdateCartAlert(true)} />
          </div>
        </div>
      ) : null}   
      
      </div>
  )
};
