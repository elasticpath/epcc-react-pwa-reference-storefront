import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { loadCategoryProducts } from './service';
import { useCategories } from './app-state';
import { ProductThumbnail } from './ProductThumbnail';
import { createCategoryUrl } from './routes';
import { Pagination } from './Pagination';
import { useResolve } from './hooks';

import './Category.scss';

function useCategoryProducts(categoryId: string | undefined, pageNum: number) {
  const [totalPages, setTotalPages] = useState<number>();

  useEffect(() => {
    // reset number of pages only when changing categories
    setTotalPages(undefined);
  }, [categoryId]);

  const [products] = useResolve(async () => {
    // during initial loading of categories categoryId mught be undefined
    if (categoryId) {
      const result = await loadCategoryProducts(categoryId, pageNum);
      setTotalPages(result.pagination.totalPages);
      return result;
    }
  }, [categoryId, pageNum]);

  return { products, totalPages };
}

interface CategoryParams {
  categorySlug: string;
  pageNum?: string;
}

export const Category: React.FC = () => {
  const params = useParams<CategoryParams>();
  const categorySlug = params.categorySlug;
  const { categoryBySlug } = useCategories();
  const category = categoryBySlug(categorySlug);
  const parsedPageNum = parseInt(params.pageNum!);
  const pageNum = isNaN(parsedPageNum) ? 1 : parsedPageNum;

  const { products, totalPages } = useCategoryProducts(category?.id, pageNum);

  return (
    <div>
      {category ? (
        <div className="category">

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
                currentPage={products?.pagination?.currentPage ?? pageNum}
                formatUrl={(page) => createCategoryUrl(categorySlug, page)}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="loader" />
      )}
    </div>
  );
};
