import React from 'react';
import { config } from './config';
import { HomeB2c } from './HomeB2c';
import { HomeB2b } from './HomeB2b';

export const Home: React.FC = () => {
  if (!config.b2b) return ( <HomeB2c />);
  return (
    <HomeB2b />
  );
};
