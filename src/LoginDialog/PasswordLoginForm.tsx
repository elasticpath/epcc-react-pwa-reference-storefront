import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { useCustomerData, useTranslation, useMultiCartData } from '../app-state';
import { createRegistrationUrl } from '../routes';
import { login } from '../service';
import { createBrowserHistory } from "history";
import './PasswordLoginForm.scss'

import './LoginDialog.scss';

interface PasswordLoginFormProps {
  handleModalClose?: (...args: any[]) => any,
  handleCloseCartModal?: (...args: any[]) => any,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setFailedLogin?: Dispatch<SetStateAction<boolean>>,
  openModal?: boolean,
  createCart?: boolean,
  handleShowNewCart?: (arg:boolean) => void,
  openCartModal?: (...args: any[]) => any,
  onSubmit?: (...args: any[]) => any,
}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const PasswordLoginForm: React.FC<PasswordLoginFormProps> = (props) => {
  const { handleModalClose,handleCloseCartModal, setIsLoading, setFailedLogin,onSubmit, openCartModal, openModal, createCart, handleShowNewCart  } = props;
  
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const registrationUrl = createRegistrationUrl();
  const { setGuestCartId, setIsCreateNewCart, createDefaultCart  } = useMultiCartData();

  const browserHistory = createBrowserHistory();
  const history = useHistory();

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

  const {handleSubmit, handleChange,resetForm, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      const cartId = localStorage.getItem('mcart') || '';
      setGuestCartId(cartId);
      setIsLoading(true);
      login(values.emailField.toLowerCase(), values.passwordField)
        .then((result) => {
          setCustomerData(result.token, result.customer_id);
          setIsLoading(false);
          createDefaultCart();
          if(browserHistory.location.pathname === "/registration")
          {
            history.push('/');
          }
          if (handleModalClose) {
            handleModalClose();
          }
          if(openCartModal && handleShowNewCart){
            openCartModal();
            handleShowNewCart(true);
          }
          if (createCart) {
            setIsCreateNewCart(true);
          }
          if (onSubmit) {
            onSubmit();
          }
        })
        .catch(error => {
          setIsLoading(false);
          if(setFailedLogin)
            setFailedLogin(true);
          console.error(error);
        });
    },
  });

  const registerNewUser = () => {
    if (handleModalClose) {
      handleModalClose();
    }
    if (handleCloseCartModal) {
      handleCloseCartModal();
    }
  }
  useEffect(() => {
    if (!openModal && setFailedLogin) {
      setFailedLogin(false);
      resetForm();
    }
  }, [openModal, resetForm]);

  return (
        <form className="epform" id="login_modal_form" onSubmit={handleSubmit}>
        
        <div className={`epform__group ${errors.emailField ? '--error' : ''}`}>
            <label className="epform__label" htmlFor="emailField">
            {t('email')}
            </label>
            <input className="epform__input" id="emailField" type="text" onChange={handleChange} value={values.emailField} />
            <div className="epform__error">
            {errors.emailField ? errors.emailField : null}
            </div>
        </div>
        <div className={`epform__group ${errors.passwordField ? '--error' : ''}`}>
            <label className="epform__label" htmlFor="passwordField">
            {t('password')}
            </label>
            <input className="epform__input" id="passwordField" type="password" onChange={handleChange} value={values.passwordField} />
            <div className="epform__error">
            {errors.passwordField ? errors.passwordField : null}
            </div>
        </div>
        
        <div className="epform__group --btn-container">
            <button className="epbtn --primary " id="login_modal_login_button" type="submit" disabled={props.isLoading}>
            {t('login')}
            </button>
            <Link to={registrationUrl} className="epbtn --secondary " id="login_modal_register_button" onClick={registerNewUser}>
            {t('register')}
            </Link>
        </div>
        </form>
  );
};
