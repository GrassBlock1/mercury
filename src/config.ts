export const siteConfig = {
    title: '/var/log/mercury',
    description: 'A blog about software development, technology, and life.',
    comments: {
        type: 'fediverse', // 'artalk','giscus','fediverse','hatsu'
        artalk: {
            instanceDomain: '', // the domain of your artalk instance
        },
        giscus: {
            // get these params from giscus.app
            repo:"[ENTER REPO HERE]",
            repoId: "[ENTER REPO ID HERE]",
            category:"[ENTER CATEGORY NAME HERE]",
            categoryId:"[ENTER CATEGORY ID HERE]",
            mapping:"pathname",
            strict:"0",
            reactionsEnabled:"1",
            emitMetadata:"0",
            inputPosition:"bottom",
            theme:"preferred_color_scheme",
            lang:"en"
        },
        // WIP
        fediverse: {
            // use Mastodon (compatible) api to search posts and parse replies
            // it will search for the post's link by default
            renderOnServer: false, // render comments on server-side or client-side, may different from the astro config
            // the comments are rendered at the client side by default
            // but if you want to deploy site on Cloudflare pages or so you can set it to true.
            // (but in pure SSG mode, the comments will be rendered at build time, which mean delayed updates,maybe?)
            // a reverse proxy is recommended in pure client-side rendering mode to get the posts from the fediverse instance
            // that requires to be authorized to use search api the instance
            useReverseProxy: false,
            reverseProxyUrl: '', // the url of the reverse proxy, usually a cloudflare worker proxying the search api
            // the reverse proxy should be able to handle the following request:
            // GET /api/v1/search?q={query}&type=statuses&account_id=12345678
            // GET /api/v1/statuses/12345678/context
            // response body should be returned from the origin (fediverse instance) as-is.
            accountId: '', // the account id to search posts from, can be got from api like: https://{instance}/api/v1/accounts/{username without domain part}
            instanceDomain: '', // the domain of the fediverse instance to search posts from
            useV2api: true, // use /api/v2/search instead of /api/v1/search to search on instance using newer version of mastodon/pleroma/akkoma
            token: process.env.MASTODON_API_TOKEN, // the token to use to authenticate with the fediverse instance, usually a read:search-only token
        },
        hatsu: {
            // use hatsu.cli.rs to get replies from the fediverse
            instanceDomain: '',
        }
    }
}