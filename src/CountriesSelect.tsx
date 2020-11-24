import React from 'react';
import countriesList from './data/countriesList.json';

interface CountriesSelectParams {
  value: string,
  onChange: (...args: any) => void,
}

export const CountriesSelect: React.FC<CountriesSelectParams> = (props) => {
  const { value, onChange } = props;
  const sortedCountries = countriesList
    .sort((a, b) => {
      if (a['value'] > b['value']) {
        return 1;
      }
      return -1;
    });

  return (
    <select id="country" name="country" className="epform__input" value={value} onChange={onChange} onBlur={onChange}>
      <option value="" />
      {sortedCountries.map(country => (
        <option key={country.key} value={country.key}>
          {country['value']}
        </option>
      ))}
    </select>
  );
};
