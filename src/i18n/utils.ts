import {ui} from './ui';
import {i18n} from "astro:config/client";
import {getLocaleByPath, pathHasLocale} from "astro:i18n";


// types from Astro config
type LocaleConfig = string | { path: string; codes: string[] };
type Locales = LocaleConfig[];
export const defaultLocale = i18n?.defaultLocale || 'en'
export function isDefaultLocale(locale: string)  {
    return defaultLocale == locale
}
function getLocales(locales: Locales = i18n?.locales ?? []) {
    const codes = locales.flatMap((locale) =>
        typeof locale === 'string' ? locale : locale.codes
    );
    return [...new Set(codes)];
}

export const locales = getLocales();

export function getLangFromUrl(url: URL) {
    // limit to the first one since Astro only supports path that only contains paths defined
    const path = url.pathname.split("/")[0];
    if (!pathHasLocale(path)) {
        return defaultLocale;
    }
    const uiKey = getLocaleByPath(path);
    if (uiKey in ui) return uiKey as keyof typeof ui;
    return defaultLocale;
}


export function useTranslations(lang: keyof typeof ui) {
    return function t(key: string) {
        const langTranslations = ui[lang] as Record<string, string>;
        const defaultTranslations = ui[defaultLocale as keyof typeof ui] as Record<string, string>;
        return langTranslations[key] || defaultTranslations[key];
    }
}

export function useTranslatedPath(lang: keyof typeof ui) {
    return function translatePath(path: string, l: string = lang) {
        return i18n?.routing !== "manual" && !i18n?.routing?.prefixDefaultLocale && l === defaultLocale ? path : `/${l}${path}`
    }
}