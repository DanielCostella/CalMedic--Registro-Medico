import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonEN from './locales/en/common.json';
import authEN from './locales/en/auth.json';
import dashboardEN from './locales/en/dashboard.json';
import patientEN from './locales/en/patient.json';
import medicalEN from './locales/en/medical.json';

import commonES from './locales/es/common.json';
import authES from './locales/es/auth.json';
import dashboardES from './locales/es/dashboard.json';
import patientES from './locales/es/patient.json';
import medicalES from './locales/es/medical.json';

const resources = {
    en: {
        common: commonEN,
        auth: authEN,
        dashboard: dashboardEN,
        patient: patientEN,
        medical: medicalEN
    },
    es: {
        common: commonES,
        auth: authES,
        dashboard: dashboardES,
        patient: patientES,
        medical: medicalES
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        ns: ['common', 'auth', 'dashboard', 'patient', 'medical'],

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        },

        interpolation: {
            escapeValue: false // React already escapes values
        },

        react: {
            useSuspense: false
        }
    });

export default i18n;
