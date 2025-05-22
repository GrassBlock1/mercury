export const siteConfig = {
    // site meta info
    title: '/var/log/mercury',
    description: 'A blog about software development, technology, and life.',
    homepageOgImage: '',
    // features
    noClientJavaScript: false, // disable client-side javascript, this will:
    // 1. disable all built-in client-side javascript from rendering
    // 2. the full text search will be redirected to a search engine
    // 3. the comments will be replaced with email reply
    // 4. the night mode & back to top will not use Javascript to function
    // 5. the neko will be force-disabled
    // site components
    navBarItems: [
        // additional items in the navbar
        // the order of the items will be the same as the order in the array
        // format is { text: string, link: string }
        { text: "RSS", link: "/rss.xml" },
        { text: "GitHub", link: "https://github.com/GrassBlock1/mercury" },
    ],
    // footer
    // yes you can write html safely here
    customFooter: '<i>I have no mouth, and I must SCREAM</i>',
    // comments
    comments: {
        type: 'artalk', // 'artalk','giscus','fediverse','email','hatsu'
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
            // but if you want to deploy site on Cloudflare pages or other services that supported by astro adapters you can set it to true.
            // you may get warning from the console about the project not containing any server rendered page, but it is ok.
            // to fix this add a `export const prerender = false` to Comments.astro
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
    },
    // neko
    // by enabling this, you can add a neko that follows cursor to your site
    // this will load script from webneko.net
    neko: {
        enabled: false,
        type: 'mike' // more available, for a full list, check https://webneko.net/
    }
}