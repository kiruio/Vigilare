import { useI18nStore } from '../stores/i18n';

export const useI18n = () => {
	const { t, lang, setLang } = useI18nStore();

	return {
		t,
		lang,
		setLang,
	};
};
