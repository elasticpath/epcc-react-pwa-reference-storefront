import React from 'react';
import { useTranslation } from './app-state';

import './Availability.scss';


interface AvailabilityProps {
  available: boolean,
}

export const Availability: React.FC<AvailabilityProps> = (props) => {
  const { available } = props;

  const { t } = useTranslation();

  return (
    <div className="availability">
      {available ? t('available') : t('out-of-stock')}
    </div>
  );
};
