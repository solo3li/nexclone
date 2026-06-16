import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'ar' | 'en';

interface LanguageState {
  language: Language;
  direction: 'rtl' | 'ltr';
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      direction: 'rtl',
      setLanguage: (lang) => set({ language: lang, direction: lang === 'ar' ? 'rtl' : 'ltr' }),
      toggleLanguage: () => set((state) => {
        const newLang = state.language === 'ar' ? 'en' : 'ar';
        return { language: newLang, direction: newLang === 'ar' ? 'rtl' : 'ltr' };
      }),
    }),
    {
      name: 'language-storage',
    }
  )
);
