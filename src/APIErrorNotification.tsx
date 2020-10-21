import React, { useContext } from "react";
import { APIErrorContext } from './APIErrorProvider';
import {ReactComponent as CloseIcon} from "./images/icons/ic_close.svg";
import {ReactComponent as ErrorIcon} from "./images/icons/error-icon.svg";

import './APIErrorNotification.scss';

interface IErrorMessage {
  message: string,
  status: number,
  source: string,
  title: string,
  detail: string,
  request_id?: string,
}

export const APIErrorNotification = () => {
  const { error, removeError } = useContext(APIErrorContext);

  const handleCloseModal = () => {
    removeError()
  };

  return (
    <div className="notification">
      {!!error && error.length > 0 && error.map((el: IErrorMessage) => (
        <div className="notification__body" key={`${el.detail}_${Math.random().toString(36)}`}>
          <ErrorIcon className="notification__erroricon" />
          <div className="notification__details">
            {error && error[0] && error[0].detail && el.detail}
          </div>
          <button
            className="notification__closebtn"
            type="button"
            aria-label="close"
            onClick={handleCloseModal}>
          <CloseIcon />
          </button >
        </div>
        ))}
    </div>
  )
};
