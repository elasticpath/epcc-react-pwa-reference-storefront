import React, { useEffect, useState } from 'react';
import * as moltin from '@moltin/sdk';
import { loadImageHref } from './service';

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

export function useProductImages(product: moltin.Product | undefined) {
  const [productImageHrefs, setProductImageHrefs] = useState<string[]>([]);

  useEffect(() => {
    let isCurrent = true;
    setProductImageHrefs([]);

    (async () => {
      // Load main image first so it can be presented right away and then load additional files one by one
      const result: string[] = [];
      const mainImageId = product?.relationships?.main_image?.data?.id;
      if (mainImageId) {
        const mainImageHref = await loadImageHref(mainImageId);

        if (!isCurrent) {
          return;
        }

        if (mainImageHref) {
          result.push(mainImageHref);
          setProductImageHrefs(result);
        }
      }

      const files = product?.relationships?.files?.data ?? [];
      for (const file of files) {
        const imageHref = await loadImageHref(file.id);

        if (!isCurrent) {
          return;
        }

        if (imageHref) {
          result.push(imageHref);
          setProductImageHrefs([...result]);
        }
      }
    })();

    return () => { isCurrent = false; };
  }, [product]);

  return productImageHrefs;
}

export function useMessages() {
  
}
