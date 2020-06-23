
import React, { useState } from 'react';
import { register } from './service';

import './RegistrationForm.scss';

export const RegistrationForm: React.FC = (props) => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [registrationErrors, setRegistrationErrors] = useState('');
  const [failedRegistration, setFailedRegistration] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerNewUser = () => {
    if (password !== passwordConfirm) {
      setRegistrationErrors('The specified passwords do not match');
      setFailedRegistration(true);
      return;
    }
    setRegistrationErrors('');
    setFailedRegistration(false);
    setIsLoading(true);

    register(`${firstName} ${lastName}`, userName, password)
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setFailedRegistration(true);
        setRegistrationErrors('Please fill out all required fields');
        console.error(error);
      });
  }

  const handleEnterKeyPress = (e:any) => {
    if (e.keyCode === 13) {
      registerNewUser();
    }
  }

  return (
    <div className="registrationform container">
      <h1 className="eppagetitle">
        Register a New Account
      </h1>

      <div className="registrationform__feedback">
        {failedRegistration ? (registrationErrors) : ('')}
      </div>

      <div className={`registrationform__content ${isLoading ? '--loading' : ''}`}>
        <form className="epform">
          <div className="epform__group">
            <label htmlFor="registration_form_firstName" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              First Name
            </label>
            <input id="registration_form_firstName" name="given-name" className="epform__input" type="text" onChange={(e) => { setFirstName(e.target.value)}} onKeyDown={handleEnterKeyPress} />
          </div>
          <div className="epform__group">
            <label htmlFor="registration_form_lastName" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              Last Name
            </label>
            <input id="registration_form_lastName" name="family-name" className="epform__input" type="text" onChange={(e) => { setLastName(e.target.value)}} onKeyDown={handleEnterKeyPress} />
          </div>
          <div className="epform__group">
            <label htmlFor="registration_form_emailUsername"  className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              Email/Username
            </label>
            <input id="registration_form_emailUsername" name="username" className="epform__input" type="email" onChange={(e) => { setUserName(e.target.value)}}  onKeyDown={handleEnterKeyPress} />
          </div>
          <div className="epform__group">
            <label htmlFor="registration_form_password" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              Password
            </label>
            <input id="registration_form_password" name="password" className="epform__input" type="password" onChange={(e) => { setPassword(e.target.value)}}  onKeyDown={handleEnterKeyPress} />
          </div>
          <div className="epform__group">
            <label htmlFor="registration_form_passwordConfirm" className="epform__label">
              <span className="epform__label__required">
                *
              </span>
              {' '}
              Password Confirmation
            </label>
            <input id="registration_form_passwordConfirm" name="passwordConfirm" className="epform__input" type="password" onChange={(e) => { setPasswordConfirm(e.target.value)}}  onKeyDown={handleEnterKeyPress} />
          </div>
          <div className="epform__group --btn-container">
            {
              (isLoading) ? <div className="epminiLoader --centered" /> : ('')
            }
            <button className="epbtn --primary" id="registration_form_register_button" type="button" onClick={registerNewUser}>
              Submit
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
