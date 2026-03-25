import {ui} from './ui';
import {i18n} from "astro:config/client";
import {getLocaleByPath, getPathByLocale, pathHasLocale} from "astro:i18n";


// types from Astro config
type LocaleConfig = string | { path: string; codes: string[] };
type Locales = LocaleConfig[];
export const defaultLocale = i18n?.defaultLocale || 'en'
function getLocales(locales: Locales = i18n?.locales ?? []) {
    const codes = locales.flatMap((locale) =>
        typeof locale === 'string' ? locale : locale.codes
    );
    return [...new Set(codes)];
}

export const locales = getLocales();

export function getPostSlug(id: string,slug: string, slugOnly: boolean = false) {
    const lang = id.split("/")[0]
    const [sLang, ...rSlug] = slug.split("/")
    const realSlug = rSlug.join("/")
    if (locales.includes(lang)) {
        if (lang === defaultLocale) {
            if (slugOnly) {
                return realSlug;
            }
            return `/blog/${realSlug}` // for ${default}/slug slug
        }
        const langPath = getPathByLocale(lang)
        if (sLang === lang) {
            if (slugOnly) {
                return realSlug
            }
            return `/${langPath}/blog/${realSlug}` // for ${nondefault}/${slug} slug
        } else {
            if (slugOnly) {
                return slug;
            }
            return `/${langPath}/blog/${slug}` // for ${slug} slug
        }
    } else {
        if (slugOnly) {
            return slug
        }
        // treat it as the default locale
        return `/blog/${slug}`
    }
}

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