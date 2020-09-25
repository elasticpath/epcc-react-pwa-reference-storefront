import React, { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useCustomerData, useTranslation } from '../app-state';
import { createRegistrationUrl } from '../routes';
import { login } from '../service';
import './PasswordLoginForm.scss'

import './LoginDialog.scss';

interface PasswordLoginFormProps {
  handleModalClose: (...args: any[]) => any,
  isLoading: boolean,
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setFailedLogin: Dispatch<SetStateAction<boolean>>
}

interface FormValues {
  emailField: string,
  passwordField: string,
}

export const PasswordLoginForm: React.FC<PasswordLoginFormProps> = (props) => {
  const { handleModalClose, setIsLoading, setFailedLogin } = props;
  
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const registrationUrl = createRegistrationUrl();

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

  const {handleSubmit, handleChange, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      login(values.emailField.toLowerCase(), values.passwordField)
        .then((result) => {
          handleModalClose();
          setIsLoading(false);
          setCustomerData(result.token, result.customer_id);
        })
        .catch(error => {
          setIsLoading(false);
          setFailedLogin(true)
        });
    },
  });

  const registerNewUser = () => {
    handleModalClose();
  }

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
            <button className="epbtn --primary loginbtn" id="login_modal_login_button" type="submit" disabled={props.isLoading}>
            {t('login')}
            </button>
            <Link to={registrationUrl} className="epbtn --secondary registerbtn" id="login_modal_register_button" onClick={registerNewUser}>
            {t('register')}
            </Link>
        </div>
        </form>
  );
};
