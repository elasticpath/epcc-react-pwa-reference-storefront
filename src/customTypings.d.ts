import 'react-instantsearch-dom';

declare module 'react-instantsearch-dom' {
  interface SearchBoxProps {
    onFocus: () => void,
  }
}
