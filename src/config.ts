export const siteConfig = {
    // site meta info
    title: '/var/log/mercury',
    description: 'A blog about software development, technology, and life.',
    homepageOgImage: '',
    defaultAuthor: {
      id: 'd6e4661d', // (optional) an id in the authors.yaml, will override the setting below (if id exists)
      name: 'GrassBlock1',
      email: 'hi@mercury.info',
    },
    // features
    spa: false, // enable single page application mode, this will enable navigation (with fade transitions) without reloading the page, and enable client-side routing
    pwa: false, // enable PWA, which will allow users install the site as a web app on their device
    noClientJavaScript: false, // disable client-side javascript, this will:
    // 1. disable most built-in client-side javascript from rendering (protected content component and umami still needs javascript to function, sorry)
    // 2. the full text search will be redirected to a search engine
    // 3. the comments will be globally disabled
    // 4. the night mode & back to top will not use Javascript to function
    // 5. the neko will be force-disabled
    // site components
    navBarItems: [
        // additional items in the navbar
        // the order of the items will be the same as the order in the array
        // format is { text: string, link: string, openInNewTab?: boolean (default: true) }
        { text: "RSS", link: "/rss.xml", openInNewTab: true },
        { text: "GitHub", link: "https://github.com/GrassBlock1/mercury", openInNewTab: false },
    ],
    // search
    // This only works when noClientJavaScript is enabled
    searchEngine: 'duckduckgo', // 'google', 'duckduckgo', 'bing' (broken until M1cr0$0ft get support for it), defaults to 'google'
    // content
    displayAvatar: true, // display author avatar in the article list and info line of article page
    newsletter: {
        enabled: false, // enable newsletter subscription in post list page
        type: 'listmonk', //  only 'listmonk' is supported for now, more will be added later
        listmonk: {
            instanceDomain: 'listmonk.yourdomain.com', // the domain of your listmonk instance
            listuuid: '3546fc35-fd75-4163-936a-114514191981', // the id of the list to subscribe to, can be found in the listmonk admin panel
        }
    },
    // outdated callout
    // enable the callout to notify users that the content maybe outdated, this will add a callout to the top of the article page,
    // initialized by the server islands
    outdatedCallout: {
        enabled: true, // enable the outdated callout
        daysBeforeOutdated: 90, // the number of days before the content is considered outdated, defaults to 90 days
    },
    // encryption
    // the global password to encrypt/decrypt the content, if set, all <ProtectedContent/> without specifying a password will be encrypted with this password
    // To use an environment variable to set the password, replace the value with `import.meta.env.CONTENT_PASSWORD`
    // (or process.env.CONTENT_PASSWORD, CONTENT_PASSWORD can be any string) and set the environment variable in your deployment service.
    contentPassword: 'p1easeChangeMe!',
    // copyright notice
    copyright: {
        type: '', // The type of copyright license, defaults to 'All rights reserved'
        url: '', // The link to the full text of the license
    },
    // comments
    comments: {
        type: 'artalk', // 'artalk','giscus','fediverse','email','hatsu','oom','twikoo','waline'
        artalk: {
            instanceDomain: '', // the domain of your artalk instance
            site: '', // the site name of the current site in artalk dashboard, default is "default"
        },
        giscus: {
            // get these params from giscus.app
            repo:"[ENTER REPO HERE]",
            repoId: "[ENTER REPO ID HERE]",
            category:"[ENTER CATEGORY NAME HERE]",
            categoryId:"[ENTER CATEGORY ID HERE]",
            mapping:"pathname",
            term: "Welcome to comment powered by @giscus",
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
        },
        twikoo: {
            // use twikoo to get comments
            envId: 'your-env-id', // the env id/domain of your twikoo instance, see https://twikoo.js.org/backend.html
            region: '' // the deployment region of your twikoo instance, can be 'ap-shanghai', 'ap-guangzhou', if you are not deploying twikoo on Tencent Cloud, leave it empty
        },
        waline: {
            serverURL: '' // the domain of your waline instance, usually your-waline-instance.com
        }
    },
    // footer
    // yes you can write html safely here
    customFooter: '<i>I have no mouth, and I must SCREAM</i>',
    // the preset of the powered by text
    // defaults to 'Powered by Mercury', see PoweredBy.astro for more details
    // choose from 'default', 'withastro', 'plain', 'plainwithastro', 'formula', 'iconsonly' and 'none', any other value will be treated as 'default'
    poweredByPreset: '',
    // umami analytics
    // by enabling this, you can track the visitors of your site
    siteAnalytics: {
        enabled: false, // enable analytics
        type: 'umami', // 'umami', 'goatcounter'
        umami: {
            instanceDomain: 'cloud.umami.is', // the domain of the umami instance, usually your-umami-instance.com (default: official cloud.umami.is)
            websiteId: 'your-website-id', // the id of your website in umami, get it from your umami dashboard
        },
        goatcounter: {
            // provide solutions for tracking visitors without Javascript
            instanceDomain: 'yourcodehere.goatcounter.com', // the domain of the goatcounter instance, usually your-goatcounter-instance.com
        },
    },
    // neko
    // by enabling this, you can add a neko that follows cursor to your site
    // this will load script from webneko.net
    neko: {
        enabled: false,
        type: 'mike' // more available, for a full list, check https://webneko.net/
    }
}