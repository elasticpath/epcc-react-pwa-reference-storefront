import React, { useState, useCallback } from 'react';

interface IErrorMessage {
  message: string,
  status: number,
  source: string,
  title: string,
  detail: string,
  request_id?: string,
}

interface IErrorParams {
  error: IErrorMessage[] | null,
  addError: (message: IErrorMessage[]) => void,
  removeError: () => void,
}

export const APIErrorContext = React.createContext<IErrorParams>({
  error: null,
  addError: () => {},
  removeError: () => {}
});

export const APIErrorProvider = ({ children }: any) => {
  const [error, setError] = useState<IErrorMessage[] | null>(null);
  const removeError = () => setError([]);
  const addError = (message: IErrorMessage[]) => setError(message);

  const contextValue = {
    error,
    addError: useCallback((message) => addError(message), []),
    removeError: useCallback(() => removeError(), [])
  };

  return (
    <APIErrorContext.Provider value={contextValue}>
      {children}
    </APIErrorContext.Provider>
  );
};
