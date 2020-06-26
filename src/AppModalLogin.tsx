
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';
import { login } from './service';
import { useCustomerData, useTranslation } from './app-state';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './AppModalLogin.scss';

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean,
}

export const AppModalLogin: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose, openModal } = props;
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();

  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      loginFormUserName: '',
      loginFormPassword: '',
    },
    onSubmit: (values) => {
      setIsLoading(true);
      login(values.loginFormUserName.toLowerCase(), values.loginFormPassword)
        .then((result) => {
          handleModalClose();
          setIsLoading(false);
          setCustomerData(result.token, result.id);
        })
        .catch(error => {
          setIsLoading(false);
          setFailedLogin(true);
          console.error(error);
        });
    },
  });

  const registerNewUser = () => {
    handleModalClose();
  }

  const handleClose = () => {
    setFailedLogin(false);
    handleModalClose();
    formik.resetForm();
  }

  return (
    <Modal open={openModal} onClose={handleClose} classNames={{ modal: 'appmodallogin' }} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered" /> : ('')
      }
      <div className={`appmodallogin__content ${isLoading ? '--loading' : ''}`}>
        <div className="appmodallogin__header">
          <h2 className="appmodallogin__title">
            {t('login')}
          </h2>
          <button type="button" aria-label="close" onClick={handleModalClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="appmodallogin__feedback">
          {failedLogin ? t('invalid-username-or-password') : ('')}
        </div>

        <div className="appmodallogin__body">
          <form className="epform" id="login_modal_form" onSubmit={formik.handleSubmit}>
            <div className="epform__group">
              <label className="epform__label" htmlFor="loginFormUserName">
                {t('username')}:
              </label>
              <input className="epform__input" id="loginFormUserName" type="text" onChange={formik.handleChange} value={formik.values.loginFormUserName} />
            </div>
            <div className="epform__group">
              <label className="epform__label" htmlFor="loginFormPassword">
                {t('password')}:
              </label>
              <input className="epform__input" id="loginFormPassword" type="password" onChange={formik.handleChange} value={formik.values.loginFormPassword} />
            </div>
            <div className="epform__group --btn-container">
              <button className="epbtn --primary" id="login_modal_login_button" type="submit">
                {t('login')}
              </button>
              <Link to='/registration' className="epbtn --primary" id="login_modal_register_button" onClick={registerNewUser}>
                {t('register')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
