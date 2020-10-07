import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { useResolve, useProductImages } from './hooks';
import { addToCart, loadProductBySlug } from './service';
import { CompareCheck } from './CompareCheck';
import { SocialShare } from './SocialShare';
import {
  useTranslation,
  useCurrency,
  useCartData,
  useMultiCartData,
  useCustomerData,
} from "./app-state";
import { isProductAvailable } from './helper';
import { Availability } from './Availability';
import { VariationsSelector } from './VariationsSelector';
import { SettingsCart } from './SettingsCart';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { ReactComponent as SpinnerIcon } from './images/icons/ic_spinner.svg';
import { ReactComponent as CaretIcon } from './images/icons/ic_caret.svg';

import './Product.scss';


interface ProductParams {
  productSlug: string;
}

export const Product: React.FC = () => {
  const { productSlug } = useParams<ProductParams>();
  const { t } = useTranslation();
  const { selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();
  const { updateCartItems } = useCartData();
  const { isLoggedIn } = useCustomerData();
  const { multiCartData } = useMultiCartData();

  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const modalRef = useOnclickOutside(() => {
    setModalOpen(false)
  });

  const dropdownRef = useOnclickOutside(() => {
    setDropdownOpen(false)
  });

  const [product] = useResolve(
    async () => loadProductBySlug(productSlug, selectedLanguage, selectedCurrency),
    [productSlug, selectedLanguage, selectedCurrency]
  );
  const [productId, setProductId] = useState('');

  useEffect(() => {
    product && setProductId(product.id);
  }, [product])

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : 'unset';
  }, [modalOpen])

  const productImageHrefs = useProductImages(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isPrevImageVisible = currentImageIndex > 0;
  const isNextImageVisible = currentImageIndex < (productImageHrefs?.length ?? 0) - 1;
  const productBackground = product?.background_color ?? '';

  const handlePrevImageClicked = () => {
    setCurrentImageIndex(currentImageIndex - 1);
  };

  const handleAddToCart = (cartId?: string) => {
    const mcart = cartId ? cartId : localStorage.getItem("mcart") || "" ;
    setAddToCartLoading(true);
    return addToCart(mcart, productId)
      .then(() => {
        updateCartItems();
      }).finally(() => {
        setAddToCartLoading(false);
      })
  };

  const handleNextImageClicked = () => {
    setCurrentImageIndex(currentImageIndex + 1);
  };

  const handleVariationChange = (childID: string) => {
    setProductId(childID);
  };

  const onCartCreate = ({ data }: {data?: {id: string}}) => {
    if (data) {
      handleAddToCart(data.id).then(() => {
        setModalOpen(false);
      });
    }
  };

  const CartButton = () => {
    if (!productId) return null;
    if (isLoggedIn) {
      return (
        <div className="product__addtocartdropdowncontainer">
          <button
            className={`epbtn --primary product__addtocartdropdowntoggle ${
              dropdownOpen ? "--open" : ""
            }`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {t("add-to-cart")}
            {addToCartLoading ? (
              <SpinnerIcon className="product__addtocartdropdownicspinner" />
            ) : (
              <CaretIcon
                className={`product__addtocartdropdowniscaret ${
                  dropdownOpen ? "--rotated" : ""
                }`}
              />
            )}
          </button>
          {dropdownOpen ? (
            <div className="product__addtocartdropdowncontent">
              {multiCartData.map((cart) => (
                <button
                  className="product__addtocartdropdownbtn"
                  key={cart.id}
                  onClick={() => {
                    handleAddToCart(cart.id);
                    setDropdownOpen(false);
                  }}
                >
                  {cart.name}
                </button>
              ))}
              <button
                className="product__addtocartdropdownbtn"
                key="create-cart-btn"
                onClick={() => setModalOpen(true)}
              >
                Create cart
              </button>
            </div>
          ) : null}
        </div>
      );
    }

    return (
      <button className="epbtn --secondary" onClick={() => handleAddToCart()}>
        {t("add-to-cart")}
      </button>
    );
  };

  const CreateCartHeader = (
    <div className="product__createcardteader">
      <span className="product__createcardteadertext">Create cart</span>
      <button
        className="product__createcardteaderbnt"
        onClick={() => setModalOpen(false)}
      >
        <CloseIcon />
      </button>
    </div>
  );

  return (
    <div className="product">
      {product ? (
        <div className="product__maincontainer">
          <div className="product__imgcontainer">
            {productImageHrefs.length > 0 && (
              <>
                <img className="product__img" src={productImageHrefs?.[currentImageIndex]} alt={product.name} style={{ backgroundColor: productBackground }} />
                {isPrevImageVisible && (
                  <button className="product__previmagebtn" aria-label={t('previous-image')} onClick={handlePrevImageClicked}>
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                )}
                {isNextImageVisible && (
                  <button className="product__nextimagebtn" aria-label={t('next-image')} onClick={handleNextImageClicked}>
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7"></path></svg>
                  </button>
                )}
              </>
            )}
          </div>
          <div className="product__details">
            <h1 className="product__name">
              {product.name}
            </h1>
            <div className="product__price">
              {product.meta.display_price.without_tax.formatted}
            </div>
            <Availability available={isProductAvailable(product)} />
            <div className="product__comparecheck">
              <CompareCheck product={product} />
            </div>
            {
              product.meta.variations
                ? <VariationsSelector product={product} onChange={handleVariationChange} />
                : ''
            }
            <div className="product__moltinbtncontainer">
              <div ref={dropdownRef}>
                <CartButton/>
              </div>
            </div>
            <div className="product__description">
              {product.description}
            </div>
            <div className="product__socialshare">
              <SocialShare name={product.name} description={product.description} imageHref={productImageHrefs?.[0]} />
            </div>
          </div>
        </div>
      ) : (
        <div className="loader" />
      )}
      {modalOpen ? (
        <div className="product__createcartmodalbg">
          <div className="product__createcartmodal" ref={modalRef}>
            <SettingsCart
              toBackPage={() => {setModalOpen(false)}}
              title={CreateCartHeader}
              onCartCreate={onCartCreate}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};
