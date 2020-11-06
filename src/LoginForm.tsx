import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { login } from './service';
import { useCustomerData, useMultiCartData, useTranslation } from './app-state';
import { createRegistrationUrl } from './routes';

import './LoginForm.scss';

interface LoginFormProps {
  handleModalClose?: (...args: any[]) => any,
  onSubmit?: (...args: any[]) => any,
  handleCloseCartModal?: (...args: any[]) => any,
  openModal?: boolean,
  createNewCart?: boolean,
}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const LoginForm: React.FC<LoginFormProps> = (props) => {
  const { handleModalClose, onSubmit, openModal, createNewCart, handleCloseCartModal } = props;
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const { setGuestCartId, setIsCreateNewCart } = useMultiCartData();

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
  };

  const {handleSubmit, handleChange, resetForm, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: async (values) => {
      const cartId = localStorage.getItem('mcart') || '';
      setGuestCartId(cartId);
      setIsLoading(true);
      try {
        const result: any = await login(values.emailField.toLowerCase(), values.passwordField);
        await setCustomerData(result.token, result.customer_id);
        await setIsLoading(false);
        if (handleModalClose) {
          handleModalClose();
        }
        if (createNewCart) {
          setIsCreateNewCart(true);
        }
        if (onSubmit) {
          onSubmit();
        }
      }
      catch (error) {
        setIsLoading(false);
        setFailedLogin(true);
        console.error(error);
      }
    },
  });

  const registerNewUser = () => {
    if (handleModalClose) {
      handleModalClose();
    }
    if (handleCloseCartModal) {
      handleCloseCartModal();
    }
  };

  useEffect(() => {
    if (!openModal) {
      setFailedLogin(false);
      resetForm();
    }
  }, [openModal, resetForm]);

  return (
    <div className={`loginform${isLoading ? ' --loading' : ''}`}>
      {
        (isLoading) ? <div className="epminiLoader --centered" /> : ('')
      }
      <div className="loginform__feedback">
        {failedLogin ? t('invalid-email-or-password') : ('')}
      </div>
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
          <button className="epbtn --secondary" id="login_modal_login_button" type="submit" disabled={isLoading}>
            {t('login')}
          </button>
          <Link to={registrationUrl} className="epbtn --secondary" id="login_modal_register_button" onClick={registerNewUser}>
            {t('register')}
          </Link>
        </div>
      </form>
    </div>
  );
};
