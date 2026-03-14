import {ui, defaultLang, showDefaultLang} from './ui';
import {i18n} from "astro:config/client";

// types from Astro config
type LocaleConfig = string | { path: string; codes: string[] };
type Locales = LocaleConfig[];

export function getLocalePathMap(locales: Locales = i18n?.locales ?? []): Record<string, string> {
    const result: Record<string, string> = {};
    
    for (const locale of locales) {
        if (typeof locale === 'string') {
            // simple
            result[locale] = locale;
        } else {
            // reflect the same path to multiple languages
            for (const code of locale.codes) {
                result[code] = locale.path;
            }
        }
    }
    
    return result;
}

export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in ui) return lang as keyof typeof ui;
    return defaultLang;
}
export const defaultLocale = i18n?.defaultLocale || 'en'
export function isDefaultLocale(locale: string)  {
    return defaultLocale == locale
}

export function useTranslations(lang: keyof typeof ui) {
    return function t(key: string) {
        const langTranslations = ui[lang] as Record<string, string>;
        const defaultTranslations = ui[defaultLang as keyof typeof ui] as Record<string, string>;
        return langTranslations[key] || defaultTranslations[key];
    }
}

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`
    }
}