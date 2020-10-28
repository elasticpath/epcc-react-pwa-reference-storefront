import React, { useContext, useState } from 'react';
import * as moltin from '@moltin/sdk';
import { useAddressData } from './app-state';
import { deleteAddress } from './service';
import { useTranslation } from './app-state';
import { AddressForm } from './AddressForm';
import { DeleteAddressDialog } from './DeleteAddressDialog';
import { APIErrorContext } from "./APIErrorProvider";

import './Address.scss';

export const Address: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteAddress, setSelectedDeleteAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addressData, updateAddresses } = useAddressData();
  const { addError } = useContext(APIErrorContext);

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
        addError(error.errors);
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
    setSelectedAddress({});
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setSelectedAddress({});
    setIsModalOpen(false);
  };

  return (
    <div className="address">
      <h1 className="address__title">{t("address-book")}</h1>
      {addressData && addressData.length > 0 ? (
        <div className="address__maincontainer">
          {addressData.map((address: moltin.Address) => (
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
        </div>
      ) : (
        <div>
          <div>
            {t('no-addresses')}
          </div>
          <button className="address__addnewaddress --noaddresses" onClick={handleAddNewAddress} >{t('add-new-address')}</button>
        </div>
      )}
      {isModalOpen && (
        <AddressForm isModalOpen={isModalOpen} handleModalClose={handleModalClose} addressData={selectedAddress} />
      )}
      {isDeleteModalOpen && (
        <DeleteAddressDialog isDeleteModalOpen={isDeleteModalOpen} handleCancelDelete={handleCancelDelete} onDeleteAddress={onDeleteAddress} isLoading={isLoading} />
      )}
    </div>
  )
};
