import { useState, useEffect } from 'react';
import constate from 'constate';
import { Category, loadCategoryTree, Product } from './service';
import { config } from './config';

function flatTree(tree: Category[]): Category[] {
  return [
    ...tree.map(c => ({ ...c, children: undefined })),
    ...tree.flatMap(c => c.children ? flatTree(c.children) : []),
  ];
}

function useCategoriesState() {
  const [categoriesTree, setCategoriesTree] = useState<Category[]>();
  const [categoriesFlat, setCategoriesFlat] = useState<Category[]>();

  const categoryBySlug = (slug: string) => {
    return categoriesFlat?.filter(c => c.slug === slug)[0];
  };

  useEffect(() => {
    loadCategoryTree().then(result => {
      setCategoriesTree(result);
      setCategoriesFlat(flatTree(result));
    });
  }, []);

  return {
    categoriesTree,
    categoriesFlat,
    categoryBySlug,
  };
}

function useCompareProductsState() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  const isComparing = (productId: string) => compareProducts.filter(p => p.id === productId).length > 0;
  const isCompareEnabled = (productId: string) => isComparing(productId) || compareProducts.length < config.maxCompareProducts;

  const addToCompare = (product: Product) => {
    if (!compareProducts.find(p => p.id === product.id)) {
      setCompareProducts([...compareProducts, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
  }

  const removeAll = () => {
    setCompareProducts([]);
  }

  return {
    compareProducts,
    isComparing,
    isCompareEnabled,
    addToCompare,
    removeFromCompare,
    removeAll,
  };
}

function useGlobalState() {
  return {
    categories: useCategoriesState(),
    compareProducts: useCompareProductsState(),
  };
}

export const [
  AppStateProvider,
  useCategories,
  useCompareProducts,
] = constate(
  useGlobalState,
  value => value.categories,
  value => value.compareProducts
);
