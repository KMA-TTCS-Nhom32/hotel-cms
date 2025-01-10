import { Term } from '@ahomevilla-hotel/node-sdk';
import { create } from 'zustand';

export type TranslationStore = {
  terms: Term[];
  setTerms: (terms: Term[]) => void;
};

export const useTranslationStore = create<TranslationStore>((set) => ({
  terms: [],
  setTerms: (terms) => set({ terms }),
}));
