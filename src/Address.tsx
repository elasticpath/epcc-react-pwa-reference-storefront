import React, { useState } from 'react';
import { useAddressData } from './app-state';
import { Address as IAddress, deleteAddress } from './service';
import { useTranslation } from './app-state';
import './Address.scss';

import { AddressForm } from './AddressForm';
import Modal from 'react-responsive-modal';
import { ReactComponent as CloseIcon } from './images/icons/ic_close.svg';

export const Address: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteAddress, setSelectedDeleteAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addressData, updateAddresses } = useAddressData();

  const handleDelete = (addressId: string) => {
    setIsDeleteModalOpen(true);
    setSelectedDeleteAddress(addressId);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedDeleteAddress('');
  };

  const onDeleteAddress = () => {
  const token = localStorage.getItem('mtoken') || '';
  const customer = localStorage.getItem('mcustomer') || '';
  setIsLoading(true);

  deleteAddress(customer, selectedDeleteAddress, token)
    .then(() => {
      updateAddresses();
      setIsLoading(false);
      setIsDeleteModalOpen(false);
    })
    .catch(error => {
      setIsLoading(false);
      setIsDeleteModalOpen(false);
      console.error(error);
    });
  };

  const handleEdit = (address: any) => {
    setSelectedAddress(address);
    setIsModalOpen(!isModalOpen);
  };

  const handleAddNewAddress = () => {
    setSelectedAddress('');
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="address">
      <h1 className="address__title">{t("address-book")}</h1>
      {addressData && addressData.length > 0 ? (
        <div className="address__maincontainer">
          {addressData.map((address: IAddress) => (
            <div className="address__container" key={address.id}>
              <ul className="address__list">
                <li className="">
                  {address.first_name}
                  &nbsp;
                  {address.last_name}
                </li>
                <li className="">
                  {address.line_1}
                </li>
                <li className="">
                  {address.line_2}
                </li>
                <li>
                  <span className="">
                    {address.county}
                    ,&nbsp;
                  </span>
                  <span className="">
                    {(address.country)
                      ? (
                        `${address.country}, `
                      ) : ('')}
                  </span>
                  <span className="">
                    {address.city}
                    &nbsp;
                  </span>
                </li>
                <li className="">
                  {address.postcode}
                </li>
              </ul>
              <button type="button" className="address__button --edit" onClick={() => handleEdit(address)}>
                {t('edit')}
              </button>
              <button type="button" className="address__button --delete" onClick={() => handleDelete(address.id)}>
                {t('delete')}
              </button>
            </div>
          ))}
          <button className="address__addnewaddress" onClick={handleAddNewAddress}>{t('add-new-address')}</button>
          {isModalOpen && (
            <AddressForm isModalOpen={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} addressData={selectedAddress} />
          )}
        </div>
      ) : (
        <div>
          {t('no-addresses')}
        </div>
      )}
      {isDeleteModalOpen && (
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
      )}
    </div>
  )
};
