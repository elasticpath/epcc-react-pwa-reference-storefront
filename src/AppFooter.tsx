import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from './app-state';

import './AppFooter.scss';

import { ReactComponent as FacebookIcon } from './images/icons/ic_facebook.svg';
import { ReactComponent as InstagramIcon } from './images/icons/ic_instagram.svg';
import { ReactComponent as TwitterIcon } from './images/icons/ic_twitter.svg';

export const AppFooter: React.FC = (props) => {
  const { t } = useTranslation();

  const linkTo = {
    aboutus: '/aboutus',
    contactus: '/contactus',
    shippingreturns: '/shippingreturns',
    termsandconditions: '/termsandconditions',
    shareFacebook: '/',
    shareTwitter: '/',
    shareInstagram: '/',
  };

  return (
    <div className="appfooter">
      <div className="container">
        <div className="appfooter__content">
          <div className="appfooter__firstrow">
            <div className="appfooter__column">
              <div className="appfooter__title">
                {t('bellvie')}
              </div>
              <div className="appfooter__txt">
                {t('footer-1-content')}
              </div>
            </div>
            <div className="appfooter__column">
              <div className="appfooter__title">
                {t('assistance')}
              </div>
              <div className="appfooter__txt">
                <Link to={linkTo.aboutus}>
                  {t('about-us')}
                </Link>
                <Link to={linkTo.contactus}>
                  {t('contact')}
                </Link>
                <Link to={linkTo.shippingreturns}>
                  {t('shipping-and-returns')}
                </Link>
                <Link to={linkTo.termsandconditions}>
                  {t('terms-and-conditions')}
                </Link>
              </div>
            </div>
            <div className="appfooter__column appfooter__social">
              <div className="appfooter__title">
                {t('find-us-online')}
              </div>
              <div className="appfooter__txt">
                <Link to={linkTo.shareFacebook} aria-label={t('share-facebook')}>
                  <FacebookIcon className="appfooter__icon" />
                  {t('facebook')}
                </Link>
                <Link to={linkTo.shareTwitter} aria-label={t('share-twitter')}>
                  <TwitterIcon className="appfooter__icon" />
                  {t('twitter')}
                </Link>
                <Link to={linkTo.shareInstagram} aria-label={t('share-instagram')}>
                  <InstagramIcon className="appfooter__icon" />
                  {t('instagram')}
                </Link>
              </div>
            </div>
          </div>
          <div className="appfooter__secondrow">
            <div className="appfooter__title">
              {t('find-us-online')}
            </div>
            <Link to={linkTo.shareFacebook} aria-label={t('share-facebook')}>
              <FacebookIcon className="appfooter__icon" />
            </Link>
            <Link to={linkTo.shareTwitter} aria-label={t('share-twitter')}>
              <TwitterIcon className="appfooter__icon" />
            </Link>
            <Link to={linkTo.shareInstagram} aria-label={t('share-instagram')}>
              <InstagramIcon className="appfooter__icon" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
