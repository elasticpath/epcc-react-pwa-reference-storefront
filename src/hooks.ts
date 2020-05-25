import React, { useEffect, useState } from 'react';

type FetchHookResult<R> = [
  R | undefined,
  boolean,
  any,
];

export function useResolve<R>(promiseFn: () => Promise<R> | undefined, deps?: React.DependencyList): FetchHookResult<R> {
  const [result, setResult] = useState<FetchHookResult<R>>([undefined, true, undefined]);

  useEffect(() => {
    let isCurrent = true;
    setResult([undefined, true, undefined]);
    const promise = promiseFn();

    if (promise) {
      promise
        .then(result => {
          if (isCurrent) {
            setResult([result, false, undefined]);
          }
        })
        .catch(error => {
          if (isCurrent) {
            setResult([undefined, false, error]);
          }
        });
    }

    return () => { isCurrent = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}
