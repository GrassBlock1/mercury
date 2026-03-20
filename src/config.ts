export const siteConfig = {
    // site meta info
    title: '/var/log/mercury',
    description: 'A blog about software development, technology, and life.',
    homepageOgImage: '',
    defaultAuthor: {
        // (optional) an id in the authors.yaml, will override the setting below (if id exists)
        id: 'd6e4661d',
        name: 'GrassBlock1',
        email: 'hi@mercury.info',
    },
    // features
    // enable single page application mode, this will enable navigation (with fade transitions) without reloading the page, and enable client-side routing
    spa: false,
    // enable PWA, which will allow users install the site as a web app on their device
    pwa: false,
    // disable client-side JavaScript, this will:
    // 1. disable most built-in client-side JavaScript from rendering (protected content component and umami still needs javascript to function, sorry)
    // 2. the full text search will be redirected to a search engine
    // 3. the comments will be globally disabled
    // 4. the night mode & back to top will not use JavaScript to function
    // 5. the neko will be force-disabled
    noClientJavaScript: false,
    // site components
    i18n: {
        // TODO
        // Only 'content/posts/<language codes>/' is supported for now.
        // experimental. Make i18n posts and pages works for /content/posts/something.[lang].md,
        // if you are used to the structure with the default hugo config, or to make it simple, set this to true.
        useLanguageSuffixInFiles: false,
        // TODO: let users localize the navbar items.
        // This will overwrite the .navBarItems when configured.
        navBarItems: {
            en: [],
            "zh-CN": [],
        }
    },
    navBarItems: [
        // additional items in the navbar
        // the order of the items will be the same as the order in the array
        // format is { text: string, link: string, openInNewTab?: boolean (default: true) }
        {text: "RSS", link: "/rss.xml", openInNewTab: true},
        {text: "GitHub", link: "https://github.com/GrassBlock1/mercury", openInNewTab: false},
    ],
    // search
    // The search engine used to search posts when noClientJavaScript is enabled
    // can be `google`, `duckduckgo`, `bing` (broken until M1cr0$0ft get support for it), defaults to `google`
    searchEngine: 'duckduckgo',
    // content
    // display author avatar in the info line of article page
    displayAvatar: true,
    // newsletter settings
    // enable newsletter subscription in post list page
    newsletter: {
        enabled: false,
        // The service to use. Only listmonk is supported for now, more will be added later
        type: 'listmonk',
        listmonk: {
            // the domain of your listmonk instance
            instanceDomain: 'listmonk.yourdomain.com',
            // the id of the list to subscribe to, can be found in the listmonk admin panel
            listuuid: '3546fc35-fd75-4163-936a-114514191981',
        }
    },
    // outdated callout
    // enable the callout to notify users that the content maybe outdated, this will add a callout to the top of the article page,
    outdatedCallout: {
        // enable the outdated callout
        enabled: true,
        // the number of days before the content is considered outdated, defaults to 90 days
        daysBeforeOutdated: 90,
    },
    // encryption
    // the global password to encrypt/decrypt the content, if set, all <ProtectedContent/> without specifying a password will be encrypted with this password
    // To use an environment variable to set the password, replace the value with `import.meta.env.CONTENT_PASSWORD`
    // (or `process.env.CONTENT_PASSWORD`, `CONTENT_PASSWORD` can be any string) and set the environment variable in your deployment service.
    contentPassword: 'p1easeChangeMe!',
    // copyright notice
    copyright: {
        // The type of copyright license, defaults to 'All rights reserved'
        type: '',
        // The link to the full text of the license
        url: '',
    },
    // comments
    comments: {
        // can be `artalk`,`giscus`,`fediverse`, `hatsu`,`oom`,`twikoo`,`waline`
        type: 'artalk',
        // artalk config
        artalk: {
            // the domain of your artalk instance
            instanceDomain: '',
            // the site name of the current site in artalk dashboard, default is `default`
            site: '',
        },
        giscus: {
            // get these params from giscus.app
            repo: "[ENTER REPO HERE]",
            repoId: "[ENTER REPO ID HERE]",
            category: "[ENTER CATEGORY NAME HERE]",
            categoryId: "[ENTER CATEGORY ID HERE]",
            mapping: "pathname",
            term: "Welcome to comment powered by @giscus",
            strict: "0",
            reactionsEnabled: "1",
            emitMetadata: "0",
            inputPosition: "bottom",
            theme: "preferred_color_scheme",
            lang: "en"
        },
        // use Mastodon (compatible) api to search posts and parse replies.
        // It will search for the post's link by default
        // The comments will render on server-side,
        // at build by default, but can be fetched realtime on server using server:defer
        // WIP
        fediverse: {
            // set a reverse proxy to fetch the results.
            // It is recommended to set one in pure client-side rendering mode to get the posts from the fediverse instance
            // that requires to be authorized to use search api.
            useReverseProxy: false,
            // the url of the reverse proxy, usually a cloudflare worker proxying the search api
            // the reverse proxy should be able to handle the following request:
            // `GET /api/v1/search?q={query}&type=statuses&account_id=12345678` (TODO: search all posts)
            // `GET /api/v1/statuses/12345678/context`
            // response body should be returned from the origin (fediverse instance) as-is.
            reverseProxyUrl: '',
            // the account id to search posts from, can be got from api like: https://{instance}/api/v1/accounts/{username without domain part}
            // It will be deprecated in the future.
            accountId: '',
            // the domain of the fediverse instance to search posts from
            instanceDomain: '',
            // use `/api/v2/search` instead of `/api/v1/search` to search on instance using newer version of mastodon/pleroma/akkoma
            useV2api: true,
            // the token to use to authenticate with the fediverse instance, usually a read:search-only token
            token: process.env.MASTODON_API_TOKEN,
        },
        // hatsu.cli.rs
        // Get replies from the fediverse using hatsu.
        // To make this fully work you should also make changes to the Layout.astro according to the docs.
        hatsu: {
            instanceDomain: '',
        },
        // use twikoo to get comments
        twikoo: {
            // the env id/domain of your twikoo instance, see https://twikoo.js.org/backend.html
            envId: 'your-env-id',
            // the deployment region of your twikoo instance, can be `ap-shanghai`, `ap-guangzhou`,
            // leave it empty if you are not serving twikoo on Tencent Cloud.
            region: ''
        },
        waline: {
            serverURL: '' // the domain of your waline instance, usually your-waline-instance.com
        }
    },
    // footer
    // you can write HTML safely here
    customFooter: '<i>I have no mouth, and I must SCREAM</i>',
    // the preset of the "powered by" text
    // defaults to 'Powered by Mercury', see PoweredBy.astro for more details
    // can be any values in `default`, `withastro`, `plain`, `plainwithastro`, `formula`, `iconsonly` and `none`, any other value will be treated as `default`.
    poweredByPreset: '',
    // site analytics
    // by enabling this, you can track the visitors of your site
    siteAnalytics: {
        // enable analytics
        enabled: false,
        // can be one of `umami`, `goatcounter`
        type: 'umami',
        // umami config
        umami: {
            // the domain of the umami instance, usually your-umami-instance.com (default: official cloud.umami.is)
            instanceDomain: 'cloud.umami.is',
            // the id of your website in umami, get it from your umami dashboard
            websiteId: 'your-website-id',
            // also use pixels.
            // umami pixels: https://docs.umami.is/docs/pixels
            // will be used as a fallback when JavaScript is disabled.
            // Note: the pixels record less information than the JavaScript code due to limitations.
            pixelURL: 'https://cloud.umami.is/pixel-url', // the url of your pixel
        },
        // goatcounter config.
        // It provides solutions for tracking visitors without JavaScript.
        goatcounter: {

            // the domain of the goatcounter instance, usually your-goatcounter-instance.com
            instanceDomain: 'yourcodehere.goatcounter.com',
        },
    },
    // neko
    // add a neko that follows cursor to your site.
    // Attention: this will load script from webneko.net.
    neko: {
        enabled: false,
        // Choose a neko. For a full list, check https://webneko.net/
        type: 'mike'
    }
}