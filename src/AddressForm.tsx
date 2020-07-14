import React, { useState } from 'react';
import { updateAddress } from './service';

import { useTranslation } from './app-state';

import './AddressForm.scss';
import {ReactComponent as CloseIcon} from './images/icons/ic_close.svg';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';


interface AddressFormParams {
  handleModalClose: (...args: any[]) => any,
  isModalOpen: boolean;
}

interface FormValues {
  firstNameField: string,
  lastNameField: string,
  streetAddressField: string,
  extendedAddressField: string,
  phoneNumberField: string,
  countyField: string,
  countryField: string,
  postalCodeField: string,
}

export const AddressForm: React.FC<AddressFormParams> = (props) => {
  const { handleModalClose, isModalOpen } = props;
  const { t } = useTranslation();
  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const initialValues:FormValues = {
    firstNameField: '',
    lastNameField: '',
    streetAddressField: '',
    extendedAddressField: '',
    phoneNumberField: '',
    countyField: '',
    countryField: '',
    postalCodeField: '',
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

  const handleClose = () => {
    setFailedLogin(false);
    handleModalClose();
    resetForm();
  };


  const {handleSubmit, handleChange, resetForm, values, errors} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      setIsLoading(true);
      const data = values;
      updateAddress(data)
        .then((result) => {
          handleModalClose();
          setIsLoading(false);
        })
        .catch(error => {
          setIsLoading(false);
          setFailedLogin(true);
          console.error(error);
        });
    },

  });

  return (
    <Modal open={isModalOpen} onClose={handleClose} classNames={{modal: 'logindialog'}} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered"/> : ('')
      }
      <div className={`logindialog__content ${isLoading ? '--loading' : ''}`}>
        <div className="logindialog__header">
          <h2 className="logindialog__title">
            {t('address-form')}
          </h2>
          <button type="button" aria-label="close" onClick={handleModalClose}>
            <CloseIcon/>
          </button>
        </div>
        <div className="logindialog__body">
          <div className="logindialog__feedback">
            {failedLogin ? t('invalid-email-or-password') : ('')}
          </div>
          <form className="epform" id="address_modal_form" onSubmit={handleSubmit}>
            <div className={`epform__group ${errors.firstNameField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="firstNameField">
                {t('first-name')}:
              </label>
              <input className="epform__input" id="firstNameField" type="text" onChange={handleChange} value={values.firstNameField} />
              <div className="epform__error">
                {errors.firstNameField ? errors.firstNameField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.lastNameField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="lastNameField">
                {t('last-name')}:
              </label>
              <input className="epform__input" id="lastNameField" type="text" onChange={handleChange} value={values.lastNameField} />
              <div className="epform__error">
                {errors.lastNameField ? errors.lastNameField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.streetAddressField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="streetAddressField">
                {t('street-address')}:
              </label>
              <input className="epform__input" id="streetAddressField" type="text" onChange={handleChange} value={values.streetAddressField} />
              <div className="epform__error">
                {errors.streetAddressField ? errors.streetAddressField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.extendedAddressField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="extendedAddressField">
                {t('extended-address')}:
              </label>
              <input className="epform__input" id="extendedAddressField" type="text" onChange={handleChange} value={values.extendedAddressField} />
              <div className="epform__error">
                {errors.extendedAddressField ? errors.extendedAddressField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.phoneNumberField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="phoneNumberField">
                {t('phone-number')}:
              </label>
              <input className="epform__input" id="phoneNumberField" type="text" onChange={handleChange} value={values.phoneNumberField} />
              <div className="epform__error">
                {errors.phoneNumberField ? errors.phoneNumberField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.countryField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="countryField">
                {t('country')}:
              </label>
              <input className="epform__input" id="countryField" type="text" onChange={handleChange} value={values.countryField} />
              <div className="epform__error">
                {errors.countryField ? errors.countryField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.countyField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="countyField">
                {t('county')}:
              </label>
              <input className="epform__input" id="countyField" type="text" onChange={handleChange} value={values.countyField} />
              <div className="epform__error">
                {errors.countyField ? errors.countyField : null}
              </div>
            </div>
            <div className={`epform__group ${errors.postalCodeField ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="postalCodeField">
                {t('postal-сode')}:
              </label>
              <input className="epform__input" id="postalCodeField" type="text" onChange={handleChange} value={values.postalCodeField} />
              <div className="epform__error">
                {errors.postalCodeField ? errors.postalCodeField : null}
              </div>
            </div>
            <div className="epform__group --btn-container">
              <button className="epbtn --primary" type="button" id="login_modal_login_button" onClick={handleClose}>
                {t('cancel')}
              </button>
              <button className="epbtn --primary" type="submit" id="login_modal_register_button">
                {t('save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  )
};
