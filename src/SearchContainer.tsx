import React, {useEffect, useRef, useState} from 'react';
import { Link, useHistory } from 'react-router-dom';
// @ts-ignore
import { SearchBox, Hits } from 'react-instantsearch-dom';
import { createSearchUrl } from './routes';

import { ReactComponent as MagnifyingGlassIcon } from './images/icons/magnifying_glass.svg';

import './SearchContainer.scss';

interface SearchBoxProps {
}

export const SearchContainer: React.FC<SearchBoxProps> = () => {
  const [ hitsVisible, setHitsVisible ] = useState(false);
  const history = useHistory();

  const searchContainerRef: any = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setHitsVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, [searchContainerRef]);

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

  const handleFocus = (event: any) => {
    setHitsVisible(true);
  };

  const handleLinkClick = (event: any) => {
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
        <SearchBox
          searchAsYouType
          showLoadingIndicator
          onFocus={handleFocus}
          onSubmit={handleSubmit}
          submit={<MagnifyingGlassIcon />}
          translations={{
            placeholder: 'Search tere...',
          }}
        />
        { hitsVisible &&
          <Hits
            className="search-container__hints"
            hitComponent={Hit}
          />
        }
      </div>
    </div>
  );
};
