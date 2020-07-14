import React, {useState} from 'react';
import { useParams } from 'react-router-dom';

import { useAddressData } from './app-state';
import { Address as IAddress } from './service';
import { useTranslation } from './app-state';
import './Address.scss';

import {AddressForm} from "./AddressForm";


interface AddressParams {
  productSlug: string;
}


export const Address: React.FC = () => {
  const { productSlug } = useParams<AddressParams>();
  const { t, selectedLanguage } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addressData = useAddressData();

  const handleDelete = (category: string) => {

  };

  const handleEdit = (category: string) => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="address">
      <h1>Address Book</h1>
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
              <button type="button" className="address__button --edit" onClick={() => handleEdit(address.line_2)}>
                {t('edit')}
              </button>
              <button type="button" className="address__button --delete" onClick={() => handleDelete(address.line_2)}>
                {t('delete')}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {t('no-addresses')}
        </div>
      )}
        <AddressForm isModalOpen={isModalOpen} handleModalClose={() => {setIsModalOpen(false)}} />
    </div>
  )
};
