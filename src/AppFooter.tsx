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
    <div className="container">
      <div className="app-footer">
        <div className="first-row">
          <div className="footer-column">
            <div className="title">
              {t('bellvie')}
            </div>
            <div className="content">
              {t('footer-1-content')}
            </div>
          </div>
          <div className="footer-column">
            <div className="title">
              {t('assistance')}
            </div>
            <div className="content">
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
          <div className="footer-column social">
            <div className="title">
              {t('find-us-online')}
            </div>
            <div className="content">
              <Link to={linkTo.shareFacebook} aria-label={t('share-facebook')}>
                <FacebookIcon className="share-icon" />
                {t('facebook')}
              </Link>
              <Link to={linkTo.shareTwitter} aria-label={t('share-twitter')}>
                <TwitterIcon className="share-icon" />
                {t('twitter')}
              </Link>
              <Link to={linkTo.shareInstagram} aria-label={t('share-instagram')}>
                <InstagramIcon className="share-icon" />
                {t('instagram')}
              </Link>
            </div>
          </div>
        </div>
        <div className="second-row">
          <div className="title">
            {t('find-us-online')}
          </div>
          <Link to={linkTo.shareFacebook} aria-label={t('share-facebook')}>
            <FacebookIcon className="share-icon" />
          </Link>
          <Link to={linkTo.shareTwitter} aria-label={t('share-twitter')}>
            <TwitterIcon className="share-icon" />
          </Link>
          <Link to={linkTo.shareInstagram} aria-label={t('share-instagram')}>
            <InstagramIcon className="share-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};
