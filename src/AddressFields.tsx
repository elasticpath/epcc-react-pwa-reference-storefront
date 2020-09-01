import React, {useState} from 'react';
import { useTranslation } from './app-state';
import { PlacesSuggest } from './PlacesSuggest';
import { useFormik } from 'formik';

import './AddressFields.scss';

interface CheckoutParams {
  items: any,
  type: string,
  handlePage: (route: string) => any,
}

interface FormValues {
  id: string,
  first_name: string,
  last_name: string,
  line_1: string,
  line_2: string,
  city: string,
  county: string,
  country: string,
  postcode: string,
  phone_number: string,
  instructions: string,
}

export const AddressFields: React.FC<CheckoutParams> = (props) => {
  const { items, type, handlePage } = props;
  const [editing, setEditing] = useState(false);

  const { t } = useTranslation();

  let initialValues: FormValues = {
    id: '',
    first_name: '',
    last_name: '',
    line_1: '',
    line_2: '',
    city: '',
    county: '',
    country: '',
    postcode: '',
    phone_number: '',
    instructions: '',
  };

  const onPlacesChange = (suggestion: any) => {
    const address = {
      id: '',
      first_name: '',
      last_name: '',
      line_1: suggestion.name || '',
      line_2: suggestion.line_2 || '',
      city: suggestion.city || '',
      county: suggestion.county || '',
      country: suggestion.country || '',
      postcode: suggestion.postcode || '',
      phone_number: '',
      instructions: '',
    };
    setValues(address);
    setEditing(true)
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
    if (!values.city) {
      errors.city = t('required');
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

  const {handleSubmit, handleChange, resetForm, values, errors, setValues} = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      handlePage('billing')
    },
  });

  return (
    <div className="address">

      <div className="address__main">
        <PlacesSuggest
          label={type}
          onChange={({suggestion}: any) => {
            onPlacesChange(suggestion)
          }}
          onClear={() => resetForm({})}
        />
        {!editing && (
          <button onClick={() => setEditing(true)} className="address__addressbutton">
            {t('enter-address-manually')}
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={handleSubmit}>
          <div className="address__field --addspace">
            <div className="address --styledinput">
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
            <div className="address --styledinput">
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
          </div>
          <div className="address__field">
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
          <div className="address__field">
            <label className="epform__label" htmlFor="line_2">
              {t('extended-address')}
            </label>
            <input className="epform__input" id="line_2" type="text" onChange={handleChange} value={values.line_2} />
          </div>
          <div className="address__field --addspace">
            <div className="address --styledinput">
              <label className="epform__label" htmlFor="city">
                <span className="required-label">
                  *
                </span>
                &nbsp;
                {t('city')}
              </label>
              <input className="epform__input" id="city" type="text" onChange={handleChange} value={values.city} />
              <div className="epform__error">
                {errors.city ? errors.city : null}
              </div>
            </div>
            <div className="address --styledinput">
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
          </div>
          <div className="address__field --addspace">
            <div className="address --styledinput">
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
            <div className="address --styledinput">
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
          </div>
          <div className="address__field">
            <label className="epform__label" htmlFor="phone_number">
              {t('phone-number')}
            </label>
            <input className="epform__input" id="phone_number" type="text" onChange={handleChange} value={values.phone_number} />
          </div>
          <div className="address__field">
            <label className="epform__label" htmlFor="instructions">
              {t('instructions')}
            </label>
            <input className="epform__input" id="instructions" type="text" onChange={handleChange} value={values.instructions} />
          </div>
          <button className="epbtn --secondary" type="submit">Continue to billing information</button>
        </form>
      )}
    </div>
  )
};
