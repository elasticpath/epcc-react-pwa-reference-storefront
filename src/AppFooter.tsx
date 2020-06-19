import React from 'react';
import { Link } from 'react-router-dom';

import './AppFooter.scss';

import { ReactComponent as FacebookIcon } from './images/icons/ic_facebook.svg';
import { ReactComponent as InstagramIcon } from './images/icons/ic_instagram.svg';
import { ReactComponent as TwitterIcon } from './images/icons/ic_twitter.svg';

export const AppFooter: React.FC = (props) => {
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
              BelleVie
            </div>
            <div className="content">
              Commerce software that powers the next generation of digital experience
            </div>
          </div>
          <div className="footer-column">
            <div className="title">
              Assistance
            </div>
            <div className="content">
              <Link to={linkTo.aboutus}>
                About Us
              </Link>
              <Link to={linkTo.contactus}>
                Contact
              </Link>
              <Link to={linkTo.shippingreturns}>
                Shipping & Returns
              </Link>
              <Link to={linkTo.termsandconditions}>
                Terms & Conditions
              </Link>
            </div>
          </div>
          <div className="footer-column social">
            <div className="title">
              Find us Online
            </div>
            <div className="content">
              <Link to={linkTo.shareFacebook} aria-label="share facebook">
                <FacebookIcon className="share-icon" />
                facebook
              </Link>
              <Link to={linkTo.shareTwitter} aria-label="share twitter">
                <TwitterIcon className="share-icon" />
                twitter
              </Link>
              <Link to={linkTo.shareInstagram} aria-label="share instagram">
                <InstagramIcon className="share-icon" />
                instagram
              </Link>
            </div>
          </div>
        </div>
        <div className="second-row">
          <div className="title">
            Find us Online
          </div>
          <Link to={linkTo.shareFacebook} aria-label="share facebook">
            <FacebookIcon className="share-icon" />
          </Link>
          <Link to={linkTo.shareTwitter} aria-label="share twitter">
            <TwitterIcon className="share-icon" />
          </Link>
          <Link to={linkTo.shareInstagram} aria-label="share instagram">
            <InstagramIcon className="share-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};
