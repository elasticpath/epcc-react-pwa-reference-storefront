import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import useOnclickOutside from 'react-cool-onclickoutside';
import { SearchBox, Hits, PoweredBy, VoiceSearch } from 'react-instantsearch-dom';
import { useTranslation } from './app-state';
import { createSearchUrl } from './routes';

import { ReactComponent as MagnifyingGlassIcon } from './images/icons/magnifying_glass.svg';
import { ReactComponent as ClearIcon } from './images/icons/ic_clear.svg';
import Icon_SearchMic from './images/icons/icon-search-mic.svg'
import Icon_SearchMicHover from './images/icons/icon-search-mic-hover.svg'
import Icon_SearchMicActive from './images/icons/icon-search-mic-active.svg'

import './SearchBar.scss';
import styled, { keyframes } from 'styled-components'

interface SearchBoxProps {
}

interface VoiceSearchProps{
  defaultIcon: any;
  hoverIcon: any;
  activeIcon: any;
}

const SearchButton = styled.button<VoiceSearchProps>`
  all: unset;
  display: block;
  width: 36px;
  height: 36px;
  border-radius: 36px;
  margin-left: 8px;
  cursor: pointer;

  background-image: url(${props => props.defaultIcon});
  background-repeat: no-repeat;
  background-position: center;

  &:hover {
    background-image: url(${props => props.hoverIcon});
  }

  &:active {
    background-image: url(${props => props.activeIcon});
  }
`

const breatheAnimation = keyframes`
  100% { opacity: 1 }
  50% { opacity: 0.65 }
`

const SearchButtonBreating = styled(SearchButton)`
  animation-name: ${breatheAnimation};
  animation-duration: 0.9s;
  animation-iteration-count: infinite;
`

const SearchButtonMic = (props: any) => (
  props.isListening ?
    <SearchButtonBreating as="span"
      defaultIcon={Icon_SearchMic}
      hoverIcon={Icon_SearchMicHover}
      activeIcon={Icon_SearchMicActive}
      {...props} /> :
    <SearchButton as="span"
      defaultIcon={Icon_SearchMic}
      hoverIcon={Icon_SearchMicHover}
      activeIcon={Icon_SearchMicActive}
      {...props} />
)

export const SearchBar: React.FC<SearchBoxProps> = () => {
  const { t } = useTranslation();
  const [ inputVisible, setInputVisible] = useState(false);
  const [ hitsVisible, setHitsVisible ] = useState(false);
  const [ searchValue, setsSearchValue ] = useState(false);
  const history = useHistory();

  const searchBarRef = useOnclickOutside(() => {
    setHitsVisible(false);
  });

  const handleChange = (event: any) => {
    setsSearchValue(event.target.value)
  };

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

  const handleInputToggle = () => {
    setInputVisible(!inputVisible);
  };

  const onCancel = () => {
    setInputVisible(false);
  };

  const VoiceSearchButtonText = ({
    isListening,
    isBrowserSupported
  }: {isListening:any, isBrowserSupported:any}) => (
    isBrowserSupported ? (
      isListening ?
        <SearchButtonMic
          defaultIcon={Icon_SearchMicActive}
          isListening={isListening}
        /> :
        <SearchButtonMic
          isListening={isListening}
          onClick={() => handleFocus()}
        />
    ) : null
  )

  const Hit = ({ hit }: any) => {
    return (
      <Link className="searchbar__hint" to={`/product/${hit.slug}`} onClick={handleLinkClick}>
        <img
          className="searchbar__image"
          src={hit.imgUrl}
          alt=""
        />
        <p className="searchbar__hint-text">{hit.name}</p>
      </Link>
    );
  };

  const translations = {
    placeholder: t('search-here'),
  };

  return (
    <div ref={searchBarRef} className="searchbar">
      <button
        className="searchbar__open"
        onClick={handleInputToggle}
      >
        <MagnifyingGlassIcon />
      </button>
      <div className={`searchbar__input ${inputVisible ? '--show' : ''}`}>
        <SearchBox
          onFocus={handleFocus}
          onChange={handleChange}
          onReset={handleChange}
          searchAsYouType
          onSubmit={handleSubmit}
          submit={<MagnifyingGlassIcon />}
          reset={<ClearIcon />}
          translations={translations}
        />
        <VoiceSearch
          searchAsYouSpeak={true}
          buttonTextComponent={VoiceSearchButtonText}
        />
        <button
          className={`searchbar__close ${searchValue && '--show'}`}
          onClick={onCancel}>
          {t('cancel')}
        </button>
        { hitsVisible &&
          <div className="searchbar__hints">
            <Hits
              hitComponent={Hit}
            />
            <PoweredBy />
          </div>
        }
      </div>
    </div>
  );
};
