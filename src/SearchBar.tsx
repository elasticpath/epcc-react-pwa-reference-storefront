import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
// @ts-ignore
import { SearchBox, Hits } from 'react-instantsearch-dom';
import { createSearchUrl } from './routes';

import { ReactComponent as MagnifyingGlassIcon } from './images/icons/magnifying_glass.svg';

import './SearchBar.scss';

interface SearchBoxProps {
}

export const SearchBar: React.FC<SearchBoxProps> = () => {
  const [ inputVisible, setInputVisible] = useState(false);
  const [ hitsVisible, setHitsVisible ] = useState(false);
  const history = useHistory();

  const searchBarRef = useOnclickOutside(() => {
    setHitsVisible(false);
  });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setHitsVisible(false);
    const searchUrl = createSearchUrl();
    history.push(searchUrl);
  };

  const handleFocus = () => {
    setHitsVisible(true);
    setInputVisible(true);
  };

  const handleLinkClick = () => {
    setHitsVisible(false);
  };

  const onInputShow = () => {
    setInputVisible(!inputVisible);
  };

  const onCancel = () => {
    setInputVisible(false);
  };

  const Hit = ({ hit }: any) => {
    return (
      <Link className="searchbar__hint" to={`/product/${hit.slug}`} onClick={handleLinkClick}>
        <img
          className="searchbar__image"
          src={hit.imgUrl}
          alt={hit.name}
        />
        <p className="searchbar__hint-text">{hit.name}</p>
      </Link>
    );
  };


  return (
    <div ref={searchBarRef} className="searchbar">
      <button
        className="searchbar__open"
        onClick={onInputShow}
      >
        <MagnifyingGlassIcon />
      </button>
      <div className={`searchbar__input ${inputVisible ? '--show' : ''}`}>
        {/*@ts-ignore*/}
        <SearchBox onFocus={handleFocus}
          searchAsYouType
          showLoadingIndicator
          onSubmit={handleSubmit}
          submit={<MagnifyingGlassIcon />}
        />
        <button
          className="searchbar__close"
          onClick={onCancel}>
          Close
        </button>
        { hitsVisible &&
          <div className="searchbar__hints">
            <Hits
              hitComponent={Hit}
            />
          </div>
        }
      </div>
    </div>
  );
};
