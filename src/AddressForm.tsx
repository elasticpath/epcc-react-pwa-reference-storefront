import React, { useState } from 'react';
import { updateAddress, addNewAddress } from './service';

import { useTranslation } from './app-state';

import './AddressForm.scss';
import {ReactComponent as CloseIcon} from './images/icons/ic_close.svg';
import Modal from 'react-responsive-modal';
import { useFormik } from 'formik';


interface AddressFormParams {
  handleModalClose: (...args: any[]) => any,
  isModalOpen: boolean;
  addressData: any;
}

interface FormValues {
  id: string,
  type: string,
  first_name: string,
  last_name: string,
  line_1: string,
  line_2: string,
  phone_number: string,
  county: string,
  country: string,
  postcode: string,
  company_name: string,
  city: string,
  name: string,
  instructions: string,
}

export const AddressForm: React.FC<AddressFormParams> = (props) => {
  const { handleModalClose, isModalOpen, addressData } = props;
  const { t } = useTranslation();
  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addressErrors, setAddressErrors] = useState<any[]>([]);

  let  initialValues:FormValues = {
    id: addressData?.id ?? '',
    type: addressData?.type ?? '',
    first_name: addressData?.first_name ?? '',
    last_name: addressData?.last_name ?? '',
    line_1: addressData?.line_1 ?? '',
    line_2: addressData?.line_2 ?? '',
    phone_number: addressData?.phone_number ?? '',
    county: addressData?.county ?? '',
    country: addressData?.country ?? '',
    postcode: addressData?.postcode ?? '',
    company_name: addressData?.company_name ?? '',
    city: addressData?.city ?? '',
    name: addressData?.name ?? '',
    instructions: addressData?.instructions ?? '',
  };

  const validate = (values:any) => {
    const errors:any = {};
    if (!values.first_name) {
      errors.first_name = t('required');
    }
    if (!values.last_name) {
      errors.last_name = t('required');
    }
    if (!values.line_1) {
      errors.line_1 = t('required');
    }
    if (!values.country) {
      errors.country = t('required');
    }
    if (!values.county) {
      errors.county = t('required');
    }
    if (!values.postcode) {
      errors.postcode = t('required');
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
      const token = localStorage.getItem('mtoken') || '';
      const customer = localStorage.getItem('mcustomer') || '';
      if(values.id) {
        updateAddress(customer, values.id, data, token)
          .then((result) => {
            handleModalClose();
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            setAddressErrors(error.errors);
            setFailedLogin(true);
            console.error(error);
          });
      } else {
        addNewAddress(customer, data, token)
          .then((result) => {
            handleModalClose();
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            setAddressErrors(error.errors);
            setFailedLogin(true);
            console.error(error);
          });
      }
    },
  });

  return (
    <Modal open={isModalOpen} onClose={handleClose} classNames={{modal: 'addressform'}} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered"/> : ('')
      }
      <div className={`addressform__content ${isLoading ? '--loading' : ''}`}>
        <div className="addressform__header">
          <h2 className="addressform__title">
            {t('address-form')}
          </h2>
          <button type="button" aria-label="close" onClick={handleModalClose}>
            <CloseIcon/>
          </button>
        </div>
        <div className="logindialog__body">
          <div className="logindialog__feedback">
            {addressErrors.length ? (
              addressErrors.map(error => (
                <div key={error.detail}>
                  {error.detail}
                </div>
              ))
              ) : ('')}
          </div>
          <form className="epform --addressform" id="address_modal_form" onSubmit={handleSubmit}>
            <div className={`epform__group ${errors.first_name ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="first_name">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('first-name')}
              </label>
              <input className="epform__input" id="first_name" type="text" onChange={handleChange} value={values.first_name} />
              <div className="epform__error">
                {errors.first_name ? errors.first_name : null}
              </div>
            </div>
            <div className={`epform__group ${errors.last_name ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="last_name">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('last-name')}
              </label>
              <input className="epform__input" id="last_name" type="text" onChange={handleChange} value={values.last_name} />
              <div className="epform__error">
                {errors.last_name ? errors.last_name : null}
              </div>
            </div>
            <div className={`epform__group ${errors.name ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="name">
                {t('name')}
              </label>
              <input className="epform__input" id="name" type="text" onChange={handleChange} value={values.name} />
              <div className="epform__error">
                {errors.name ? errors.name : null}
              </div>
            </div>
            <div className={`epform__group ${errors.company_name ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="company_name">
                {t('company-name')}
              </label>
              <input className="epform__input" id="company_name" type="text" onChange={handleChange} value={values.company_name} />
              <div className="epform__error">
                {errors.company_name ? errors.company_name : null}
              </div>
            </div>
            <div className={`epform__group ${errors.line_1 ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="line_1">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('street-address')}
              </label>
              <input className="epform__input" id="line_1" type="text" onChange={handleChange} value={values.line_1} />
              <div className="epform__error">
                {errors.line_1 ? errors.line_1 : null}
              </div>
            </div>
            <div className={`epform__group ${errors.line_2 ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="line_2">
                {t('extended-address')}
              </label>
              <input className="epform__input" id="line_2" type="text" onChange={handleChange} value={values.line_2} />
              <div className="epform__error">
                {errors.line_2 ? errors.line_2 : null}
              </div>
            </div>
            <div className={`epform__group ${errors.county ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="county">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('county')}
              </label>
              <input className="epform__input" id="county" type="text" onChange={handleChange} value={values.county} />
              <div className="epform__error">
                {errors.county ? errors.county : null}
              </div>
            </div>
            <div className={`epform__group ${errors.country ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="country">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('country')}
              </label>
              <input className="epform__input" id="country" type="text" onChange={handleChange} value={values.country} />
              <div className="epform__error">
                {errors.country ? errors.country : null}
              </div>
            </div>
            <div className={`epform__group ${errors.phone_number ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="phone_number">
                {t('phone-number')}
              </label>
              <input className="epform__input" id="phone_number" type="text" onChange={handleChange} value={values.phone_number} />
              <div className="epform__error">
                {errors.phone_number ? errors.phone_number : null}
              </div>
            </div>
            <div className={`epform__group ${errors.city ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="city">
                {t('city')}
              </label>
              <input className="epform__input" id="city" type="text" onChange={handleChange} value={values.city} />
              <div className="epform__error">
                {errors.city ? errors.city : null}
              </div>
            </div>
            <div className={`epform__group ${errors.postcode ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="postcode">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('postal-сode')}
              </label>
              <input className="epform__input" id="postcode" type="text" onChange={handleChange} value={values.postcode} />
              <div className="epform__error">
                {errors.postcode ? errors.postcode : null}
              </div>
            </div>
            <div className={`epform__group ${errors.instructions ? '--error' : ''}`}>
              <label className="epform__label" htmlFor="instructions">
                {t('instructions')}
              </label>
              <input className="epform__input" id="instructions" type="text" onChange={handleChange} value={values.instructions} />
              <div className="epform__error">
                {errors.instructions ? errors.instructions : null}
              </div>
            </div>
            <div className="epform__group --btncontainer">
              <button className="epbtn --bordered" type="button" id="login_modal_login_button" onClick={handleClose}>
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
