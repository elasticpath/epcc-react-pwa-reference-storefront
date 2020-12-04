import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import {register, login, addCustomerAssociation, getMultiCarts} from './service';
import { useCustomerData, useMultiCartData, useTranslation } from './app-state';

import './RegistrationForm.scss';

interface FormValues {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  passwordConfirm: string,
}

export const RegistrationForm: React.FC = (props) => {
  const { setCustomerData } = useCustomerData();
  const { setMultiCartData, updateSelectedCart } = useMultiCartData();
  const { t } = useTranslation();
  const history = useHistory();

  const [registrationErrors, setRegistrationErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialValues:FormValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };

  const validate = (values:FormValues) => {
    const errors:any = {};
    if (!values.firstName) {
      errors.firstName = t('required');
    }
    if (!values.lastName) {
      errors.lastName = t('required');
    }
    if (!values.email) {
      errors.email = t('required');
    }
    if (!values.password) {
      errors.password = t('required');
    }
    if (!values.passwordConfirm) {
      errors.passwordConfirm = t('required');
    }
    if (values.password && values.passwordConfirm && values.password !== values.passwordConfirm) {
      errors.passwordConfirm = t('password-confirm-error');
    }

    return errors;
  };

  const {handleSubmit, handleChange, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setRegistrationErrors('');
      setIsLoading(true);
      const guestCart = localStorage.getItem('mcart') || '';
      register(`${values.firstName} ${values.lastName}`, values.email, values.password)
        .then(() => {
          login(values.email.toLowerCase(), values.password).then((result) => {
            setIsLoading(false);
            setCustomerData(result.token, result.customer_id);
              addCustomerAssociation(guestCart, result.customer_id, result.token)
              .then(() =>
                getMultiCarts(result.token).then(res => {
                  setMultiCartData(res.data);
                  updateSelectedCart(res.data[0]);
                  localStorage.setItem('mcart', res.data[0].id);
                })
                .catch(error => {
                  console.error(error);
                })
              )
              .catch(error => {
                console.error(error);
              });
            history.push('/');
          })
        })
        .catch(error => {
          const errorsContainer = error.errors.map((el:any) => el.detail).join('\n');
          setIsLoading(false);
          setRegistrationErrors(errorsContainer);
          console.error(error);
        });
    },
  });

  return (
    <div className="registrationform container">
      <h1 className="eppagetitle">
        {t('register-new-account')}
      </h1>

      <div className="registrationform__feedback">
        {registrationErrors}
      </div>

      <div className={`registrationform__content ${isLoading ? '--loading' : ''}`}>
        <form className="epform" onSubmit={handleSubmit}>
          {
            (isLoading) ? <div className="epminiLoader --centered" /> : ('')
          }
          <div className={`epform__group ${errors.firstName ? '--error' : ''}`}>
            <label htmlFor="firstName" className="epform__label">
              {t('first-name')} *
            </label>
            <input id="firstName" name="firstName" className="epform__input" type="text" onChange={handleChange} value={values.firstName} />
            <div className="epform__error">
              {errors.firstName ? errors.firstName : null}
            </div>
          </div>
          <div className={`epform__group ${errors.lastName ? '--error' : ''}`}>
            <label htmlFor="lastName" className="epform__label">
              {t('last-name')} *
            </label>
            <input id="lastName" name="lastName" className="epform__input" type="text" onChange={handleChange} value={values.lastName} />
            <div className="epform__error">
              {errors.lastName ? errors.lastName : null}
            </div>
          </div>
          <div className={`epform__group ${errors.email ? '--error' : ''}`}>
            <label htmlFor="email"  className="epform__label">
              {t('email-slash-username')} *
            </label>
            <input id="email" name="email" className="epform__input" type="email" onChange={handleChange} value={values.email} />
            <div className="epform__error">
              {errors.email ? errors.email : null}
            </div>
          </div>
          <div className={`epform__group ${errors.password ? '--error' : ''}`}>
            <label htmlFor="password" className="epform__label">
              {t('password')} *
            </label>
            <input id="password" name="password" className="epform__input" type="password" onChange={handleChange} value={values.password} />
            <div className="epform__error">
              {errors.password ? errors.password : null}
            </div>
          </div>
          <div className={`epform__group ${errors.passwordConfirm ? '--error' : ''}`}>
            <label htmlFor="passwordConfirm" className="epform__label">
              {t('password-confirmation')} *
            </label>
            <input id="passwordConfirm" name="passwordConfirm" className="epform__input" type="password" onChange={handleChange} value={values.passwordConfirm} />
            <div className="epform__error">
              {errors.passwordConfirm ? errors.passwordConfirm : null}
            </div>
          </div>
          <div className="epform__group --btn-container">
            <button className="epbtn --secondary" id="registration_form_register_button" type="submit" disabled={isLoading}>
              {t('submit')}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
