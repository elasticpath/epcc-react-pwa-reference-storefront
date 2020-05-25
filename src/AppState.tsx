import React from 'react';
import { StoreProvider, createStore, createTypedHooks, Action, action, Thunk, thunk } from 'easy-peasy';
import { Category, loadCategoryTree } from './service';

function flatTree(tree: Category[]): Category[] {
  return [
    ...tree.map(c => ({ ...c, children: undefined })),
    ...tree.flatMap(c => c.children ? flatTree(c.children) : []),
  ];
}

interface AppStoreModel {
  loadingCount: number;
  categoriesTree: Category[] | undefined;
  categoriesFlat: Category[] | undefined;
  incLoadingCount: Action<AppStoreModel>;
  decLoadingCount: Action<AppStoreModel>;
  setCategories: Action<AppStoreModel, Category[]>;
  init: Thunk<AppStoreModel>;
}

const storeModel: AppStoreModel = {
  loadingCount: 0,
  categoriesTree: undefined,
  categoriesFlat: undefined,
  incLoadingCount: action(state => { state.loadingCount = state.loadingCount + 1; }),
  decLoadingCount: action(state => { state.loadingCount = state.loadingCount - 1; }),
  setCategories: action((state, categoriesTree) => {
    state.categoriesTree = categoriesTree;
    state.categoriesFlat = flatTree(categoriesTree);
  }),
  init: thunk(async (actions) => {
    const categoriesTree = await loadCategoryTree();
    actions.setCategories(categoriesTree);
  }),
};

const store = createStore(storeModel);
store.getActions().init();

const { useStoreState, useStoreActions } = createTypedHooks<AppStoreModel>();

export const AppState: React.FC = (props) => {
  return (
    <StoreProvider store={store}>
      {props.children}
    </StoreProvider>
  )
};

export function useCategoriesTree(): Category[] | undefined {
  const categoriesTree = useStoreState(state => state.categoriesTree);
  return categoriesTree;
}

export function useCategoriesFlat(): Category[] | undefined {
  const categoriesFlat = useStoreState(state => state.categoriesFlat);
  return categoriesFlat;
}

export function useCategoryBySlug(slug: string): Category | undefined {
  const categoriesFlat = useStoreState(state => state.categoriesFlat);
  return categoriesFlat?.filter(c => c.slug === slug)[0];
}

export function useLoadingCount() {
  const loadingCount = useStoreState(state => state.loadingCount);
  const incLoadingCount = useStoreActions(actions => actions.incLoadingCount);
  const decLoadingCount = useStoreActions(actions => actions.decLoadingCount);

  return {
    loadingCount,
    incLoadingCount,
    decLoadingCount
  };
}
