
import React, { useState } from 'react';
import { useFormik } from 'formik';
import { getCustomer, updateCustomer } from './service';
import { useCustomerData, useTranslation } from './app-state';

import './Profile.scss';

interface FormValues {
  email: string,
  username: string,
}

export const Profile: React.FC = (props) => {
  const { customerEmail, customerName } = useCustomerData();
  const { t } = useTranslation();

  const id = localStorage.getItem('mcustomer') || '';

  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues:FormValues = {
    email: customerEmail,
    username: customerName,
  };

  const validate = (values:FormValues) => {
    const errors:any = {};
    if (!values.email) {
      errors.email = t('required');
    }

    if (!values.username) {
      errors.username = t('required');
    }

    return errors;
  };

  const {handleSubmit, handleChange, values, errors, setFieldValue} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      updateCustomer(id, values.username, values.email)
        .then((result) => {
          console.log('result', result);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
        });
    },
  });

  const handleShowForm = () => {
    setIsEditMode(true);
    setFieldValue('email', customerEmail, false);
    setFieldValue('username', customerName, false);
  };

  const handleHideForm = () => {
    setIsEditMode(false);
    errors.email = '';
    errors.username = '';
  };

  return (
    <div className="profile">
      <h1 className="profile__title">{t('my-profile')}</h1>
      <div className="profile__data">
        <p className="profile__titlesmall">{t('general')}</p>
        <div className="profile__container">
          <h2>{t('personal-information')}</h2>
          {!isEditMode ? (
            <div className="profile__info">
              <p className="profile__infoitem">
                <span className="profile__infolabel">{t('email')}:</span>
                {customerEmail}
              </p>
              <p className="profile__infoitem">
                <span className="profile__infolabel">{t('username')}:</span>
                {customerName}
              </p>
              <button className="epbtn" onClick={handleShowForm}>{t('edit')}</button>
            </div>
          ) : (
            <div className={`profile__form ${isLoading ? '--loading' : ''}`}>
              <form className="epform" onSubmit={handleSubmit}>
                {
                  (isLoading) ? <div className="epminiLoader --centered" /> : ('')
                }
                <div className="epform__group">
                  <label className="epform__label" htmlFor="email">{t('email')}:</label>
                  <input type="text" id="email" className="epform__input" onChange={handleChange} value={values.email} />
                  <div className="epform__error">
                    {errors.email ? errors.email : null}
                  </div>
                </div>
                <div className="epform__group">
                  <label className="epform__label" htmlFor="username">{t('username')}:</label>
                  <input type="text" id="username" name="username" className="epform__input" onChange={handleChange} value={values.username} />
                  <div className="epform__error">
                    {errors.username ? errors.username : null}
                  </div>
                </div>
                <div className="epform__group">
                  <button className="epbtn --primary" type="submit">{t('save')}</button>
                  <button className="epbtn --primary" type="submit" onClick={handleHideForm}>{t('cancel')}</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
};
