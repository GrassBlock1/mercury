import {z} from "astro:content";
import {siteConfig} from "../config.ts";

export const authors = ({ image }) => z.object({
    name: z.string().default(siteConfig.defaultAuthor.name),
    email: z.string().email().default(siteConfig.defaultAuthor.email),
    avatar: image().optional(),
    mcplayerid: z.string().optional(),
    social: z.object({
        twitter: z.string().optional(),
        fediverse: z.string().optional(),
    }).optional(),
});