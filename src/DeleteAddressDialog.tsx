import React from 'react';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';
import { useTranslation } from './app-state';
import './DeleteAddressDialog.scss';

interface DeleteAddressDialogParams {
  handleCancelDelete: (...args: any[]) => any,
  onDeleteAddress: (...args: any[]) => any,
  isDeleteModalOpen: boolean,
  isLoading: boolean,
}

export const DeleteAddressDialog: React.FC<DeleteAddressDialogParams> = (props) => {
  const { handleCancelDelete, onDeleteAddress, isDeleteModalOpen, isLoading } = props;

  const { t } = useTranslation();

  return (
  <Modal open={isDeleteModalOpen} onClose={handleCancelDelete} classNames={{modal: 'addressdelete'}} showCloseIcon={false}>
    {
      (isLoading) ? <div className="epminiLoader --centered"/> : ('')
    }
    <div className={`addressdelete__content ${isLoading ? '--loading' : ''}`}>
      <div className="addressdelete__header">
        <h2 className="addressdelete__title">
          {t('delete-address')}
        </h2>
        <button type="button" aria-label="close" onClick={handleCancelDelete}>
          <CloseIcon/>
        </button>
      </div>
      <div className="addressdelete__body">
        {t('delete-address-message')}
      </div>
      <div className="epform__group --btncontainer">
        <button className="epbtn" type="button" onClick={handleCancelDelete}>
          {t('cancel')}
        </button>
        <button className="epbtn --primary" type="button" onClick={onDeleteAddress}>
          {t('delete')}
        </button>
      </div>
    </div>
  </Modal>
  )
};
