import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en.json';
import tr from './locales/tr.json';

const resources = {
    en: { translation: en },
    tr: { translation: tr },
};

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem('user-language');

    if (!savedLanguage) {
        savedLanguage = 'en'; // Default to English
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });
};

initI18n();

export default i18n;
