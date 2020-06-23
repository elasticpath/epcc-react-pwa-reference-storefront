
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { login } from './service';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

import './AppModalLogin.scss';

interface AppModalLoginMainProps {
  handleModalClose: (...args: any[]) => any,
  openModal: boolean,
}

export const AppModalLogin: React.FC<AppModalLoginMainProps> = (props) => {
  const { handleModalClose, openModal } = props;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [failedLogin, setFailedLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registerNewUser = () => {
    handleModalClose();
  }

  const handleClose = () => {
    setFailedLogin(false);
    handleModalClose();
  }

  const loginRegisteredUser = (event:any) => {
    event.preventDefault();
    setIsLoading(true);
    login(username.toLowerCase(), password)
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setFailedLogin(true);
        console.error(error);
      });
  };

  const handleEnterKeyPress = (e:any) => {
    if (e.keyCode === 13) {
      loginRegisteredUser(e);
    }
  };

  return (
    <Modal open={openModal} onClose={handleClose} classNames={{ modal: 'appmodallogin' }} showCloseIcon={false}>
      {
        (isLoading) ? <div className="epminiLoader --centered" /> : ('')
      }
      <div className={`appmodallogin__content ${isLoading ? '--loading' : ''}`}>
        <div className="appmodallogin__header">
          <h2 className="appmodallogin__title">
            Login
          </h2>
          <button type="button" aria-label="close" onClick={handleModalClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="appmodallogin__feedback">
          {failedLogin ? 'Your username or password is invalid.' : ('')}
        </div>

        <div className="appmodallogin__body">
          <form className="epform" id="login_modal_form" onSubmit={loginRegisteredUser}>
            <div className="epform__group">
              <label className="epform__label" htmlFor="login_modal_username_input">
                Username:
              </label>
              <input className="epform__input" id="login_modal_username_input" type="text" onChange={(e) => { setUsername(e.target.value)} } onKeyDown={handleEnterKeyPress} />
            </div>
            <div className="epform__group">
              <label className="epform__label" htmlFor="login_modal_password_input">
                Password:
              </label>
              <input className="epform__input" id="login_modal_password_input" type="password" onChange={(e) => { setPassword(e.target.value)}} onKeyDown={handleEnterKeyPress} />
            </div>
            <div className="epform__group --btn-container">
              <button className="epbtn --primary" id="login_modal_login_button" type="submit">
                Login
              </button>
              <Link to='/registration' className="epbtn --primary" id="login_modal_register_button" onClick={registerNewUser}>
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
