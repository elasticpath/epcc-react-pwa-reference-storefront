
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import { register, login } from './service';
import { useCustomerData, useTranslation } from './app-state';

import './RegistrationForm.scss';

export const RegistrationForm: React.FC = (props) => {
  const { setCustomerData } = useCustomerData();
  const { t } = useTranslation();
  const history = useHistory();

  const [registrationErrors, setRegistrationErrors] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      RegFormFirstName: '',
      RegFormLastName: '',
      RegFormUserName: '',
      RegFormPassword: '',
      RegFormPasswordConfirm: '',
    },
    onSubmit: (values) => {
      if (values.RegFormPassword !== values.RegFormPasswordConfirm) {
        setRegistrationErrors(t('password-confirm-error'));
        return;
      }
      setRegistrationErrors('');
      setIsLoading(true);

      register(`${values.RegFormFirstName} ${values.RegFormLastName}`, values.RegFormUserName, values.RegFormPassword)
        .then(() => {
          login(values.RegFormUserName.toLowerCase(), values.RegFormPassword).then((result) => {
            setIsLoading(false);
            setCustomerData(result.token, result.id);
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
        {registrationErrors ? (registrationErrors) : ('')}
      </div>

      <div className={`registrationform__content ${isLoading ? '--loading' : ''}`}>
        <form className="epform" onSubmit={formik.handleSubmit}>
          <div className="epform__group">
            <label htmlFor="RegFormFirstName" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              {t('first-name')}
            </label>
            <input id="RegFormFirstName" name="RegFormFirstName" className="epform__input" type="text" onChange={formik.handleChange} value={formik.values.RegFormFirstName} />
          </div>
          <div className="epform__group">
            <label htmlFor="RegFormLastName" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              {t('last-name')}
            </label>
            <input id="RegFormLastName" name="RegFormLastName" className="epform__input" type="text" onChange={formik.handleChange} value={formik.values.RegFormLastName} />
          </div>
          <div className="epform__group">
            <label htmlFor="RegFormUserName"  className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              {t('email-slash-username')}
            </label>
            <input id="RegFormUserName" name="RegFormUserName" className="epform__input" type="email" onChange={formik.handleChange} value={formik.values.RegFormUserName} />
          </div>
          <div className="epform__group">
            <label htmlFor="RegFormPassword" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              {t('password')}
            </label>
            <input id="RegFormPassword" name="RegFormPassword" className="epform__input" type="password" onChange={formik.handleChange} value={formik.values.RegFormPassword} />
          </div>
          <div className="epform__group">
            <label htmlFor="RegFormPasswordConfirm" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              {t('password-confirmation')}
            </label>
            <input id="RegFormPasswordConfirm" name="RegFormPasswordConfirm" className="epform__input" type="password" onChange={formik.handleChange} value={formik.values.RegFormPasswordConfirm} />
          </div>
          <div className="epform__group --btn-container">
            {
              (isLoading) ? <div className="epminiLoader --centered" /> : ('')
            }
            <button className="epbtn --primary" id="registration_form_register_button" type="submit">
              {t('submit')}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
