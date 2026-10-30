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

// content entries are stored as `<locale code>/<path>` under the collection base directory
export function getEntryLocale(id: string): string | undefined {
    const first = id.split("/")[0];
    return locales.includes(first) ? first : undefined;
}

export function getEntryLangPath(id: string): string | undefined {
    const locale = getEntryLocale(id);
    return locale === undefined || locale === defaultLocale ? undefined : getPathByLocale(locale);
}

export function getPostSlug(id: string, slugOnly: boolean = false): string {
    const locale = getEntryLocale(id);
    if (locale === undefined) return slugOnly ? id : `/blog/${id}`;
    const rest = id.split("/").slice(1).join("/");
    if (locale === defaultLocale) return slugOnly ? rest : `/blog/${rest}`;
    const langPath = getPathByLocale(locale);
    return slugOnly ? rest : `/${langPath}/blog/${rest}`;
}

export function getPageSlug(id: string): string {
    const locale = getEntryLocale(id);
    if (locale === undefined) return id;
    const rest = id.split("/").slice(1).join("/");
    return locale === defaultLocale ? rest : `${getPathByLocale(locale)}/${rest}`;
}

export function getLocalizedStaticPaths() {
    return locales
        .filter((locale) => locale !== defaultLocale)
        .map((locale) => ({ params: { lang: getPathByLocale(locale) } }));
}

export function getLangFromUrl(url: URL) {
    // limit to the first one since Astro only supports path that only contains paths defined
    const path = url.pathname.split("/")[1] ?? "";
    if (!pathHasLocale(path)) {
        return defaultLocale;
    }
    const uiKey = getLocaleByPath(path);
    if (uiKey in ui) return uiKey as keyof typeof ui;
    // locale codes and ui keys can differ in case (`zh-CN` vs `zh-cn`), so fall back to the route path
    if (path in ui) return path as keyof typeof ui;
    return defaultLocale;
}


export function useTranslations(lang: keyof typeof ui) {
    return function t(key: string) {
        const langTranslations = ui[lang] as Record<string, string>;
        const defaultTranslations = ui[defaultLocale as keyof typeof ui] as Record<string, string>;
        return langTranslations[key] || defaultTranslations[key];
    }
}
