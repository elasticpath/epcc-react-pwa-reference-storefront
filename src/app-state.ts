import { useState, useEffect } from 'react';
import constate from 'constate';
import { Category, loadCategoryTree, Product } from './service';
import { config } from './config';


function getCategoryPaths(categories: Category[]): { [categoryId: string]: Category[] } {
  const lastCat = categories[categories.length - 1];

  let map: { [categoryId: string]: Category[] } = {
    [lastCat.slug]: [...categories]
  };

  const childCats = lastCat.children ?? [];

  for (const child of childCats) {
    map = { ...map, ...getCategoryPaths([...categories, child]) };
  }

  return map;
}

function mergeMaps(tree: Category[]): { [categoryId: string]: Category[] } {
  return tree.reduce((acc, c) => ({ ...acc, ...getCategoryPaths([c]) }), {});
}

function useCategoriesState() {
  const [categoryPaths, setCategoryPaths] = useState<{ [categoryId: string]: Category[] }>();

  const [categoriesTree, setCategoriesTree] = useState<Category[]>();

  useEffect(() => {
    loadCategoryTree().then(result => {
      setCategoriesTree(result);
      setCategoryPaths(mergeMaps(result));
    });
  }, []);

  const categoryPathBySlug = (slug: string) => {
    return categoryPaths?.[slug];
  };

  return {
    categoriesTree,
    categoryPathBySlug,
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
