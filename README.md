# Mercury

Terminal-like blog theme built from [Astro](https://astro.build), still in early beta.

Demo: https://icy-beach-00f5be01e.6.azurestaticapps.net/

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🌌 Features
- Minimal, terminal like
- Ship only necessary JavaScript
- Full text search based on `Fuse.js`
- Full text RSS
- Create Blogrolls via a yaml file
- Your status at Fediverse, now at your home
- Comments powered by multiple engines

## 🚀 Getting Started
clone the repo and install dependencies:

```bash
git clone https://git.gb0.dev/gb/mercury.git
```
```bash
cd mercury && pnpm install
```
run the dev server:

```bash
pnpm run dev
```
open [localhost:4321](http://localhost:4321) in your browser.

## 🔧 Usage
All you need is editing the `astro.config.mjs`'s site & base.

For further config, edit `src/config.ts` according to the comment.

To start writing, put your markdown & mdx files to /src/content/posts folder.

To create a page, put markdown files into /src/content/pages folder.

Shortcode-like components is also available at /src/components/shortcodes folder.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

See the post [🕊](). I hope you like it. 💜

## ⚖️ License
GNU Affero Public License 3.0