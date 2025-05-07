export const siteConfig = {
    title: '/var/log/mercury',
    description: 'A blog about software development, technology, and life.',
    comments: {
        type: 'artalk', // 'artalk','giscus','fediverse','hatsu'
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
            instanceDomain: '', // the domain of the fediverse instance to search posts from
            useV2api: false, // use /api/v2/search instead of /api/v1/search to search on instance using newer version of mastodon
            token: process.env.MASTODON_API_TOKEN, // the token to use to authenticate with the fediverse instance, usually a read:search-only token
            // or use a reverse proxy api to return posts on instance, useful if you publish the site in SSG mode.
            // the instanceDomain and token will be ignored if useReverseProxy is true and reverseProxyUrl is used.
            useReverseProxy: false,
            reverseProxyUrl: '', // the url of the reverse proxy, usually a cloudflare worker proxying the search api
            accountId: '' // the account id to search posts from, can be got from api like: https://{instance}/api/v1/accounts/{username without domain part}
        },
        hatsu: {
            // use hatsu.cli.rs to get replies from the fediverse
            instanceDomain: '',
        }
    }
}