import React, { useState } from 'react';

import './VariationOptions.scss';


interface Option {
  id: string,
  name: string,
}

interface Variation {
  options: Option[]
}

interface VariationOptionsParams {
  variation: Variation,
  defaultOption: boolean,
  onChange: (option: Option, variation: Variation) => void,
}

export const VariationOptions: React.FC<VariationOptionsParams> = ({ variation, defaultOption, onChange }) => {

  const [checkedOption, setCheckedOption] = useState(defaultOption);
  const handleChange = (option: any) => {
    setCheckedOption(option.id);
    onChange(option, variation);
  };

  return (
    <div className="variationoptions">
      {variation.options.map((option: any) => (
        <div className="variationoptions__button" key={option.id}>
          <input
            className="variationoptions__input"
            type="radio"
            id={option.id}
            name={option.name}
            onChange={() => handleChange(option)}
            value={option.id}
            checked={checkedOption === option.id}
          />
          <label
            className="variationoptions__label"
            htmlFor={option.id}
          >
            {option.name}
          </label>
        </div>
      ))}
    </div>
  );
};
