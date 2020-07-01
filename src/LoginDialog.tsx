
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';
import { login } from './service';
import { useCustomerData, useTranslation } from './app-state';
import { createRegistrationUrl } from './routes';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './LoginDialog.scss';

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean,
}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const LoginDialog: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose, openModal } = props;
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const registrationUrl = createRegistrationUrl();

  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues:FormValues = {
    emailField: '',
    passwordField: '',
  };

  const validate = (values:any) => {
    const errors:any = {};
    if (!values.emailField) {
      errors.emailField = t('required');
    }
    if (!values.passwordField) {
      errors.passwordField = t('required');
    }

    return errors;
  }

  const {handleSubmit, handleChange, resetForm, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      login(values.emailField.toLowerCase(), values.passwordField)
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
    resetForm();
  }

  return (
    <Modal open={openModal} onClose={handleClose} classNames={{ modal: 'logindialog' }} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered" /> : ('')
      }
      <div className={`logindialog__content ${isLoading ? '--loading' : ''}`}>
        <div className="logindialog__header">
          <h2 className="logindialog__title">
            {t('login')}
          </h2>
          <button type="button" aria-label="close" onClick={handleModalClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="logindialog__feedback">
          {failedLogin ? t('invalid-username-or-passwordField') : ('')}
        </div>

        <div className="logindialog__body">
          <form className="epform" id="login_modal_form" onSubmit={handleSubmit}>
            <div className={`epform__group ${errors.emailField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="emailField">
                {t('email')}:
              </label>
              <input className="epform__input" id="emailField" type="text" onChange={handleChange} value={values.emailField} />
              <div className="epform__error">
                {errors.emailField ? errors.emailField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.passwordField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="passwordField">
                {t('password')}:
              </label>
              <input className="epform__input" id="passwordField" type="password" onChange={handleChange} value={values.passwordField} />
              <div className="epform__error">
                {errors.passwordField ? errors.passwordField : null}
              </div>
            </div>
            <div className="epform__group --btn-container">
              <button className="epbtn --primary" id="login_modal_login_button" type="submit" disabled={isLoading}>
                {t('login')}
              </button>
              <Link to={registrationUrl} className="epbtn --primary" id="login_modal_register_button" onClick={registerNewUser}>
                {t('register')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
