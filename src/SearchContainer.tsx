import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { SearchBox, Hits } from 'react-instantsearch-dom';
import { createSearchUrl } from './routes';

import { ReactComponent as MagnifyingGlassIcon } from './images/icons/magnifying_glass.svg';

import './SearchContainer.scss';

interface SearchBoxProps {
}

export const SearchContainer: React.FC<SearchBoxProps> = () => {
  const [ hitsVisible, setHitsVisible ] = useState(false);
  const history = useHistory();

  const searchContainerRef = useOnclickOutside(() => {
    setHitsVisible(false);
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setHitsVisible(false);
    const form = event.currentTarget;
    const keywords = form?.getElementsByTagName('input')[0]?.value ?? '';
    if (keywords) {
      const searchUrl = createSearchUrl(keywords);
      history.push(searchUrl);
    }
  };

  const handleFocus = () => {
    setHitsVisible(true);
  };

  const handleLinkClick = () => {
    setHitsVisible(false);
  };

  const Hit = ({ hit }: any) => {
    return (
      <Link className="search-container__hint" to={`/product/${hit.slug}`} onClick={handleLinkClick}>
        <img
          className="search-container__image"
          src={hit.imgUrl}
          alt={hit.name}
        />
        <p className="search-container__hint-text">{hit.name}</p>
      </Link>
    );
  };


  return (
    <div ref={searchContainerRef} className="search-container">
      <div className="search-container__input">
        {/*@ts-ignore*/}
        <SearchBox onFocus={handleFocus}
          searchAsYouType
          showLoadingIndicator
          onSubmit={handleSubmit}
          submit={<MagnifyingGlassIcon />}
        />
        { hitsVisible &&
          <div className="search-container__hints">
            <Hits
              hitComponent={Hit}
            />
          </div>
        }
      </div>
    </div>
  );
};
