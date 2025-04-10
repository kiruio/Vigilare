/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import { persist } from 'zustand/middleware';

type Lang = 'en' | 'zh';

type Translations = {
	en: Record<string, any>;
	zh: Record<string, any>;
};

const translations: Translations = { en, zh };

interface I18nState {
	lang: Lang;
	setLang: (lang: Lang) => void;
	t: (key: string) => string;
}

export const useI18nStore = create(
	persist<I18nState>(
		(set, get) => ({
			lang: navigator.language.startsWith('zh') ? 'zh' : 'en',
			setLang: (lang) => set({ lang }),
			t: (key) => {
				const keys = key.split('.');
				let value: any = translations[get().lang];

				for (const k of keys) {
					value = value?.[k];
					if (!value) break;
				}

				return value || key; // 找不到键时返回原key
			},
		}),
		{
			name: 'i18n-store',
		}
	)
);
