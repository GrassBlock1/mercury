import { getCollection } from 'astro:content';
import {defaultLocale, locales} from "@/i18n/utils.ts";
import {getPathByLocale} from "astro:i18n";

export async function GET() {
  const posts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true;
});
  const languages = locales.filter(item => item !== defaultLocale)
  const searchIndex = posts.map(post => ({
    title: post.data.title,
    description: post.data.description || '',
    content: post.body,
    date: post.data.date,
    lang: languages.includes(post.filePath.split("/")[0]) ? getPathByLocale(post.filePath.split("/")[0]) : undefined,
    slug: languages.includes(post.filePath.split("/")[0]) ? post.id.split("/").slice(1).join("/") : post.id
  }));

  return new Response(JSON.stringify(searchIndex), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}