import React, { useState } from 'react';
import { VariationOptions } from './VariationOptions';

import './VariationsSelector.scss';


interface VariationsSelectorParams {
  product: any
  onChange: (childID: string) => any
}

export const VariationsSelector: React.FC<VariationsSelectorParams> = ({ product, onChange }) => {
  const { variations, variation_matrix: variationMatrix } = product.meta;

  const initialOptions = variations.reduce(
    (acum: any, variation: any) => ({ ...acum, [variation.id]: variation.options[0].id }),
    {}
  );

  const [selectedOptions, setSelectedOptions] = useState(initialOptions);

  const getChildID = (options: any, prodMatrix: any): any => {
    if (options.length !== 0 && typeof prodMatrix === 'string') {
      return prodMatrix
    }

    for (const x in options) {
      if (options.hasOwnProperty(x) && prodMatrix[options[x]]) {
        const subMatrix = prodMatrix[options[x]];
        return getChildID(options, subMatrix);
      }
    }
    return null;
  };

  const processOptions = (updatedOptions: any) => {
    const options = Object.values(updatedOptions);
    const childID = getChildID(options, variationMatrix);
    onChange(childID);
  };

  const handleChange = (option: any, variation: any): any => {
    const updatedOptions = { ...selectedOptions, [variation.id]: option.id };
    setSelectedOptions(updatedOptions);
    processOptions(updatedOptions);
  };

  return (
    <div className="variationsselector">
      {variations.map((variation: any) => (
        <div key={variation.id}>
          <div className="variationsselector__title">{variation?.name}:</div>
          <VariationOptions
            variation={variation}
            key={variation.id}
            defaultOption={selectedOptions[variation.id]}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};
