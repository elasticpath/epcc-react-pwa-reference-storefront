import React, { useState } from 'react';
import { useAddressData } from './app-state';
import { Address as IAddress } from './service';
import { useTranslation } from './app-state';
import './Address.scss';

import {AddressForm} from "./AddressForm";

export const Address: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(false);

  const addressData = useAddressData();

  const handleDelete = (category: string) => {

  };

  const handleEdit = (address: any) => {
    setSelectedAddress(address);
    setIsModalOpen(!isModalOpen);
  };

  const handleAddNewAddress = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="address">
      <h1>{t("address-book")}</h1>
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
              <button type="button" className="address__button --delete" onClick={() => handleDelete(address.line_2)}>
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
    </div>
  )
};
