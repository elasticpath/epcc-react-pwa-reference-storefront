import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as moltin from '@moltin/sdk';
import { loadCategoryProducts } from './service';
import { useCategories, useTranslation, useCurrency } from './app-state';
import { ProductThumbnail } from './ProductThumbnail';
import { createCategoryUrl } from './routes';
import { Pagination } from './Pagination';
import { useResolve } from './hooks';
import Skeleton from '@material-ui/lab/Skeleton';
import {config} from './config';

import './Category.scss';

function useCategoryProducts(categoryId: string | undefined, pageNum: number) {
  const { selectedLanguage } = useTranslation();
  const { selectedCurrency } = useCurrency();

  const [totalPages, setTotalPages] = useState<number>();

  useEffect(() => {
    // reset number of pages only when changing categories
    setTotalPages(undefined);
  }, [categoryId]);

  const [products] = useResolve(async () => {
    // during initial loading of categories categoryId might be undefined
    if (categoryId) {
      const result = await loadCategoryProducts(categoryId, pageNum, selectedLanguage, selectedCurrency);
      setTotalPages(result.meta.page.total);
      return result;
    }
  }, [categoryId, pageNum, selectedLanguage, selectedCurrency]);

  return { products, totalPages };
}

interface CategoryParams {
  categorySlug: string;
  pageNum?: string;
}

export const Category: React.FC = () => {
  const params = useParams<CategoryParams>();
  const categorySlug = params.categorySlug;
  const { categoryPathBySlug } = useCategories();
  const categoryPath = categoryPathBySlug(categorySlug);
  const category = categoryPath?.[categoryPath?.length - 1];
  const parsedPageNum = parseInt(params.pageNum!);
  const pageNum = isNaN(parsedPageNum) ? 1 : parsedPageNum;

  const { products, totalPages } = useCategoryProducts(category?.id, pageNum);

  return (
    <div className="category">
      {category && products ? (
        <>
          <div className="category__breadcrumbs">
            {categoryPath?.map((category: moltin.Category, index: number) => (
              <React.Fragment key={category.id}>
                {index > 0 && (
                  <span className="category__breadcrumbseparator">{'>'}</span>
                )}
                <a className="category__breadcrumblink" href={createCategoryUrl(category.slug)}>{category.name}</a>
              </React.Fragment>
            ))}
          </div>

          <h1 className="category__categoryname">{category?.name ?? ' '}</h1>

          <ul className="category__productlist">
            {products && products.data.map(product => (
              <li key={product.id} className="category__product">
                <ProductThumbnail product={product} />
              </li>
            ))}
          </ul>

          <div className="category__pagination">
            {totalPages && (
              <Pagination
                totalPages={totalPages}
                currentPage={products?.meta.page.current ?? pageNum}
                formatUrl={(page) => createCategoryUrl(categorySlug, page)}
              />
            )}
          </div>
        </>
      ) : (
        <>
          <Skeleton className="category__breadcrumbs" animation="wave" variant="text" width={200} />
          <Skeleton className="category__categoryname" animation="wave" variant="text" width={150} />
          <ul className="category__productlist">
            {[...Array(config.categoryPageSize).keys()].map((index) =>
                <li key={`skeleton_${index}`} className="category__product">
                  <div className="category__productskeleton">
                    <Skeleton animation="wave" variant="rect" width={180} height={180}/>
                    <Skeleton animation="wave" variant="text" width={180} />
                    <Skeleton animation="wave" variant="text" width={180} />
                    <Skeleton animation="wave" variant="text" width={100} />
                    <Skeleton animation="wave" variant="text" width={100} />
                    <Skeleton animation="wave" variant="text" width={100} />
                  </div>
                </li>
              )
            }
          </ul>
          <Skeleton animation="wave" variant="text" height={46} width={100}/>
        </>
      )}
    </div>
  );
};
